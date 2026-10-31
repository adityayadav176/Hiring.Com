
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    PhoneOff,
    MonitorUp,
    Users,
    MessageSquare,
    ClipboardList,
    FileText,
    Settings2,
    ShieldCheck,
    Copy,
    Check,
    CircleHelp,
    Signal,
    Sparkles,
    Camera,
    MoreHorizontal,
} from "lucide-react";

import { createInterviewSocket } from "../../services/interviewSocket";

const RTC_CONFIG = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
    ],
};

const normalizeRole = (role) => {
    if (role === "User" || role === "candidate") {
        return "candidate";
    }

    if (role === "recruiter") {
        return "recruiter";
    }

    return null;
};

export default function InterviewRoom() {
    const { interviewId: routeInterviewId } = useParams();
    const navigate = useNavigate();

    const interviewId =
        typeof routeInterviewId === "string" &&
        /^[a-f\d]{24}$/i.test(routeInterviewId)
            ? routeInterviewId
            : null;

    // Media refs
    const localVideoRef = useRef(null);
    const stageVideoRef = useRef(null);

    const cameraStreamRef = useRef(null);
    const screenStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);

    // Socket and WebRTC refs
    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const pendingIceRef = useRef([]);

    // Room state refs
    const roleRef = useRef("");
    const activeRef = useRef(false);
    const makingOfferRef = useRef(false);
    const leavingRef = useRef(false);

    // Local media state
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [sharing, setSharing] = useState(false);

    // Room state
    const [joined, setJoined] = useState(false);
    const [remoteConnected, setRemoteConnected] = useState(false);

    // Remote participant state
    const [remoteCameraOn, setRemoteCameraOn] = useState(true);
    const [remoteMicOn, setRemoteMicOn] = useState(true);
    const [remoteSharing, setRemoteSharing] = useState(false);

    // UI state
    const [status, setStatus] = useState("Connecting");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [copied, setCopied] = useState(false);

    // --------------------------------------------------
    // SOCKET EMITTER
    // --------------------------------------------------

    const emitSignal = useCallback(
        (event, payload = {}) => {
            const socket = socketRef.current;

            if (!socket?.connected || !interviewId) {
                return false;
            }

            socket.emit(event, {
                interviewId,
                ...payload,
            });

            return true;
        },
        [interviewId]
    );

    // --------------------------------------------------
    // CLOSE WEBRTC CONNECTION
    // --------------------------------------------------

    const closePeerConnection = useCallback(() => {
        const pc = peerRef.current;

        if (pc) {
            pc.ontrack = null;
            pc.onicecandidate = null;
            pc.onconnectionstatechange = null;

            pc.getSenders().forEach((sender) => {
                try {
                    sender.replaceTrack(null);
                } catch {
                    // The peer connection may already be closed.
                }
            });

            pc.close();
        }

        peerRef.current = null;
        remoteStreamRef.current = null;
        pendingIceRef.current = [];
        makingOfferRef.current = false;

        if (stageVideoRef.current) {
            stageVideoRef.current.srcObject = null;
        }

        setRemoteConnected(false);
        setRemoteCameraOn(true);
        setRemoteMicOn(true);
        setRemoteSharing(false);
    }, []);

    // --------------------------------------------------
    // CREATE PEER CONNECTION
    // --------------------------------------------------

    const createPeerConnection = useCallback(() => {
        if (peerRef.current) {
            return peerRef.current;
        }

        const cameraStream = cameraStreamRef.current;

        if (!cameraStream) {
            throw new Error(
                "Camera and microphone are not ready."
            );
        }

        const pc = new RTCPeerConnection(RTC_CONFIG);

        peerRef.current = pc;

        // Add microphone tracks.
        cameraStream.getAudioTracks().forEach((track) => {
            pc.addTrack(track, cameraStream);
        });

        // Add screen video if sharing; otherwise camera video.
        const screenTrack =
            screenStreamRef.current?.getVideoTracks()[0];

        const cameraTrack =
            cameraStream.getVideoTracks()[0];

        const videoTrack = screenTrack || cameraTrack;

        if (videoTrack) {
            const videoStream = screenTrack
                ? screenStreamRef.current
                : cameraStream;

            pc.addTrack(videoTrack, videoStream);
        }

        // ----------------------------------------------
        // REMOTE TRACK HANDLER
        // ----------------------------------------------

        pc.ontrack = (event) => {
            if (
                !activeRef.current ||
                peerRef.current !== pc
            ) {
                return;
            }

            let remoteStream = remoteStreamRef.current;

            if (!remoteStream) {
                remoteStream = new MediaStream();
                remoteStreamRef.current = remoteStream;
            }

            const incomingStream = event.streams?.[0];

            const incomingTracks = incomingStream
                ? incomingStream.getTracks()
                : [event.track];

            incomingTracks.forEach((track) => {
                const exists = remoteStream
                    .getTracks()
                    .some(
                        (existingTrack) =>
                            existingTrack.id === track.id
                    );

                if (!exists) {
                    remoteStream.addTrack(track);
                }
            });

            if (stageVideoRef.current) {
                stageVideoRef.current.srcObject = remoteStream;

                stageVideoRef.current.play().catch(() => {
                    setNotice(
                        "Click the remote video if playback is blocked."
                    );
                });
            }

            setRemoteConnected(true);
            setRemoteCameraOn(
                remoteStream
                    .getVideoTracks()
                    .some((track) => track.enabled)
            );

            setStatus("Receiving remote media");
            setError("");

            event.track.onended = () => {
                if (!activeRef.current) {
                    return;
                }

                if (event.track.kind === "video") {
                    setRemoteCameraOn(false);
                }

                if (event.track.kind === "audio") {
                    setRemoteMicOn(false);
                }
            };
        };

        // ----------------------------------------------
        // ICE CANDIDATE HANDLER
        // ----------------------------------------------

        pc.onicecandidate = (event) => {
            if (event.candidate && activeRef.current) {
                emitSignal("ice_candidate", {
                    candidate: event.candidate.toJSON(),
                });
            }
        };

        // ----------------------------------------------
        // CONNECTION STATE HANDLER
        // ----------------------------------------------

        pc.onconnectionstatechange = () => {
            if (
                !activeRef.current ||
                peerRef.current !== pc
            ) {
                return;
            }

            switch (pc.connectionState) {
                case "connected":
                    setRemoteConnected(true);
                    setStatus("Video call connected");
                    setError("");
                    break;

                case "connecting":
                    setStatus("Connecting to participant");
                    break;

                case "disconnected":
                    setRemoteConnected(false);
                    setStatus("Connection interrupted");
                    break;

                case "failed":
                    setRemoteConnected(false);
                    setStatus("Connection failed");
                    setError(
                        "WebRTC could not connect. A TURN server may be required for your network."
                    );
                    break;

                case "closed":
                    setRemoteConnected(false);
                    break;

                default:
                    break;
            }
        };

        return pc;
    }, [emitSignal]);

    // --------------------------------------------------
    // FLUSH QUEUED ICE CANDIDATES
    // --------------------------------------------------

    const flushPendingIce = useCallback(async (pc) => {
        if (!pc?.remoteDescription) {
            return;
        }

        const queued = pendingIceRef.current.splice(0);

        for (const candidate of queued) {
            try {
                await pc.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            } catch (err) {
                console.error(
                    "Could not add queued ICE candidate:",
                    err
                );
            }
        }
    }, []);

    // --------------------------------------------------
    // RECRUITER CREATES WEBRTC OFFER
    // --------------------------------------------------

    const makeOffer = useCallback(async () => {
        if (roleRef.current !== "recruiter") {
            return;
        }

        if (
            makingOfferRef.current ||
            !socketRef.current?.connected
        ) {
            return;
        }

        if (
            peerRef.current &&
            peerRef.current.signalingState !== "stable"
        ) {
            return;
        }

        makingOfferRef.current = true;

        try {
            const pc = createPeerConnection();

            const offer = await pc.createOffer();

            await pc.setLocalDescription(offer);

            const sent = emitSignal("offer", {
                offer: pc.localDescription.toJSON(),
            });

            if (!sent) {
                closePeerConnection();

                setStatus("Reconnecting to interview server");

                return;
            }

            setStatus("Calling participant");
            setError("");
        } catch (err) {
            console.error(
                "Could not create WebRTC offer:",
                err
            );

            setError(
                err.message || "Unable to start the video call."
            );
        } finally {
            makingOfferRef.current = false;
        }
    }, [
        createPeerConnection,
        emitSignal,
        closePeerConnection,
    ]);

    // --------------------------------------------------
    // INTERVIEW SOCKET INITIALIZATION
    // --------------------------------------------------

    useEffect(() => {
        if (!interviewId) {
            setError(
                "A valid MongoDB Interview ID is missing. Open this page using the interview document's _id."
            );

            setStatus("Room unavailable");

            return undefined;
        }

        let active = true;
        let socket = null;
        let localStream = null;
        let joinTimeout = null;

        activeRef.current = true;
        leavingRef.current = false;
        roleRef.current = "";

        setJoined(false);
        setRemoteConnected(false);
        setError("");
        setNotice("");
        setStatus("Requesting camera and microphone");

        const clearJoinTimeout = () => {
            if (joinTimeout !== null) {
                window.clearTimeout(joinTimeout);
                joinTimeout = null;
            }
        };

        // ----------------------------------------------
        // INTERVIEW ID VALIDATION FOR SOCKET EVENTS
        // ----------------------------------------------

        const isCurrentInterview = (data = {}) => {
            if (!data.interviewId) {
                return true;
            }

            return (
                String(data.interviewId).toLowerCase() ===
                interviewId.toLowerCase()
            );
        };

        // ----------------------------------------------
        // ROOM JOIN CONFIRMATION
        // ----------------------------------------------

        const onJoined = async (data = {}) => {
            if (!active || !isCurrentInterview(data)) {
                return;
            }

            console.log(
                "[FRONTEND] Interview room confirmation:",
                data
            );

            clearJoinTimeout();

            const normalizedRole = normalizeRole(data.role);

            if (
                data.success !== true ||
                !normalizedRole ||
                !isCurrentInterview(data)
            ) {
                setJoined(false);
                setStatus("Unable to verify room");

                setError(
                    data.message ||
                        "The server returned an invalid interview room confirmation."
                );

                return;
            }

            roleRef.current = normalizedRole;

            setJoined(true);
            setError("");

            if (data.peerPresent) {
                setStatus("Participant found");

                setNotice(
                    normalizedRole === "recruiter"
                        ? "Candidate is already in the room. Connecting your video call..."
                        : "Recruiter is already in the room. Preparing your video call..."
                );

                // Recruiter is responsible for creating the offer.
                if (normalizedRole === "recruiter") {
                    await makeOffer();
                }
            } else {
                setStatus("Waiting for participant");

                setNotice(
                    normalizedRole === "recruiter"
                        ? "Your interview room is ready. The candidate will appear here when they join."
                        : "You've joined successfully. Waiting for the recruiter to connect."
                );
            }

            console.log("[INTERVIEW DEBUG] Room joined:", {
    response: data,
    expectedInterviewId: interviewId,
    normalizedRole: normalizeRole(data.role),
    socketId: socket?.id,
});
        };

        // ----------------------------------------------
        // OTHER PARTICIPANT JOINED
        // ----------------------------------------------

        const onUserJoined = async (data = {}) => {
            if (!active || !isCurrentInterview(data)) {
                return;
            }

            const participantRole = normalizeRole(data.role);

            if (!participantRole) {
                console.warn(
                    "[InterviewRoom] Unknown participant role:",
                    data.role
                );

                return;
            }

            const participantName =
                participantRole === "candidate"
                    ? "Candidate"
                    : "Recruiter";

            setStatus(`${participantName} joined`);

            setNotice(
                `${participantName} joined the interview. Preparing the video connection...`
            );

            // Only recruiter creates the initial offer.
            if (
                roleRef.current === "recruiter" &&
                participantRole === "candidate"
            ) {
                await makeOffer();
            }
        };

        // ----------------------------------------------
        // CANDIDATE RECEIVES OFFER
        // ----------------------------------------------

        const onOffer = async (data = {}) => {
            if (
                !active ||
                !data.offer ||
                !isCurrentInterview(data)
            ) {
                return;
            }

            if (roleRef.current !== "candidate") {
                return;
            }

            console.log("[INTERVIEW DEBUG] Offer received:", {
    role: roleRef.current,
    interviewId: data.interviewId,
    hasOffer: Boolean(data.offer),
});

            try {
                let pc = peerRef.current;

                if (
                    pc &&
                    pc.signalingState !== "stable"
                ) {
                    closePeerConnection();
                    pc = null;
                }

                pc = createPeerConnection();

                await pc.setRemoteDescription(
                    new RTCSessionDescription(data.offer)
                );

                await flushPendingIce(pc);

                const answer = await pc.createAnswer();

                await pc.setLocalDescription(answer);

                emitSignal("answer", {
                    answer: pc.localDescription.toJSON(),
                });

                setStatus("Answer sent");
                setError("");
            } catch (err) {
                console.error(
                    "Could not handle WebRTC offer:",
                    err
                );

                setError(
                    err.message || "Unable to answer the call."
                );
            }

            
        };

        // ----------------------------------------------
        // RECRUITER RECEIVES ANSWER
        // ----------------------------------------------

        const onAnswer = async (data = {}) => {
            if (
                !active ||
                !data.answer ||
                !isCurrentInterview(data)
            ) {
                return;
            }

            try {
                const pc = peerRef.current;

                if (
                    !pc ||
                    pc.signalingState !== "have-local-offer"
                ) {
                    return;
                }

                await pc.setRemoteDescription(
                    new RTCSessionDescription(data.answer)
                );

                await flushPendingIce(pc);

                setStatus("Answer received");
                setError("");
            } catch (err) {
                console.error(
                    "Could not handle WebRTC answer:",
                    err
                );

                setError(
                    "Unable to complete the video call handshake."
                );
            }
        };

        // ----------------------------------------------
        // ICE CANDIDATE RECEIVED
        // ----------------------------------------------

        const onIceCandidate = async (data = {}) => {
            if (
                !active ||
                !data.candidate ||
                !isCurrentInterview(data)
            ) {
                return;
            }

            const pc = peerRef.current;

            // Queue candidates until remote description exists.
            if (!pc || !pc.remoteDescription) {
                pendingIceRef.current.push(data.candidate);
                return;
            }

            try {
                await pc.addIceCandidate(
                    new RTCIceCandidate(data.candidate)
                );
            } catch (err) {
                console.error(
                    "Could not add ICE candidate:",
                    err
                );
            }
        };

        // ----------------------------------------------
        // OTHER PARTICIPANT LEFT
        // ----------------------------------------------

        const onUserLeft = (data = {}) => {
            if (!active || !isCurrentInterview(data)) {
                return;
            }

            closePeerConnection();

            setStatus("Participant left the room");

            setNotice(
                data.disconnected
                    ? "The other participant disconnected. You can wait for them to reconnect."
                    : "The other participant left the interview."
            );
        };

        // ----------------------------------------------
        // REMOTE CAMERA STATE
        // ----------------------------------------------

        const onRemoteCamera = (data = {}) => {
            if (
                active &&
                isCurrentInterview(data) &&
                typeof data.enabled === "boolean"
            ) {
                setRemoteCameraOn(data.enabled);
            }
        };

        // ----------------------------------------------
        // REMOTE MICROPHONE STATE
        // ----------------------------------------------

        const onRemoteMic = (data = {}) => {
            if (
                active &&
                isCurrentInterview(data) &&
                typeof data.enabled === "boolean"
            ) {
                setRemoteMicOn(data.enabled);
            }
        };

        // ----------------------------------------------
        // REMOTE SCREEN SHARING
        // ----------------------------------------------

        const onRemoteScreenStarted = (data = {}) => {
            if (!active || !isCurrentInterview(data)) {
                return;
            }

            setRemoteSharing(true);
            setNotice("The other participant started sharing their screen.");
        };

        const onRemoteScreenStopped = (data = {}) => {
            if (!active || !isCurrentInterview(data)) {
                return;
            }

            setRemoteSharing(false);
            setNotice("The other participant stopped sharing their screen.");
        };

        // ----------------------------------------------
        // SOCKET ERROR
        // ----------------------------------------------

        const onSocketError = (data = {}) => {
            if (!active) {
                return;
            }

            setError(
                data.message || "Socket operation failed."
            );
        };

        // ----------------------------------------------
        // INTERVIEW ERROR
        // ----------------------------------------------

        const onInterviewError = (data = {}) => {
            if (!active) {
                return;
            }

            clearJoinTimeout();

            setJoined(false);
            setStatus("Unable to join room");
            console.error("[INTERVIEW DEBUG] Interview join error:", data);

            setError(
                data.message || "Unable to join interview."
            );
        };

        // ----------------------------------------------
        // SOCKET DISCONNECTED
        // ----------------------------------------------

        const onDisconnect = (reason) => {
            if (!active) {
                return;
            }

            console.warn(
                "[InterviewRoom] Socket disconnected:",
                reason
            );

            clearJoinTimeout();

            setJoined(false);
            setStatus("Disconnected");

            closePeerConnection();
        };

        // ----------------------------------------------
        // SOCKET CONNECTION ERROR
        // ----------------------------------------------

        const onConnectError = (err) => {
            if (!active) {
                return;
            }

            setStatus("Connection failed");

            console.error("[INTERVIEW DEBUG] Socket authentication/connection error:", {
    message: err.message,
    description: err.description,
});

            setError(
                err.message ||
                    "Unable to connect to the interview server."
            );
        };

        // ----------------------------------------------
        // INTERVIEW CALL ENDED
        // ----------------------------------------------

        const onCallEnded = (data = {}) => {
            if (!active || !isCurrentInterview(data)) {
                return;
            }

            closePeerConnection();

            setStatus("Call ended");
            setNotice("The interview call has ended.");
        };

        // ----------------------------------------------
        // SOCKET CONNECTED
        // ----------------------------------------------

        const onConnect = () => {
            if (!active || !socket) {
                return;
            }

            console.log(
                "[FRONTEND] Socket connected:",
                socket.id
            );

            clearJoinTimeout();

            setStatus("Verifying room");
            setError("");

            console.log(
                "[FRONTEND] Sending join_interview:",
                {
                    interviewId,
                    connected: socket.connected,
                }
            );

            // Backend accepts { interviewId }.
            socket.emit("join_interview", {
                interviewId,
            });

            joinTimeout = window.setTimeout(() => {
                if (!active || !socket.connected) {
                    return;
                }

                if (!roleRef.current) {
                    console.error(
                        "[FRONTEND] No interview_joined confirmation received"
                    );

                    setStatus("Room verification timed out");

                    setError(
                        "The server connected but did not confirm the interview room. Check the backend join_interview handler and interview authorization."
                    );
                }
            }, 12000);
        };

        // ----------------------------------------------
        // INITIALIZE CAMERA AND SOCKET
        // ----------------------------------------------

        const initialize = async () => {
            try {
                if (
                    !navigator.mediaDevices?.getUserMedia
                ) {
                    throw new Error(
                        "Camera access requires HTTPS or localhost in a supported browser."
                    );
                }

                // Request local camera and microphone.
                localStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    });

                if (!active) {
                    localStream
                        .getTracks()
                        .forEach((track) => track.stop());

                    return;
                }

                cameraStreamRef.current = localStream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject =
                        localStream;
                }

                // Create socket.
                socket = createInterviewSocket();

                socketRef.current = socket;

                // Register listeners BEFORE connecting.
                socket.on("interview_joined", onJoined);

                socket.on(
                    "interview_user_joined",
                    onUserJoined
                );

                socket.on("offer", onOffer);
                socket.on("answer", onAnswer);

                socket.on(
                    "ice_candidate",
                    onIceCandidate
                );

                socket.on(
                    "interview_user_left",
                    onUserLeft
                );

                socket.on(
                    "remote_camera_toggled",
                    onRemoteCamera
                );

                socket.on(
                    "remote_microphone_toggled",
                    onRemoteMic
                );

                socket.on(
                    "remote_screen_share_started",
                    onRemoteScreenStarted
                );

                socket.on(
                    "remote_screen_share_stopped",
                    onRemoteScreenStopped
                );

                socket.on(
                    "socket_error",
                    onSocketError
                );

                socket.on(
                    "interview_error",
                    onInterviewError
                );

                socket.on(
                    "connect_error",
                    onConnectError
                );

                socket.on(
                    "disconnect",
                    onDisconnect
                );

                socket.on(
                    "call_ended",
                    onCallEnded
                );

                socket.on("connect", onConnect);

                console.log(
                    "[InterviewRoom] Initializing:",
                    {
                        interviewId,
                        socketConnected: socket.connected,
                    }
                );

                if (socket.connected) {
                    onConnect();
                } else {
                    socket.connect();
                }
            } catch (err) {
                if (!active) {
                    return;
                }

                setStatus("Setup needs attention");

                if (err.name === "NotAllowedError") {
                    setError(
                        "Allow camera and microphone access in your browser."
                    );
                } else if (err.name === "NotFoundError") {
                    setError(
                        "No camera or microphone was found."
                    );
                } else if (err.name === "NotReadableError") {
                    setError(
                        "Your camera or microphone is already being used by another application."
                    );
                } else {
                    setError(
                        err.message ||
                            "Could not initialize your devices."
                    );
                }
            }
        };

        initialize();

        // ----------------------------------------------
        // CLEANUP
        // ----------------------------------------------

        return () => {
            active = false;
            activeRef.current = false;

            clearJoinTimeout();

            if (socket) {
                socket.off("interview_joined", onJoined);

                socket.off(
                    "interview_user_joined",
                    onUserJoined
                );

                socket.off("offer", onOffer);
                socket.off("answer", onAnswer);

                socket.off(
                    "ice_candidate",
                    onIceCandidate
                );

                socket.off(
                    "interview_user_left",
                    onUserLeft
                );

                socket.off(
                    "remote_camera_toggled",
                    onRemoteCamera
                );

                socket.off(
                    "remote_microphone_toggled",
                    onRemoteMic
                );

                socket.off(
                    "remote_screen_share_started",
                    onRemoteScreenStarted
                );

                socket.off(
                    "remote_screen_share_stopped",
                    onRemoteScreenStopped
                );

                socket.off(
                    "socket_error",
                    onSocketError
                );

                socket.off(
                    "interview_error",
                    onInterviewError
                );

                socket.off(
                    "connect_error",
                    onConnectError
                );

                socket.off(
                    "disconnect",
                    onDisconnect
                );

                socket.off(
                    "call_ended",
                    onCallEnded
                );

                socket.off("connect", onConnect);

                socket.disconnect();
            }

            closePeerConnection();

            screenStreamRef.current
                ?.getTracks()
                .forEach((track) => track.stop());

            cameraStreamRef.current
                ?.getTracks()
                .forEach((track) => track.stop());

            localStream
                ?.getTracks()
                .forEach((track) => track.stop());

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
            }

            cameraStreamRef.current = null;
            screenStreamRef.current = null;
            socketRef.current = null;
            roleRef.current = "";
        };
    }, [
        interviewId,
        closePeerConnection,
        createPeerConnection,
        flushPendingIce,
        makeOffer,
        emitSignal,
    ]);

    // --------------------------------------------------
    // CAMERA CONTROL
    // --------------------------------------------------

    const toggleCamera = () => {
        const next = !cameraOn;

        cameraStreamRef.current
            ?.getVideoTracks()
            .forEach((track) => {
                track.enabled = next;
            });

        setCameraOn(next);

        emitSignal("camera_toggled", {
            enabled: next,
        });
    };

    // --------------------------------------------------
    // MICROPHONE CONTROL
    // --------------------------------------------------

    const toggleMic = () => {
        const next = !micOn;

        cameraStreamRef.current
            ?.getAudioTracks()
            .forEach((track) => {
                track.enabled = next;
            });

        setMicOn(next);

        emitSignal("microphone_toggled", {
            enabled: next,
        });
    };

    // --------------------------------------------------
    // STOP SCREEN SHARING
    // --------------------------------------------------

    const stopScreenShare = async () => {
        const screen = screenStreamRef.current;

        if (!screen) {
            return;
        }

        const cameraTrack =
            cameraStreamRef.current?.getVideoTracks()[0];

        const pc = peerRef.current;

        try {
            if (pc && cameraTrack) {
                const sender = pc
                    .getSenders()
                    .find(
                        (item) =>
                            item.track?.kind === "video"
                    );

                if (sender) {
                    await sender.replaceTrack(cameraTrack);
                }
            }
        } catch (err) {
            console.error(
                "Could not restore camera:",
                err
            );

            setError(
                "Unable to restore the camera track."
            );
        }

        screen
            .getTracks()
            .forEach((track) => track.stop());

        screenStreamRef.current = null;

        setSharing(false);

        emitSignal("screen_share_stopped");

        setNotice("Screen sharing stopped.");
    };

    // --------------------------------------------------
    // START / TOGGLE SCREEN SHARING
    // --------------------------------------------------

    const toggleScreenShare = async () => {
        if (screenStreamRef.current) {
            await stopScreenShare();
            return;
        }

        try {
            if (!navigator.mediaDevices?.getDisplayMedia) {
                throw new Error(
                    "Screen sharing is not supported in this browser."
                );
            }

            const screen =
                await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false,
                });

            if (!activeRef.current) {
                screen
                    .getTracks()
                    .forEach((track) => track.stop());

                return;
            }

            const screenTrack =
                screen.getVideoTracks()[0];

            if (!screenTrack) {
                screen
                    .getTracks()
                    .forEach((track) => track.stop());

                return;
            }

            screenStreamRef.current = screen;

            const pc = peerRef.current;

            if (pc) {
                const sender = pc
                    .getSenders()
                    .find(
                        (item) =>
                            item.track?.kind === "video"
                    );

                if (sender) {
                    await sender.replaceTrack(screenTrack);
                } else {
                    pc.addTrack(screenTrack, screen);
                }
            }

            screenTrack.addEventListener(
                "ended",
                () => {
                    if (
                        screenStreamRef.current === screen
                    ) {
                        stopScreenShare();
                    }
                },
                { once: true }
            );

            setSharing(true);
            setError("");

            setNotice(
                "You're sharing your screen with the participant."
            );

            emitSignal("screen_share_started");
        } catch (err) {
            if (err.name !== "NotAllowedError") {
                setError(
                    err.message ||
                        "Unable to start screen sharing."
                );
            }
        }
    };

    // --------------------------------------------------
    // COPY INTERVIEW ID
    // --------------------------------------------------

    const copyRoom = async () => {
        if (!interviewId) {
            setError(
                "A valid interview ID is unavailable to copy."
            );

            return;
        }

        try {
            await navigator.clipboard.writeText(interviewId);

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            setError("Unable to copy the interview ID.");
        }
    };

    // --------------------------------------------------
    // LEAVE INTERVIEW ROOM
    // --------------------------------------------------

    const leaveRoom = () => {
        if (leavingRef.current) {
            return;
        }

        leavingRef.current = true;

        const socket = socketRef.current;

        if (socket?.connected && interviewId) {
            socket.emit("leave_interview", {
                interviewId,
            });
        }

        activeRef.current = false;

        closePeerConnection();

        screenStreamRef.current
            ?.getTracks()
            .forEach((track) => track.stop());

        cameraStreamRef.current
            ?.getTracks()
            .forEach((track) => track.stop());

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }

        socket?.disconnect();

        navigate(-1);
    };

    // --------------------------------------------------
    // LEFT SIDEBAR ITEMS
    // --------------------------------------------------

    const railItems = [
        {
            icon: Users,
            label: "Participants",
            action: () =>
                setNotice(
                    "Participant list will be connected next."
                ),
        },
        {
            icon: MessageSquare,
            label: "Chat",
            action: () =>
                setNotice(
                    "Interview chat will be connected next."
                ),
        },
        {
            icon: ClipboardList,
            label: "Interview tasks",
            action: () =>
                setNotice(
                    "Interview tasks panel will be connected next."
                ),
        },
        {
            icon: FileText,
            label: "Notes",
            action: () =>
                setNotice(
                    "Private interview notes will be added next."
                ),
        },
        {
            icon: CircleHelp,
            label: "Help",
            action: () =>
                setNotice(
                    "Check your camera, microphone, and room connection."
                ),
        },
    ];

    const waitingMessage =
        roleRef.current === "candidate"
            ? "Waiting for recruiter"
            : roleRef.current === "recruiter"
              ? "Waiting for candidate"
              : "Waiting for your participant";

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div className="flex h-dvh w-full overflow-hidden bg-[#090A12] text-white">
            {/* LEFT SIDEBAR */}
            <aside className="z-20 flex w-[60px] shrink-0 flex-col items-center border-r border-white/[0.07] bg-[#0D0E17] py-3 sm:w-[68px]">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-600/20">
                    <Video size={20} />
                </div>

                <div className="flex flex-1 flex-col items-center gap-2">
                    {railItems.map(
                        ({ icon: Icon, label, action }) => (
                            <button
                                key={label}
                                type="button"
                                title={label}
                                aria-label={label}
                                onClick={action}
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-violet-500/15 hover:text-violet-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
                            >
                                <Icon
                                    size={18}
                                    strokeWidth={1.8}
                                />
                            </button>
                        )
                    )}

                    <div className="my-2 h-px w-7 bg-white/10" />

                    <button
                        type="button"
                        title={
                            sharing
                                ? "Stop screen sharing"
                                : "Share screen"
                        }
                        aria-label={
                            sharing
                                ? "Stop screen sharing"
                                : "Share screen"
                        }
                        onClick={toggleScreenShare}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                            sharing
                                ? "bg-violet-500 text-white"
                                : "text-gray-400 hover:bg-violet-500/15 hover:text-violet-200"
                        }`}
                    >
                        <MonitorUp size={18} />
                    </button>
                </div>

                <button
                    type="button"
                    title="Settings"
                    aria-label="Settings"
                    onClick={() =>
                        setNotice(
                            "Device settings will be added next."
                        )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-white/5 hover:text-white"
                >
                    <Settings2 size={18} />
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* HEADER */}
                <header className="flex h-[62px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-3 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300 sm:flex">
                            <ShieldCheck size={19} />
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-sm font-semibold sm:text-base">
                                Technical Interview
                            </h1>

                            <button
                                type="button"
                                onClick={copyRoom}
                                className="mt-0.5 flex max-w-full items-center gap-1.5 text-[10px] text-gray-500 hover:text-violet-300 sm:text-xs"
                            >
                                <span className="truncate">
                                    Interview ID:{" "}
                                    {interviewId ||
                                        "Not assigned"}
                                </span>

                                {copied ? (
                                    <Check size={12} />
                                ) : (
                                    <Copy size={12} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                joined
                                    ? "bg-emerald-400"
                                    : "bg-amber-400"
                            }`}
                        />

                        <span className="max-w-24 truncate text-[10px] text-gray-300 sm:max-w-40 sm:text-xs">
                            {status}
                        </span>
                    </div>
                </header>

                {/* INTERVIEW MAIN */}
                <main className="flex min-h-0 flex-1 flex-col p-2 sm:p-4">
                    {/* ERROR */}
                    {error && (
                        <div className="mb-2 flex shrink-0 items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-xs text-red-200">
                            <CircleHelp
                                size={15}
                                className="shrink-0"
                            />

                            <span className="min-w-0 flex-1">
                                {error}
                            </span>

                            <button
                                type="button"
                                onClick={() => setError("")}
                                aria-label="Dismiss error"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* NOTICE */}
                    {notice && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="mb-3 flex shrink-0 items-start gap-3 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-500/[0.12] to-blue-500/[0.06] px-4 py-3 shadow-lg shadow-black/10"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-200">
                                <Users size={17} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-white sm:text-sm">
                                    Interview room update
                                </p>

                                <p className="mt-1 text-xs leading-5 text-gray-300">
                                    {notice}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setNotice("")}
                                aria-label="Dismiss notification"
                                className="rounded-md px-2 py-1 text-gray-400 hover:bg-white/10 hover:text-white"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* VIDEO STAGE */}
                    <section className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11121D]">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#21183A_0%,_#131421_46%,_#0D0E16_100%)]" />

                        {/* REMOTE VIDEO */}
                        <video
                            ref={stageVideoRef}
                            autoPlay
                            playsInline
                            className={`absolute inset-0 z-[1] h-full w-full object-contain ${
                                remoteConnected
                                    ? "block"
                                    : "hidden"
                            }`}
                        />

                        {/* WAITING SCREEN */}
                        {!remoteConnected && (
                            <div className="absolute inset-0 z-[1] flex items-center justify-center overflow-hidden px-4 pb-20 text-center">
                                <div className="absolute h-64 w-64 rounded-full bg-violet-500/[0.08] blur-3xl" />

                                <div className="relative flex max-w-sm flex-col items-center">
                                    <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-blue-500/10 shadow-[0_0_60px_rgba(139,92,246,0.12)]">
                                        <Users
                                            size={34}
                                            className="text-violet-200"
                                        />

                                        <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-[#151522] bg-emerald-400" />
                                    </div>

                                    <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-gray-300 sm:text-xs">
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                joined
                                                    ? "bg-emerald-400"
                                                    : "animate-pulse bg-amber-400"
                                            }`}
                                        />

                                        {joined
                                            ? "You're in the interview room"
                                            : "Preparing your room"}
                                    </span>

                                    <h2 className="text-lg font-semibold tracking-tight sm:text-2xl">
                                        {joined
                                            ? waitingMessage
                                            : "Welcome to your interview"}
                                    </h2>

                                    <p className="mt-2 max-w-xs text-xs leading-6 text-gray-400 sm:text-sm">
                                        {joined
                                            ? "Your room is ready. The other participant's video will appear here when the connection is established."
                                            : "We're setting up your camera, microphone, and secure interview connection."}
                                    </p>

                                    <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3">
                                        <Signal
                                            size={15}
                                            className="text-violet-300"
                                        />

                                        <span className="text-xs text-gray-300">
                                            {status}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 sm:text-xs">
                                        <ShieldCheck
                                            size={14}
                                            className="text-emerald-400"
                                        />

                                        Your interview room is access-controlled
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* REMOTE CAMERA OFF */}
                        {remoteConnected &&
                            !remoteCameraOn && (
                                <div className="absolute inset-0 z-[2] flex items-center justify-center bg-[#11121D]/90">
                                    <div className="text-center">
                                        <VideoOff className="mx-auto mb-3 h-10 w-10 text-gray-400" />

                                        <p className="text-sm font-medium">
                                            Remote camera is off
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {remoteMicOn
                                                ? "Remote microphone may still be on"
                                                : "Remote microphone is off"}
                                        </p>
                                    </div>
                                </div>
                            )}

                        {/* REMOTE SCREEN SHARE INDICATOR */}
                        {remoteSharing && (
                            <div className="absolute left-3 top-14 z-[4] flex items-center gap-2 rounded-lg border border-violet-400/30 bg-violet-500/20 px-3 py-2 backdrop-blur-md">
                                <MonitorUp
                                    size={14}
                                    className="text-violet-200"
                                />

                                <span className="text-[10px] font-medium text-violet-100">
                                    Participant is sharing their screen
                                </span>
                            </div>
                        )}

                        {/* LOCAL VIDEO */}
                        <div className="absolute bottom-3 right-3 z-10 w-[min(38%,190px)] overflow-hidden rounded-xl border border-violet-400/40 bg-[#171824] shadow-xl shadow-black/40 sm:bottom-4 sm:right-4 sm:w-[min(32%,240px)]">
                            <div className="relative aspect-video bg-[#171824]">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className={`h-full w-full object-cover ${
                                        cameraOn ? "" : "hidden"
                                    }`}
                                />

                                {!cameraOn && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Camera
                                            size={20}
                                            className="text-gray-500"
                                        />
                                    </div>
                                )}

                                <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[9px] font-medium">
                                    You
                                    {sharing
                                        ? " · Sharing screen"
                                        : ""}
                                </span>

                                <span className="absolute bottom-2 right-2 rounded-md bg-black/60 p-1.5">
                                    {micOn ? (
                                        <Mic size={12} />
                                    ) : (
                                        <MicOff
                                            size={12}
                                            className="text-red-300"
                                        />
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* ROOM BRANDING */}
                        <div className="absolute left-3 top-3 z-[3] flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 backdrop-blur-md sm:left-4 sm:top-4">
                            <Sparkles
                                size={12}
                                className="text-violet-300"
                            />

                            <span className="text-[10px] text-gray-200 sm:text-xs">
                                Peer.Hiring room
                            </span>
                        </div>

                        {/* MORE OPTIONS */}
                        <button
                            type="button"
                            title="More options"
                            aria-label="More options"
                            onClick={() =>
                                setNotice(
                                    "More interview options will be added here."
                                )
                            }
                            className="absolute right-3 top-3 z-[3] rounded-lg border border-white/10 bg-black/30 p-2 text-gray-300 backdrop-blur-md hover:bg-white/10 sm:right-4 sm:top-4"
                        >
                            <MoreHorizontal size={16} />
                        </button>
                    </section>

                    {/* BOTTOM CONTROLS */}
                    <footer className="flex shrink-0 items-center justify-between gap-2 px-1 pt-3 sm:px-2 sm:pt-4">
                        <div className="hidden min-w-0 sm:block">
                            <p className="text-xs font-medium text-gray-300">
                                Technical interview
                            </p>

                            <p className="mt-1 text-[10px] text-gray-500">
                                {remoteConnected
                                    ? "Connected to participant"
                                    : "Waiting for connection"}
                            </p>
                        </div>

                        <div className="mx-auto flex items-center gap-2 sm:gap-3">
                            {/* MICROPHONE */}
                            <button
                                type="button"
                                onClick={toggleMic}
                                title={
                                    micOn
                                        ? "Mute microphone"
                                        : "Unmute microphone"
                                }
                                aria-label={
                                    micOn
                                        ? "Mute microphone"
                                        : "Unmute microphone"
                                }
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition sm:h-11 sm:w-11 ${
                                    micOn
                                        ? "border-white/10 bg-white/[0.05] hover:bg-white/10"
                                        : "border-red-400/20 bg-red-500/15 text-red-300"
                                }`}
                            >
                                {micOn ? (
                                    <Mic size={17} />
                                ) : (
                                    <MicOff size={17} />
                                )}
                            </button>

                            {/* CAMERA */}
                            <button
                                type="button"
                                onClick={toggleCamera}
                                title={
                                    cameraOn
                                        ? "Turn camera off"
                                        : "Turn camera on"
                                }
                                aria-label={
                                    cameraOn
                                        ? "Turn camera off"
                                        : "Turn camera on"
                                }
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition sm:h-11 sm:w-11 ${
                                    cameraOn
                                        ? "border-white/10 bg-white/[0.05] hover:bg-white/10"
                                        : "border-red-400/20 bg-red-500/15 text-red-300"
                                }`}
                            >
                                {cameraOn ? (
                                    <Video size={17} />
                                ) : (
                                    <VideoOff size={17} />
                                )}
                            </button>

                            {/* SCREEN SHARING */}
                            <button
                                type="button"
                                onClick={toggleScreenShare}
                                title={
                                    sharing
                                        ? "Stop screen sharing"
                                        : "Share screen"
                                }
                                aria-label={
                                    sharing
                                        ? "Stop screen sharing"
                                        : "Share screen"
                                }
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition sm:h-11 sm:w-11 ${
                                    sharing
                                        ? "border-violet-400/30 bg-violet-500/20 text-violet-200"
                                        : "border-white/10 bg-white/[0.05] hover:bg-white/10"
                                }`}
                            >
                                <MonitorUp size={17} />
                            </button>

                            {/* LEAVE */}
                            <button
                                type="button"
                                onClick={leaveRoom}
                                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-3 text-xs font-semibold shadow-lg shadow-red-950/20 transition hover:brightness-110 sm:h-11 sm:px-4 sm:text-sm"
                            >
                                <PhoneOff size={16} />

                                <span>Leave</span>
                            </button>
                        </div>

                        <div className="hidden w-24 justify-end md:flex">
                            <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                <ShieldCheck
                                    size={13}
                                    className="text-emerald-400"
                                />

                                Private room
                            </span>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
