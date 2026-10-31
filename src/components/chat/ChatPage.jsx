import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MessageSquare,
  Phone,
  BriefcaseBusiness,
  Bell,
  Settings,
  CircleHelp,
  Search,
  Plus,
  MoreVertical,
  Check,
  CheckCheck,
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  Star,
  ShieldCheck,
  X,
  LoaderCircle,
  RefreshCw,
  Users,
  Trash2,
  Pencil,
} from "lucide-react";

import { ConversationContext } from "../../context/ConversationContext";
import { MessageContext } from "../../context/MessageContext";
import { ApplicationContext } from "../../context/ApplicationContext";
import { useAuth, useHome } from "../../hooks/Hook";
import { useChatSocket } from "../../hooks/useChatSocket";

const API_URL = import.meta.env.VITE_API_URL;

const EMOJI_OPTIONS = ["😀", "😂", "😊", "😍", "👍", "👏", "🙏", "🎉", "🔥", "💯", "❤️", "🤝"];

const NAV_ITEMS = [
  { id: "Chats", icon: MessageSquare },
  { id: "Calls", icon: Phone },
  { id: "Applications", icon: BriefcaseBusiness },
  { id: "Notifications", icon: Bell },
];


const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  return String(value._id ?? value.id ?? "");
};

const getName = (person) => {
  if (!person) return "Unknown user";
  if (typeof person === "string") return "Peer.Hiring member";

  return (
    person.fullName ||
    person.name ||
    [person.firstName, person.lastName].filter(Boolean).join(" ") ||
    person.username ||
    person.email ||
    "Unknown user"
  );
};

const getAvatar = (person) => {
  if (!person || typeof person !== "object") return "";

  const avatar = person.avatar;

  if (typeof avatar === "string") return avatar;

  return (
    avatar?.url ||
    person.profilePicture ||
    person.profileImage ||
    person.photoURL ||
    ""
  );
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

const formatTime = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateLabel = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (parsed.toDateString() === today.toDateString()) return "Today";

  if (parsed.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return parsed.toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year:
      parsed.getFullYear() === today.getFullYear()
        ? undefined
        : "numeric",
  });
};

// Last-seen formatter
const formatLastSeen = (date) => {
  if (!date) return "Offline";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Offline";

  const now = new Date();
  const difference = Math.max(0, now.getTime() - parsed.getTime());

  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) return "Last seen just now";

  if (minutes < 60) {
    return `Last seen ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (hours < 24) {
    return `Last seen ${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (days === 1) return "Last seen yesterday";

  if (days < 7) {
    return `Last seen ${days} days ago`;
  }

  return `Last seen ${parsed.toLocaleString([], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const getLastMessageText = (conversation) => {
  const message = conversation?.lastMessage;

  if (!message) return "Start a conversation";
  if (typeof message === "string") return "Open conversation";
  if (message.isDeleted) return "This message was deleted";
  if (message.content) return message.content;

  const labels = {
    image: "📷 Image",
    video: "🎬 Video",
    audio: "🎤 Audio",
    document: "📄 Document",
    file: "📎 Attachment",
  };

  return labels[message.messageType] || "Open conversation";
};

const getApplicationId = (application) => {
  const id = application?._id ?? application?.id;

  return id == null ? "" : String(id).trim();
};

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.applications)) return value.applications;
  if (Array.isArray(value?.data?.applications)) return value.data.applications;
  if (Array.isArray(value?._data_?.applications)) return value._data_.applications;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?._data_)) return value._data_;

  return [];
};

const unwrapConversation = (payload) =>
  payload?._data_?.conversation ||
  payload?._data_ ||
  payload?.data?.conversation ||
  payload?.data ||
  payload?.conversation ||
  payload;

const getApplicationJob = (application) => {
  const job = application?.jobId || application?.job;

  return job && typeof job === "object" ? job : null;
};

const getApplicationJobTitle = (application) => {
  const job = getApplicationJob(application);

  return (
    job?.title ||
    job?.jobTitle ||
    application?.jobTitle ||
    "Job application"
  );
};

const getApplicationCompany = (application) => {
  const job = getApplicationJob(application);
  const company = job?.companyId || application?.companyId || job?.company;

  if (company && typeof company === "object") {
    return company.companyName || company.name || "Company";
  }

  return job?.companyName || application?.companyName || "Company";
};

const getMessageId = (message) =>
  getId(message?._id || message?.messageId || message?.id);

const getReceiptUserId = (receipt) =>
  getId(receipt?.user || receipt?.userId);

const hasReceipt = (receipts = [], userId) =>
  Array.isArray(receipts) &&
  receipts.some((receipt) => getReceiptUserId(receipt) === userId);

function Avatar({
  name = "Unknown user",
  image = "",
  online = false,
  size = "md",
}) {
  const sizeClass =
    size === "sm"
      ? "h-7 w-7 text-[9px]"
      : size === "lg"
        ? "h-11 w-11 text-sm"
        : "h-9 w-9 text-[12px]";

  return (
    <div className="relative shrink-0">
      {image ? (
        <img
          src={image}
          alt={name}
          className={`${sizeClass} rounded-full border border-[#2C2B42] object-cover`}
        />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full border border-[#2C2B42] bg-[#25233A] font-semibold text-[#B7A5FF]`}
        >
          {getInitials(name)}
        </div>
      )}

      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#252536] bg-[#00D6A0] shadow-[0_0_8px_rgba(0,214,160,0.45)]" />
      )}
    </div>
  );
}

function SectionNavigation({ section, showSection, unreadCount, currentUser }) {
  return (
    <nav className="hidden w-[64px] shrink-0 flex-col items-center border-r border-[#252536] bg-[#090A12] py-4 md:flex sm:w-[72px]">
      <button
        type="button"
        onClick={() => showSection("Chats")}
        title="Peer.Hiring home"
        aria-label="Peer.Hiring home"
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7657F6] text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-[#6248E8]"
      >
        P
      </button>

      <div className="flex w-full flex-col items-center gap-2">
        {NAV_ITEMS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            title={id}
            aria-label={id}
            onClick={() => showSection(id)}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              section === id
                ? "bg-[#292343] text-[#7657F6]"
                : "text-[#7C819D] hover:bg-[#19172B] hover:text-[#7657F6]"
            }`}
          >
            {section === id && (
              <span className="absolute -left-[17px] h-5 w-[3px] rounded-r bg-[#7657F6]" />
            )}

            <Icon size={20} strokeWidth={1.8} />

            {id === "Chats" && unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-[#090A12] bg-[#7657F6] px-1 text-[9px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="my-5 h-px w-8 bg-[#252536]" />

      <button
        type="button"
        title="Settings"
        aria-label="Settings"
        onClick={() => showSection("Settings")}
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          section === "Settings"
            ? "bg-[#292343] text-[#7657F6]"
            : "text-[#7C819D] hover:bg-[#19172B] hover:text-[#7657F6]"
        }`}
      >
        <Settings size={20} strokeWidth={1.8} />
      </button>

      <div className="mt-auto flex flex-col items-center gap-3">
        <button
          type="button"
          title="Help and support"
          aria-label="Help and support"
          onClick={() => showSection("Help")}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#7C819D] transition-colors hover:bg-[#19172B] hover:text-[#7657F6]"
        >
          <CircleHelp size={20} strokeWidth={1.8} />
        </button>

        <button
          type="button"
          title="My profile"
          aria-label="My profile"
          onClick={() => showSection("Profile")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3B315F] bg-[#19172B] text-xs font-semibold text-[#7657F6] transition-colors hover:bg-[#292343]"
        >
          {getInitials(getName(currentUser))}
        </button>
      </div>
    </nav>
  );
}

export default function ChatPage() {
  const {
    myConversations = [],
    handleGetMyConversations,
    handleGetConversationById,
  } = useContext(ConversationContext) || {};

  const {
    messages = [],
    handleGetMessages,
    handleSocketNewMessage,
    setMessages,
  } = useContext(MessageContext) || {};

  const appContext = useContext(ApplicationContext) || {};

  const {
    applications = [],
    jobApplications = [],
    handleGetMyApplications,
    handleGetRecruiterApplications,
  } = appContext;

  const {
  activePage,
  setActivePage,
  recruiterActivePage,
  setRecruiterActivePage,
} = useHome();

  const { user, recruiter, getUser } = useAuth();

  const currentUser = recruiter || user;
  const currentUserId = getId(currentUser);

  const role = String(
    currentUser?.role || currentUser?.accountType || ""
  ).toLowerCase();

  const isRecruiter = Boolean(recruiter || role === "recruiter");
  const isCandidate = Boolean(user && !isRecruiter);

  const onBackToDashboard = () => {
    if(isRecruiter) {
      setRecruiterActivePage("recruiter/dashboard");
    } else {
      setActivePage("overview");
    }
  };

  const getUserCalledRef = useRef(false);
  const activeRequestRef = useRef(0);
  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const deliveredIdsRef = useRef(new Set());
  const readIdsRef = useRef(new Set());

  const [activeId, setActiveId] = useState("");
  const [section, setSection] = useState("Chats");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [unreadIds, setUnreadIds] = useState([]);
  const [sending, setSending] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [error, setError] = useState("");
  const [loadedApplications, setLoadedApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState("");
  const [openingApplicationId, setOpeningApplicationId] = useState("");
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const [applicationsRefreshKey, setApplicationsRefreshKey] = useState(0);
  const [editingMessageId, setEditingMessageId] = useState("");
  const [editDraft, setEditDraft] = useState("");
  const [editingMessage, setEditingMessage] = useState(false);

  const conversations = useMemo(
    () => (Array.isArray(myConversations) ? myConversations : []),
    [myConversations]
  );

  const messageList = Array.isArray(messages) ? messages : [];

  const updateMessageInState = useCallback(
    (messageId, updater) => {
      if (!messageId) return;

      setMessages?.((previous) =>
        (Array.isArray(previous) ? previous : []).map((message) =>
          getMessageId(message) === messageId
            ? updater(message)
            : message
        )
      );
    },
    [setMessages]
  );

  const handleIncomingMessage = useCallback(
    (payload) => {
      const incoming =
        payload?.message ||
        payload?.data?.message ||
        payload?.data ||
        payload;

      if (!incoming) return;

      const incomingConversationId = getId(
        incoming.conversation || incoming.conversationId
      );

      const isCurrentConversation =
        incomingConversationId && incomingConversationId === activeId;

      if (isCurrentConversation) {
        handleSocketNewMessage?.(incoming);

        setUnreadIds((previous) =>
          previous.filter((id) => id !== incomingConversationId)
        );
      } else if (
        incomingConversationId &&
        getId(incoming.sender) !== currentUserId
      ) {
        setUnreadIds((previous) =>
          previous.includes(incomingConversationId)
            ? previous
            : [...previous, incomingConversationId]
        );
      }
    },
    [activeId, currentUserId, handleSocketNewMessage]
  );

  const [timeNow, setTimeNow] = useState(Date.now());

useEffect(() => {
  const timer = setInterval(() => {
    setTimeNow(Date.now());
  }, 30000);

  return () => clearInterval(timer);
}, []);

  const handleMessageDeleted = useCallback(
    (payload) => {
      const deleted =
        payload?.message ||
        payload?.data?.message ||
        payload?.data ||
        payload;

      const messageId = getMessageId(deleted);

      if (!messageId) return;

      updateMessageInState(messageId, (previous) => ({
        ...previous,
        ...deleted,
        _id: previous._id || messageId,
        isDeleted: true,
        deletedAt: deleted.deletedAt || new Date().toISOString(),
        content: "",
      }));

      setActiveMessageMenu(null);
      setEditingMessageId("");
    },
    [updateMessageInState]
  );

  const handleMessageEdited = useCallback(
    (payload) => {
      const edited =
        payload?.message ||
        payload?.data?.message ||
        payload?.data ||
        payload;

      const messageId = getMessageId(edited);

      if (!messageId) return;

      updateMessageInState(messageId, (previous) => ({
        ...previous,
        ...edited,
        content: edited.content ?? previous.content,
        isEdited: true,
        editedAt: edited.editedAt || new Date().toISOString(),
      }));
    },
    [updateMessageInState]
  );

  const handleMessageDelivered = useCallback(
    (payload) => {
      const messageId = getMessageId(payload);

      if (!messageId) return;

      const receiptUserId = getId(payload?.user || payload?.userId);

      updateMessageInState(messageId, (previous) => {
        const deliveredTo = Array.isArray(previous.deliveredTo)
          ? [...previous.deliveredTo]
          : [];

        if (
          receiptUserId &&
          !deliveredTo.some(
            (receipt) => getReceiptUserId(receipt) === receiptUserId
          )
        ) {
          deliveredTo.push({
            user: receiptUserId,
            deliveredAt: payload?.deliveredAt || new Date().toISOString(),
          });
        }

        return { ...previous, deliveredTo };
      });
    },
    [updateMessageInState]
  );

  const handleMessageRead = useCallback(
    (payload) => {
      const messageId = getMessageId(payload);

      if (!messageId) return;

      const receiptUserId = getId(payload?.user || payload?.userId);

      updateMessageInState(messageId, (previous) => {
        const readBy = Array.isArray(previous.readBy)
          ? [...previous.readBy]
          : [];

        if (
          receiptUserId &&
          !readBy.some(
            (receipt) => getReceiptUserId(receipt) === receiptUserId
          )
        ) {
          readBy.push({
            user: receiptUserId,
            readAt: payload?.readAt || new Date().toISOString(),
          });
        }

        return { ...previous, readBy };
      });
    },
    [updateMessageInState]
  );

  const {
    isConnected,
    joinedConversationId,
    onlineUserIds,
    lastSeenByUserId,
    sendMessage: sendSocketMessage,
    startTyping,
    stopTyping,
    typingUsers = [],
    deleteMessage,
    editMessage,
    markMessageDelivered,
    markMessageRead,
  } = useChatSocket({
    conversationId: activeId,
    onNewMessage: handleIncomingMessage,
    onMessageError: (payload) => {
      setError(payload?.message || "Unable to send message.");
      setSending(false);
    },
    onUserTyping: undefined,
    onMessageDeleted: handleMessageDeleted,
    onMessageEdited: handleMessageEdited,
    onMessageDelivered: handleMessageDelivered,
    onMessageRead: handleMessageRead,
  });

  // Determine live presence using socket state.
  const isUserOnline = useCallback(
    (person) => {
      const userId = getId(person);

      return Boolean(userId && onlineUserIds.includes(userId));
    },
    [onlineUserIds]
  );

  const getUserLastSeen = useCallback(
  (person) => {
    const userId = getId(person);

    return (
      (userId && lastSeenByUserId?.[userId]) ||
      person?.lastSeen ||
      person?.lastSeenAt ||
      null
    );
  },
  [lastSeenByUserId]
);

  useEffect(() => {
    if (getUserCalledRef.current) return;

    getUserCalledRef.current = true;

    Promise.resolve(getUser?.()).catch((err) => {
      console.error("Failed to fetch current user:", err);
    });
  }, [getUser]);

  useEffect(() => {
    Promise.resolve(handleGetMyConversations?.()).catch((err) => {
      console.error("Failed to load conversations:", err);
    });
  }, [handleGetMyConversations]);

  useEffect(() => {
    if (conversations.length === 0) {
      setActiveId("");
      return;
    }

    const activeExists = conversations.some(
      (item) => getId(item) === activeId
    );

    if (!activeExists) {
      setActiveId(getId(conversations[0]));
    }
  }, [conversations, activeId]);

  const activeChat = useMemo(
    () => conversations.find((item) => getId(item) === activeId) || null,
    [conversations, activeId]
  );

  useEffect(() => {
    if (!activeId || section !== "Chats") return;

    const requestId = ++activeRequestRef.current;
    let cancelled = false;

    setError("");
    deliveredIdsRef.current.clear();
    readIdsRef.current.clear();

    const loadActiveChat = async () => {
      try {
        await Promise.all([
          handleGetConversationById?.({ conversationId: activeId }),
          handleGetMessages?.({ conversationId: activeId }),
        ]);
      } catch (err) {
        if (!cancelled && activeRequestRef.current === requestId) {
          console.error("Failed to load active conversation:", err);
          setError(err?.message || "Unable to load this conversation.");
        }
      }
    };

    loadActiveChat();

    setUnreadIds((previous) =>
      previous.filter((id) => id !== activeId)
    );

    return () => {
      cancelled = true;
    };
  }, [
    activeId,
    section,
    handleGetConversationById,
    handleGetMessages,
  ]);

  // Mark received messages as delivered and read when this conversation is open.
  useEffect(() => {
    if (
      !activeId ||
      section !== "Chats" ||
      joinedConversationId !== activeId ||
      !currentUserId
    ) {
      return;
    }

    messageList.forEach((message) => {
      const messageId = getMessageId(message);
      const senderId = getId(message.sender);

      if (!messageId || senderId === currentUserId) return;

      if (
        !hasReceipt(message.deliveredTo, currentUserId) &&
        !deliveredIdsRef.current.has(messageId)
      ) {
        deliveredIdsRef.current.add(messageId);
        markMessageDelivered?.({ messageId });
      }

      if (
        !hasReceipt(message.readBy, currentUserId) &&
        !readIdsRef.current.has(messageId)
      ) {
        readIdsRef.current.add(messageId);
        markMessageRead?.({ messageId });
      }
    });
  }, [
    activeId,
    section,
    joinedConversationId,
    currentUserId,
    messageList,
    markMessageDelivered,
    markMessageRead,
  ]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [activeId, messageList.length]);

  useEffect(() => {
    if (section !== "Applications") return;

    let cancelled = false;

    const load = async () => {
      setApplicationsLoading(true);
      setApplicationsError("");

      try {
        let result;

        if (isRecruiter) {
          if (!handleGetRecruiterApplications) {
            throw new Error(
              "ApplicationContext does not expose handleGetRecruiterApplications."
            );
          }

          result = await handleGetRecruiterApplications();
        } else if (isCandidate) {
          if (!handleGetMyApplications) {
            throw new Error(
              "ApplicationContext does not expose handleGetMyApplications."
            );
          }

          result = await handleGetMyApplications();
        } else {
          throw new Error(
            "Unable to determine whether the logged-in account is a candidate or recruiter."
          );
        }

        if (cancelled) return;

        const returned = normalizeList(result);

        const fallback = isRecruiter
          ? normalizeList(jobApplications).length
            ? normalizeList(jobApplications)
            : normalizeList(applications)
          : normalizeList(applications);

        setLoadedApplications(returned.length ? returned : fallback);
      } catch (err) {
        console.error("Load applications error:", err);

        if (!cancelled) {
          setApplicationsError(
            err?.message || "Unable to load applications."
          );
        }
      } finally {
        if (!cancelled) setApplicationsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    section,
    isRecruiter,
    isCandidate,
    handleGetMyApplications,
    handleGetRecruiterApplications,
    applicationsRefreshKey,
  ]);

  const visibleApplications = useMemo(() => {
    if (loadedApplications.length) return loadedApplications;

    return isRecruiter
      ? normalizeList(jobApplications).length
        ? normalizeList(jobApplications)
        : normalizeList(applications)
      : normalizeList(applications);
  }, [loadedApplications, isRecruiter, applications, jobApplications]);

  const participants = activeChat?.participants || [];

  const otherParticipant =
    participants.find((person) => getId(person) !== currentUserId) ||
    participants[0] ||
    null;

  const otherParticipantOnline = isUserOnline(otherParticipant);
  const otherParticipantLastSeen = getUserLastSeen(otherParticipant);

  const activeName =
    activeChat?.conversationType === "group"
      ? activeChat.groupName || "Group conversation"
      : getName(otherParticipant);

  const activeImage = getAvatar(otherParticipant);

  const linkedApplication =
    activeChat?.application && typeof activeChat.application === "object"
      ? activeChat.application
      : null;

  const linkedJob =
    linkedApplication?.jobId && typeof linkedApplication.jobId === "object"
      ? linkedApplication.jobId
      : linkedApplication?.job && typeof linkedApplication.job === "object"
        ? linkedApplication.job
        : null;

  const activeJobTitle =
    linkedJob?.title ||
    linkedJob?.jobTitle ||
    linkedApplication?.jobTitle ||
    "Conversation";

  const linkedCompany =
    linkedJob?.companyId && typeof linkedJob.companyId === "object"
      ? linkedJob.companyId
      : linkedApplication?.companyId &&
          typeof linkedApplication.companyId === "object"
        ? linkedApplication.companyId
        : null;

  const activeCompanyName =
    linkedCompany?.companyName ||
    linkedCompany?.name ||
    linkedJob?.companyName ||
    "Peer.Hiring";

  const unreadCount = unreadIds.length;

const formatLastSeen = (date) => {
  if (!date) return "Last seen recently";

  const lastSeenDate = new Date(date);

  if (Number.isNaN(lastSeenDate.getTime())) {
    return "Last seen recently";
  }

  const diff = Math.max(0, timeNow - lastSeenDate.getTime());

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Last seen just now";

  if (minutes < 60) {
    return `Last seen ${minutes} min ago`;
  }

  if (hours < 24) {
    return `Last seen ${hours} hr ago`;
  }

  if (days === 1) return "Last seen yesterday";

  if (days < 7) {
    return `Last seen ${days} days ago`;
  }

  return `Last seen ${lastSeenDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const people = conversation.participants || [];

      const other =
        people.find((person) => getId(person) !== currentUserId) ||
        people[0];

      const name =
        conversation.conversationType === "group"
          ? conversation.groupName || "Group conversation"
          : getName(other);

      const text = [
        name,
        getLastMessageText(conversation),
        conversation.application?.jobTitle,
        conversation.application?.jobId?.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(query);
      const id = getId(conversation);

      const matchesFilter =
        filter === "Unread"
          ? unreadIds.includes(id)
          : filter === "Favourites"
            ? favourites.includes(id)
            : true;

      return matchesSearch && matchesFilter;
    });
  }, [
    conversations,
    search,
    filter,
    favourites,
    unreadIds,
    currentUserId,
  ]);

  const showSection = useCallback(
    (nextSection) => {
      setSection(nextSection);
      setError("");

      if (nextSection !== "Chats") {
        stopTyping?.();
        setMobileChatOpen(false);
      } else {
        setActiveId("");
        setMobileChatOpen(false);
      }
    },
    [stopTyping]
  );

  const selectChat = useCallback(
    (conversation) => {
      stopTyping?.();
      setActiveMessageMenu(null);
      setEditingMessageId("");
      setDraft("");
      setEmojiOpen(false);
      setActiveId(getId(conversation));
      setSection("Chats");
      setMobileChatOpen(true);
      setError("");
    },
    [stopTyping]
  );

  const toggleFavourite = useCallback((id) => {
    setFavourites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }, []);

  const openApplicationConversation = useCallback(
    async (selectedApplication) => {
      const applicationId = getApplicationId(selectedApplication);

      if (!/^[a-f\d]{24}$/i.test(applicationId)) {
        setApplicationsError("This application does not have a valid ID.");
        return;
      }

      setOpeningApplicationId(applicationId);
      setApplicationsError("");
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/conversation/${applicationId}`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            payload?.message ||
              payload?._message_ ||
              "Unable to create or open this application's conversation."
          );
        }

        const conversation = unwrapConversation(payload);
        const conversationId = getId(conversation);

        if (!conversationId) {
          throw new Error(
            "The server did not return a valid conversation."
          );
        }

        await handleGetMyConversations?.();

        setActiveId(conversationId);
        setSection("Chats");
        setMobileChatOpen(true);
      } catch (err) {
        console.error("Open application conversation error:", err);
        setApplicationsError(
          err?.message || "Unable to open the conversation."
        );
      } finally {
        setOpeningApplicationId("");
      }
    },
    [handleGetMyConversations]
  );

  const handleSendMessage = useCallback(
    (event) => {
      event.preventDefault();

      const content = draft.trim();

      if (!content || !activeId || sending) return;

      if (!isConnected) {
        setError("You're disconnected. Please wait for reconnection.");
        return;
      }

      if (joinedConversationId !== activeId) {
        setError("The conversation is still connecting. Try again shortly.");
        return;
      }

      setSending(true);
      setError("");

      const sent = sendSocketMessage({
        conversationId: activeId,
        content,
      });

      if (!sent) {
        setError("Unable to send message. Please try again.");
        setSending(false);
        return;
      }

      setDraft("");
      setEmojiOpen(false);
      stopTyping?.();

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      setSending(false);
    },
    [
      draft,
      activeId,
      sending,
      isConnected,
      joinedConversationId,
      sendSocketMessage,
      stopTyping,
    ]
  );

  const handleEditMessage = useCallback((message) => {
    const messageId = getMessageId(message);

    if (!messageId || !message.content || message.isDeleted) return;

    setEditingMessageId(messageId);
    setEditDraft(message.content);
    setActiveMessageMenu(null);
    setError("");
  }, []);

  const saveEditedMessage = useCallback(
    (event) => {
      event.preventDefault();

      const content = editDraft.trim();

      if (!content || !editingMessageId) return;

      if (!isConnected || joinedConversationId !== activeId) {
        setError("The conversation is not connected. Try again shortly.");
        return;
      }

      const sent = editMessage?.({
        messageId: editingMessageId,
        conversationId: activeId,
        content,
      });

      if (sent === false) {
        setError("Unable to edit this message. Please try again.");
        return;
      }

      setEditingMessage(true);
      setEditingMessageId("");
      setEditDraft("");
      setEditingMessage(false);
    },
    [
      editDraft,
      editingMessageId,
      isConnected,
      joinedConversationId,
      activeId,
      editMessage,
    ]
  );

  const cancelEditing = useCallback(() => {
    setEditingMessageId("");
    setEditDraft("");
    setEditingMessage(false);
  }, []);

  const handleDeleteMessage = useCallback(
    (message) => {
      const messageId = getMessageId(message);

      if (!messageId) return;

      const deleted = deleteMessage?.({
        messageId,
        conversationId: activeId,
      });

      if (deleted === false) {
        setError("Unable to delete this message. Please try again.");
        return;
      }

      setActiveMessageMenu(null);
    },
    [deleteMessage, activeId]
  );

  const handleComposerKeyDown = useCallback((event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }, []);

  const isMyMessage = useCallback(
    (message) => getId(message.sender) === currentUserId,
    [currentUserId]
  );

  const getMessageStatus = useCallback(
    (message) => {
      if (!isMyMessage(message)) return null;

      const otherIds = participants
        .map((person) => getId(person))
        .filter((id) => id && id !== currentUserId);

      const readBy = message.readBy || [];
      const deliveredTo = message.deliveredTo || [];

      const isRead =
        otherIds.length > 0
          ? otherIds.every((id) => hasReceipt(readBy, id))
          : readBy.length > 0;

      const isDelivered =
        otherIds.length > 0
          ? otherIds.every((id) => hasReceipt(deliveredTo, id))
          : deliveredTo.length > 0;

      if (isRead) return "read";
      if (isDelivered) return "delivered";

      return "sent";
    },
    [isMyMessage, participants, currentUserId]
  );

  const typingNames = typingUsers
    .filter((person) => getId(person.userId) !== currentUserId)
    .map((person) => person.userName || "Someone");

  const renderAttachment = (attachment, index) => {
    if (!attachment?.url) return null;

    const mimeType = attachment.mimeType || "";
    const isImage = mimeType.startsWith("image/");
    const isVideo = mimeType.startsWith("video/");
    const isAudio = mimeType.startsWith("audio/");

    if (isImage) {
      return (
        <a
          key={attachment.publicId || attachment.url || index}
          href={attachment.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block"
        >
          <img
            src={attachment.url}
            alt={attachment.originalName || "Image attachment"}
            className="max-h-64 max-w-full rounded-lg object-cover"
          />
        </a>
      );
    }

    if (isVideo) {
      return (
        <video
          key={attachment.publicId || attachment.url || index}
          src={attachment.url}
          controls
          className="mt-2 max-h-64 max-w-full rounded-lg"
        />
      );
    }

    if (isAudio) {
      return (
        <audio
          key={attachment.publicId || attachment.url || index}
          src={attachment.url}
          controls
          className="mt-2 max-w-full"
        />
      );
    }

    return (
      <a
        key={attachment.publicId || attachment.url || index}
        href={attachment.url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 flex items-center gap-2 rounded-lg border border-[#252536] bg-[#11121F]/90 px-3 py-2 text-xs text-[#B7A5FF] hover:bg-[#1B1B2C]"
      >
        <Paperclip size={14} />
        <span className="max-w-[220px] truncate">
          {attachment.originalName ||
            attachment.fileName ||
            "Download attachment"}
        </span>
      </a>
    );
  };

  return (
    <>
      <style>{`
        .peer-chat-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .peer-chat-scroll::-webkit-scrollbar-thumb { background: #252536; border-radius: 20px; }
        .peer-chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .peer-chat-glow { box-shadow: 0 0 0 1px rgba(118,87,246,.18), 0 0 28px rgba(118,87,246,.08); }
        .peer-chat-scroll { scrollbar-color: #2C2B42 transparent; scrollbar-width: thin; }
        .peer-chat-scroll::-webkit-scrollbar { width: 5px; }
        .peer-chat-scroll::-webkit-scrollbar-thumb { background: #252536; border-radius: 20px; }
      `}</style>
    <main className="fixed inset-0 z-40 flex h-dvh w-full overflow-hidden bg-[#090A12] font-sans text-[#F1F0FA]">
      <SectionNavigation
        section={section}
        showSection={showSection}
        unreadCount={unreadCount}
        currentUser={currentUser}
      />

      {/* Sidebar */}
      <aside
        className={`${
          mobileChatOpen ? "hidden md:flex" : "flex"
        } min-h-0 w-full shrink-0 flex-col border-r border-[#252536] bg-[#0D0E17] md:w-[310px] sm:w-[330px] lg:w-[360px]`}
      >
        <header className="shrink-0 px-4 pb-4 pt-5 sm:px-5">
          <div className="mb-5 flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[21px] font-bold tracking-[-0.7px] text-[#F1F0FA]">
                  {section}
                </h1>

                <span className="rounded-md border border-[#7657F6]/25 bg-[#19172B] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#7657F6]">
                  Workspace
                </span>
              </div>

              <p className="mt-1 text-xs text-[#7C819D]">
                {section === "Chats"
                  ? "Your professional conversations"
                  : `${section} workspace`}
              </p>
            </div>

            {section === "Chats" && (
              <button
                type="button"
                title="Open applications"
                aria-label="Open applications"
                onClick={() => showSection("Applications")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#9278FF] to-[#6248E8] text-white shadow-[0_0_22px_rgba(118,87,246,0.20)] transition hover:-translate-y-0.5 hover:bg-[#6248E8]"
              >
                <Plus size={21} />
              </button>
            )}
          </div>

          {section === "Chats" && (
            <>
              <label className="flex h-[44px] items-center gap-2.5 rounded-xl border border-[#252536] bg-[#11121F] px-3 transition focus-within:border-[#7657F6]/70 focus-within:shadow-[0_0_0_3px_rgba(118,87,246,0.12)]">
                <Search size={17} className="shrink-0 text-[#777D99]" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search people or jobs..."
                  aria-label="Search conversations"
                  className="w-full min-w-0 bg-transparent text-[13px] text-[#F1F0FA] outline-none placeholder:text-[#777D99]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="shrink-0 text-[#777D99] hover:text-[#7657F6]"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                {["All", "Unread", "Favourites"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFilter(label)}
                    className={`flex h-[34px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition ${
                      filter === label
                        ? "border-[#7657F6] bg-gradient-to-br from-[#9278FF] to-[#6248E8] text-white shadow-[0_0_22px_rgba(139,92,246,0.25)]"
                        : "border-[#252536] bg-[#11121F] text-[#7C819D] hover:border-[#7657F6] hover:text-[#7657F6]"
                    }`}
                  >
                    {label}

                    {label === "Unread" && unreadCount > 0 && (
                      <span className="text-[10px]">{unreadCount}</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </header>

        {/* Conversations */}
        {section === "Chats" ? (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-3 peer-chat-scroll [scrollbar-width:thin]">
            {filteredChats.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#252536] bg-[#090A12] text-[#7657F6]">
                  <MessageSquare size={27} />
                </div>

                <p className="text-sm font-semibold text-[#F1F0FA]">
                  No conversations found
                </p>

                <p className="mt-1 max-w-[220px] text-xs leading-5 text-[#7C819D]">
                  {search
                    ? "Try another name or filter."
                    : "Choose an application to start a conversation."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={() => showSection("Applications")}
                    className="mt-4 rounded-xl bg-[#7657F6] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#6248E8]"
                  >
                    View applications
                  </button>
                )}
              </div>
            ) : (
              filteredChats.map((chat) => {
                const id = getId(chat);
                const people = chat.participants || [];

                const person =
                  people.find((item) => getId(item) !== currentUserId) ||
                  people[0] ||
                  null;

                const name =
                  chat.conversationType === "group"
                    ? chat.groupName || "Group conversation"
                    : getName(person);

                const selected = id === activeId;
                const favourite = favourites.includes(id);
                const unread = unreadIds.includes(id);
                const personOnline =
                  chat.conversationType !== "group" && isUserOnline(person);

                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => selectChat(chat)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                      selected
                        ? "bg-violet-950 border-violet-950"
                        : "hover:bg-violet-950"
                    }`}
                  >
                    <Avatar
                      name={name}
                      image={getAvatar(person)}
                      online={personOnline}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-semibold text-[#F1F0FA]">
                          {name}
                        </span>

                        <span
                          className={`shrink-0 text-[10px] ${
                            unread
                              ? "font-bold text-[#7657F6]"
                              : "text-[#777D99]"
                          }`}
                        >
                          {formatTime(chat.lastMessageAt || chat.updatedAt)}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="truncate text-[11px] text-[#7C819D]">
                          {chat.application?.jobId?.title ||
                            chat.application?.jobTitle ||
                            "Conversation"}
                        </span>

                        {favourite && (
                          <Star
                            size={11}
                            className="shrink-0 fill-[#7657F6] text-[#7657F6]"
                          />
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-[#777D99]">
                          {getLastMessageText(chat)}
                        </p>

                        {unread && (
                          <span className="flex h-[19px] min-w-[19px] shrink-0 items-center justify-center rounded-full bg-[#7657F6] px-1 text-[10px] font-bold text-white">
                            1
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        ) : section === "Applications" ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-xs font-medium text-[#7C819D]">
                {visibleApplications.length} application(s)
              </p>

              <button
                type="button"
                title="Refresh applications"
                onClick={() => {
                  setLoadedApplications([]);
                  setApplicationsRefreshKey((value) => value + 1);
                }}
                className="rounded-xl border border-[#252536] bg-[#11121F] p-2 text-[#7657F6] transition hover:bg-[#171626]"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {applicationsError && (
              <div className="mb-3 rounded-xl border border-red-900/60 bg-[#2A1720] p-3 text-xs text-red-300">
                {applicationsError}

                <button
                  type="button"
                  onClick={() => setApplicationsError("")}
                  className="ml-2 underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {applicationsLoading ? (
              <div className="flex justify-center py-10">
                <LoaderCircle className="animate-spin text-[#7657F6]" />
              </div>
            ) : visibleApplications.length === 0 ? (
              <div className="px-3 py-10 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#19172B] text-[#7657F6]">
                  <BriefcaseBusiness size={24} />
                </div>

                <p className="text-sm font-semibold text-[#F1F0FA]">
                  No applications found
                </p>

                <p className="mt-1 text-xs text-[#7C819D]">
                  Applications will appear here when available.
                </p>
              </div>
            ) : (
              visibleApplications.map((item) => {
                const applicationId = getApplicationId(item);

                const candidate =
                  item?.candidateId && typeof item.candidateId === "object"
                    ? item.candidateId
                    : item?.candidate;

                const recruiterPerson =
                  getApplicationJob(item)?.recruiterId ||
                  item?.recruiterId ||
                  null;

                const name = isRecruiter
                  ? getName(candidate)
                  : recruiterPerson &&
                      typeof recruiterPerson === "object"
                    ? getName(recruiterPerson)
                    : "Recruiter";

                const title = getApplicationJobTitle(item);
                const company = getApplicationCompany(item);

                const status = String(item?.status || "applied").replaceAll(
                  "_",
                  " "
                );

                const busy = openingApplicationId === applicationId;

                return (
                  <article
                    key={applicationId || item._id}
                    className="mb-3 rounded-2xl border border-[#252536] bg-[#11121F] p-4 shadow-sm transition hover:border-[#7657F6] hover:shadow-md"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#19172B] text-[#7657F6]">
                        <BriefcaseBusiness size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-[#F1F0FA]">
                          {title}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-[#7C819D]">
                          {company}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#19172B] px-2.5 py-1 text-[9px] font-semibold capitalize text-[#7657F6]">
                        {status}
                      </span>
                    </div>

                    <p className="mt-3 truncate text-[11px] text-[#7C819D]">
                      <Users size={12} className="mr-1 inline" />
                      {isRecruiter ? "Candidate" : "Recruiter"}: {name}
                    </p>

                    <button
                      type="button"
                      disabled={!applicationId || Boolean(openingApplicationId)}
                      onClick={() => openApplicationConversation(item)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7657F6] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#6248E8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy ? (
                        <>
                          <LoaderCircle size={14} className="animate-spin" />
                          Opening conversation...
                        </>
                      ) : (
                        <>
                          <MessageSquare size={14} />
                          Open conversation
                        </>
                      )}
                    </button>
                  </article>
                );
              })
            )}
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className="rounded-2xl border border-[#252536] bg-[#11121F] px-5 py-8 text-center">
              <p className="text-sm font-bold text-[#F1F0FA]">{section}</p>

              <p className="mt-2 text-xs leading-5 text-[#7C819D]">
                This section is ready for integration with your Peer.Hiring account.
              </p>

              <button
                type="button"
                onClick={() => showSection("Chats")}
                className="mt-4 rounded-xl border border-[#252536] bg-[#19172B] px-4 py-2 text-xs font-semibold text-[#7657F6] transition hover:bg-[#292343]"
              >
                Back to chats
              </button>
            </div>
          </div>
        )}

        <footer className="flex shrink-0 items-center gap-2 border-t border-[#252536] px-3.5 py-3">
          <ShieldCheck size={15} className="shrink-0 text-[#7657F6]" />

          <p className="text-[10px] text-[#7C819D]">
            Professional communication for job applications
          </p>
        </footer>
      </aside>

      {/* Main chat workspace */}
      <section
        className={`${
          mobileChatOpen ? "flex" : "hidden md:flex"
        } min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-[#090A12]`}
      >
        {activeChat ? (
          <>
            {/* Chat header */}
            <header className="flex min-h-[64px] shrink-0 items-center justify-between gap-3 border-b border-[#252536] bg-[#11121F] px-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    stopTyping?.();
                    setMobileChatOpen(false);
                  }}
                  aria-label="Back to conversations"
                  className="rounded-xl p-1.5 text-[#7C819D] hover:bg-[#171626] md:hidden"
                >
                  <ArrowLeft size={19} />
                </button>

                <Avatar
                  name={activeName}
                  image={activeImage}
                  online={
                    activeChat.conversationType !== "group" &&
                    otherParticipantOnline
                  }
                />

                <div className="min-w-0">
                  <h2 className="truncate text-[15px] font-bold text-[#F1F0FA]">
                    {activeName}
                  </h2>

                  <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-[#777D99]">
                    {typingNames.length ? (
                      <span className="font-medium text-[#7657F6]">
                        typing...
                      </span>
                    ) : activeChat.conversationType === "group" ? (
                      `${participants.length} participants`
                    ) : (
                      <>
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            otherParticipantOnline
                              ? "bg-[#00D6A0] shadow-[0_0_8px_rgba(0,214,160,0.45)]"
                              : "bg-[#777D99]"
                          }`}
                        />

                        <span>
                          {otherParticipantOnline
                            ? "Online"
                            : formatLastSeen(otherParticipantLastSeen)}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
  type="button"
  onClick={onBackToDashboard}
  title="Back to Dashboard"
  className="
    flex h-8 w-8 items-center justify-center
    rounded-xl
    border border-[#252536]
    bg-[#171725]
    text-[#A78BFA]
    transition-all duration-200
    hover:border-[#7657F6]
    hover:bg-[#7657F6]
    hover:text-white
  "
>
  <ArrowLeft size={21} />
</button>
                <button
                  type="button"
                  title={favourites.includes(activeId) ? "Remove from favourites" : "Add to favourites"}
                  aria-label={favourites.includes(activeId) ? "Remove from favourites" : "Add to favourites"}
                  onClick={() => toggleFavourite(activeId)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-[#19172B] ${
                    favourites.includes(activeId) ? "text-[#F5C451]" : "text-[#777D99] hover:text-[#F5C451]"
                  }`}
                >
                  <Star size={17} className={favourites.includes(activeId) ? "fill-current" : ""} />
                </button>
                <button
                  type="button"
                  title="Call (coming soon)"
                  aria-label="Call"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#7C819D] transition hover:bg-[#19172B] hover:text-[#7657F6]"
                >
                  <Phone size={18} />
                </button>
                <button
                  type="button"
                  title="More options"
                  aria-label="More conversation options"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#7C819D] transition hover:bg-[#19172B] hover:text-[#7657F6]"
                >
                  <MoreVertical size={19} strokeWidth={1.8} />
                </button>
              </div>
            </header>

            {/* Application information */}
            {linkedApplication && (
              <div className="flex min-h-[42px] shrink-0 items-center gap-2.5 border-b border-[#252536] bg-[#171626] px-4 sm:px-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#292343] text-[#7657F6]">
                  <BriefcaseBusiness size={15} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[10px] text-[#7C819D]">
                    {activeCompanyName}
                  </p>

                  <span className="truncate text-xs font-bold text-[#F1F0FA]">
                    {activeJobTitle}
                  </span>
                </div>

                <ShieldCheck
                  size={17}
                  className="ml-auto shrink-0 text-[#7657F6]"
                />
              </div>
            )}

            {/* Messages */}
            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain peer-chat-scroll bg-[radial-gradient(ellipse_at_50%_38%,rgba(91,58,166,0.22),transparent_42%),radial-gradient(ellipse_at_10%_0%,rgba(118,87,246,0.07),transparent_32%),#090A12] px-3 py-3 sm:px-6 sm:py-4 [scrollbar-width:thin]">
              <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-1.5">
                {messageList.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-[76px] w-[76px] items-center justify-center rounded-3xl border border-[#252536] bg-[#11121F] text-[#7657F6] shadow-sm">
                      <MessageSquare size={30} strokeWidth={1.5} />
                    </div>

                    <p className="text-sm font-bold text-[#F1F0FA]">
                      Start the conversation
                    </p>

                    <p className="mt-1 text-xs text-[#777D99]">
                      Send a message to get things moving.
                    </p>
                  </div>
                ) : (
                  messageList.map((message, index) => {
                    const mine = isMyMessage(message);
                    const deleted = message.isDeleted;
                    const messageId = getMessageId(message);

                    const content = deleted
                      ? "This message was deleted"
                      : message.content || "";

                    const previous = messageList[index - 1];

                    const showAvatar =
                      !mine &&
                      (!previous ||
                        getId(previous.sender) !== getId(message.sender));

                    const showDate =
                      !previous ||
                      new Date(previous.createdAt).toDateString() !==
                        new Date(message.createdAt).toDateString();

                    const status = getMessageStatus(message);
                    const isEditing = editingMessageId === messageId;

                    return (
                      <div key={messageId || index}>
                        {showDate && (
                          <div className="my-2.5 flex justify-center">
                            <span className="rounded-full border border-[#252536] bg-[#11121F] px-4 py-1.5 text-[10px] font-semibold text-[#7C819D] shadow-sm">
                              {formatDateLabel(message.createdAt)}
                            </span>
                          </div>
                        )}

                        <div
                          className={`group relative flex items-end gap-2 ${
                            mine ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!mine && (
                            <div className="w-7 shrink-0">
                              {showAvatar && (
                                <Avatar
                                  name={getName(message.sender)}
                                  image={getAvatar(message.sender)}
                                  size="sm"
                                />
                              )}
                            </div>
                          )}

                          <div
                            className={`relative flex min-w-0 max-w-[78%] flex-col ${
                              mine ? "items-end" : "items-start"
                            } sm:max-w-[66%]`}
                          >
                            {mine && !deleted && !isEditing && (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMessageMenu((previousMenu) =>
                                    previousMenu === messageId
                                      ? null
                                      : messageId
                                  )
                                }
                                className="absolute -top-3 right-1 z-10 rounded-full border border-[#252536] bg-[#11121F] p-1.5 text-[#7C819D] opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-[#19172B] hover:text-[#7657F6]"
                                title="Message options"
                                aria-label="Message options"
                              >
                                <MoreVertical size={15} />
                              </button>
                            )}

                            {isEditing ? (
                              <form
                                onSubmit={saveEditedMessage}
                                className="w-full min-w-[220px] rounded-2xl border border-[#7657F6] bg-[#11121F] p-2 shadow-md"
                              >
                                <textarea
                                  autoFocus
                                  value={editDraft}
                                  maxLength={5000}
                                  onChange={(event) =>
                                    setEditDraft(event.target.value)
                                  }
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" &&
                                      !event.shiftKey
                                    ) {
                                      event.preventDefault();
                                      event.currentTarget.form?.requestSubmit();
                                    }

                                    if (event.key === "Escape") {
                                      cancelEditing();
                                    }
                                  }}
                                  className="max-h-32 min-h-[65px] w-full resize-y bg-transparent px-2 py-1 text-[12px] leading-[1.45] text-[#F1F0FA] outline-none"
                                />

                                <div className="flex justify-end gap-2 border-t border-[#252536] pt-2">
                                  <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className="rounded-lg px-3 py-1.5 text-[11px] text-[#7C819D] transition hover:bg-[#131421]"
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    type="submit"
                                    disabled={!editDraft.trim() || editingMessage}
                                    className="rounded-lg bg-[#7657F6] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#6248E8] disabled:opacity-50"
                                  >
                                    Save
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div
                                className={`break-words rounded-[10px] px-3 py-[4px] text-[11.5px] leading-[1.32] shadow-none [overflow-wrap:anywhere] ${
                                  mine
                                    ? "rounded-br-[3px] border border-[#7657F6]/35 bg-gradient-to-br from-[#40336B] to-[#30284F] text-[#F7F5FF] shadow-[0_1px_10px_rgba(118,87,246,0.08)]"
                                    : "rounded-bl-[3px] border border-[#2C2B42] bg-[#141522] text-[#D8D7E8]"
                                } ${
                                  deleted ? "italic text-[#777D99]" : ""
                                }`}
                              >
                                {content}

                                {!deleted &&
                                  Array.isArray(message.attachments) &&
                                  message.attachments.map(renderAttachment)}

                                <div
                                  className={`mt-0.5 flex items-center justify-end gap-1 text-[8px] leading-[1] ${
                                    mine
                                      ? "text-[#D8CCFF]"
                                      : "text-[#777D99]"
                                  }`}
                                >
                                  {message.isEdited && !deleted && (
                                    <span className="italic">Edited</span>
                                  )}

                                  <span>{formatTime(message.createdAt)}</span>

                                  {mine && (
                                    <span
                                      title={
                                        status === "read"
                                          ? "Read"
                                          : status === "delivered"
                                            ? "Delivered"
                                            : "Sent"
                                      }
                                    >
                                      {status === "read" ? (
                                        <CheckCheck
                                          size={13}
                                          className="text-[#7657F6]"
                                        />
                                      ) : status === "delivered" ? (
                                        <CheckCheck
                                          size={13}
                                          className="text-[#D8CCFF]"
                                        />
                                      ) : (
                                        <Check size={13} />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {mine &&
                              activeMessageMenu === messageId &&
                              !deleted &&
                              !isEditing && (
                                <div className="absolute right-0 top-1 z-20 w-40 overflow-hidden rounded-xl border border-[#252536] bg-[#11121F] py-1 shadow-xl">
                                  <button
                                    type="button"
                                    onClick={() => handleEditMessage(message)}
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-medium text-[#C5C3D7] transition hover:bg-[#171626] hover:text-[#7657F6]"
                                  >
                                    <Pencil size={14} />
                                    Edit message
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMessage(message)}
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-medium text-red-300 transition hover:bg-[#2A1720]"
                                  >
                                    <Trash2 size={14} />
                                    Delete message
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                <div ref={endRef} className="h-px shrink-0" />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-3 mb-2 flex items-start justify-between gap-3 rounded-xl border border-red-900/60 bg-[#2A1720] px-3 py-2.5 text-xs text-red-300 sm:mx-5">
                <p>{error}</p>

                <button
                  type="button"
                  onClick={() => setError("")}
                  aria-label="Dismiss error"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Message composer */}
            <div className="shrink-0 border-t border-[#252536] bg-[#0D0E17] px-3 py-2.5 sm:px-5 sm:py-3">
              <form onSubmit={handleSendMessage} className="relative mx-auto max-w-5xl">
                {emojiOpen && (
                  <div className="absolute bottom-[calc(100%+12px)] left-12 z-30 grid grid-cols-6 gap-1 rounded-2xl border border-[#2C2B42] bg-[#131421] p-2 shadow-2xl shadow-black/30">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setDraft((previous) => `${previous}${emoji}`);
                          setEmojiOpen(false);
                          textareaRef.current?.focus();
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition hover:bg-[#292343]"
                        aria-label={`Insert ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex min-h-[46px] items-end gap-1.5 rounded-xl border border-[#252536] bg-[#11121F] px-2.5 py-1.5 shadow-sm transition focus-within:border-[#7657F6]/70 focus-within:shadow-[0_0_0_3px_rgba(118,87,246,0.12)] sm:gap-2.5">
                  <button
                    type="button"
                    title="Attachments coming soon"
                    aria-label="Attach a file"
                    onClick={() =>
                      setError(
                        "File attachments need to be connected to your upload endpoint."
                      )
                    }
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#7C819D] transition hover:bg-[#19172B] hover:text-[#7657F6]"
                  >
                    <Paperclip size={19} strokeWidth={1.8} />
                  </button>

                  <button
                    type="button"
                    title="Insert emoji"
                    aria-label="Insert emoji"
                    onClick={() => setEmojiOpen((previous) => !previous)}
                    className={`mb-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl transition hover:bg-[#19172B] hover:text-[#7657F6] sm:flex ${emojiOpen ? "bg-[#19172B] text-[#7657F6]" : "text-[#7C819D]"}`}
                  >
                    <Smile size={19} strokeWidth={1.8} />
                  </button>

                  <textarea
                    ref={textareaRef}
                    rows={1}
                    maxLength={5000}
                    onBlur={stopTyping}
                    value={draft}
                    onChange={(event) => {
                      const value = event.target.value;

                      setDraft(value);

                      if (value.trim()) {
                        startTyping();
                      } else {
                        stopTyping();
                      }

                      event.target.style.height = "auto";
                      event.target.style.height = `${Math.min(
                        event.target.scrollHeight,
                        112
                      )}px`;
                    }}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Write your message..."
                    aria-label="Type a message"
                    className="max-h-28 min-h-[34px] min-w-0 flex-1 resize-none self-center bg-transparent px-1 py-[10px] text-[12px] leading-[1.45] text-[#F1F0FA] outline-none placeholder:text-[#777D99]"
                  />

                  <button
                    type="submit"
                    disabled={
                      !draft.trim() ||
                      sending ||
                      !isConnected ||
                      joinedConversationId !== activeId
                    }
                    title="Send message"
                    aria-label="Send message"
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#9278FF] to-[#6248E8] text-white shadow-[0_0_22px_rgba(118,87,246,0.20)] transition hover:-translate-y-0.5 hover:bg-[#6248E8] disabled:translate-y-0 disabled:bg-[#374151] disabled:text-white disabled:shadow-none"
                  >
                    {sending ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Send size={17} strokeWidth={1.9} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-center text-[10px] text-[#777D99]">
                  Keep conversations professional and related to the application.
                </p>
              </form>
            </div>
          </>
        ) : (
          /* Empty workspace */
          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-[#090A12] px-5 py-8 text-center">
            <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-[#7657F6]/10 blur-3xl" />

            <div className="absolute bottom-[-120px] left-[-100px] h-80 w-80 rounded-full bg-[#7657F6]/5 blur-3xl" />

            <div className="relative z-10">
              <div className="mx-auto mb-7 flex h-[100px] w-[100px] items-center justify-center rounded-[30px] border border-[#252536] bg-[#11121F] text-[#7657F6] shadow-xl shadow-[#7657F6]/5">
                <MessageSquare size={42} strokeWidth={1.4} />
              </div>

              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7657F6]">
                Peer.Hiring messages
              </p>

              <h2 className="mt-3 max-w-md text-2xl font-bold tracking-[-0.8px] text-[#F1F0FA] sm:text-[32px]">
                Make your next career connection.
              </h2>

              <p className="mx-auto mt-3 max-w-[390px] text-sm leading-6 text-[#7C819D]">
                Connect with recruiters and candidates about real job applications.
                Select a conversation to continue where you left off.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSection("Chats");
                    setFilter("All");
                    setSearch("");
                    setMobileChatOpen(false);
                  }}
                  className="flex h-11 items-center gap-2 rounded-xl bg-[#7657F6] px-5 text-[13px] font-semibold text-white shadow-lg shadow-[#7657F6]/15 transition hover:-translate-y-0.5 hover:bg-[#6248E8]"
                >
                  <MessageSquare size={16} />
                  View conversations
                </button>

                <button
                  type="button"
                  onClick={() => showSection("Applications")}
                  className="flex h-11 items-center gap-2 rounded-xl border border-[#252536] bg-[#11121F] px-5 text-[13px] font-semibold text-[#C5C3D7] shadow-sm transition hover:-translate-y-0.5 hover:border-[#7657F6] hover:bg-[#171626]"
                >
                  <BriefcaseBusiness size={16} />
                  Applications
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] font-medium text-[#7C819D]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-[#7657F6]" />
                  Professional communication
                </span>

                <span className="flex items-center gap-1.5">
                  <BriefcaseBusiness size={15} className="text-[#7657F6]" />
                  Job-focused conversations
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
    </>
  );
}