import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";

import { ConversationContext } from "../../context/ConversationContext";
import { MessageContext } from "../../context/MessageContext";
import { ApplicationContext } from "../../context/ApplicationContext";
import { useAuth } from "../../hooks/Hook";

const API_URL = import.meta.env.VITE_API_URL;

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

  if (typeof person === "string") {
    return "Peer.Hiring member";
  }

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

  const now = new Date();

  if (parsed.toDateString() === now.toDateString()) {
    return parsed.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return parsed.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
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
  const company =
    job?.companyId || application?.companyId || job?.company;

  if (company && typeof company === "object") {
    return company.companyName || company.name || "Company";
  }

  return job?.companyName || application?.companyName || "Company";
};

function Avatar({
  name = "Unknown user",
  image = "",
  online = false,
  size = "md",
}) {
  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-[10px]"
      : size === "lg"
        ? "h-11 w-11 text-sm"
        : "h-11 w-11 text-[13px]";

  return (
    <div className="relative shrink-0">
      {image ? (
        <img
          src={image}
          alt={name}
          className={`${sizeClass} rounded-full border border-[#e6e4ef] object-cover`}
        />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full border border-[#e6e4ef] bg-[#eeebf8] font-semibold text-[#58449c]`}
        >
          {getInitials(name)}
        </div>
      )}

      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#25a56a]" />
      )}
    </div>
  );
}

function SectionNavigation({
  section,
  showSection,
  unreadCount,
  currentUser,
}) {
  return (
    <nav className="hidden w-[64px] shrink-0 flex-col items-center border-r border-[#e8e8eb] bg-[#f8f8fa] py-4 md:flex sm:w-[72px]">
      <button
        type="button"
        onClick={() => showSection("Chats")}
        title="Peer.Hiring home"
        aria-label="Peer.Hiring home"
        className="mb-8 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6547b8] text-[15px] font-bold tracking-tight text-white"
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
                ? "bg-[#eae5f7] text-[#59409c]"
                : "text-[#626872] hover:bg-[#ececf0] hover:text-[#24252a]"
            }`}
          >
            {section === id && (
              <span className="absolute -left-[17px] h-5 w-[3px] rounded-r bg-[#6547b8]" />
            )}

            <Icon size={20} strokeWidth={1.8} />

            {id === "Chats" && unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-[#f8f8fa] bg-[#6547b8] px-1 text-[9px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="my-5 h-px w-8 bg-[#e1e1e6]" />

      <button
        type="button"
        title="Settings"
        aria-label="Settings"
        onClick={() => showSection("Settings")}
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          section === "Settings"
            ? "bg-[#eae5f7] text-[#59409c]"
            : "text-[#626872] hover:bg-[#ececf0]"
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
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#626872] hover:bg-[#ececf0]"
        >
          <CircleHelp size={20} strokeWidth={1.8} />
        </button>

        <button
          type="button"
          title="My profile"
          aria-label="My profile"
          onClick={() => showSection("Profile")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd5f0] bg-[#eeebf8] text-xs font-semibold text-[#59409c]"
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
  } = useContext(MessageContext) || {};

  const appContext = useContext(ApplicationContext) || {};

  const {
    applications = [],
    jobApplications = [],
    handleGetMyApplications,
    handleGetRecruiterApplications,
  } = appContext;

  const { user, recruiter, getUser } = useAuth();

  const currentUser = recruiter || user;
  const currentUserId = getId(currentUser);

  const role = String(
    currentUser?.role || currentUser?.accountType || ""
  ).toLowerCase();

  const isRecruiter = Boolean(recruiter || role === "recruiter");
  const isCandidate = Boolean(user && !isRecruiter);

  const getUserCalledRef = useRef(false);
  const activeRequestRef = useRef(0);
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  const [activeId, setActiveId] = useState("");
  const [section, setSection] = useState("Chats");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [unreadIds, setUnreadIds] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [loadedApplications, setLoadedApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState("");
  const [openingApplicationId, setOpeningApplicationId] = useState("");
  const [applicationsRefreshKey, setApplicationsRefreshKey] = useState(0);

  const conversations = useMemo(
    () => (Array.isArray(myConversations) ? myConversations : []),
    [myConversations]
  );

  useEffect(() => {
    if (getUserCalledRef.current) return;

    getUserCalledRef.current = true;

    Promise.resolve(getUser?.()).catch((err) => {
      console.error("Failed to fetch current user:", err);
    });
  }, [getUser]);

  useEffect(() => {
    handleGetMyConversations?.().catch((err) => {
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

    setUnreadIds((prev) => prev.filter((id) => id !== activeId));

    return () => {
      cancelled = true;
    };
  }, [
    activeId,
    section,
    handleGetConversationById,
    handleGetMessages,
  ]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [activeId, messages?.length]);

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
        if (!cancelled) {
          setApplicationsLoading(false);
        }
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

  const showSection = useCallback((nextSection) => {
    setSection(nextSection);
    setError("");

    if (nextSection !== "Chats") {
      setMobileChatOpen(false);
    } else {
      setActiveId("");
      setMobileChatOpen(false);
    }
  }, []);

  const selectChat = useCallback((conversation) => {
    const id = getId(conversation);

    setActiveId(id);
    setSection("Chats");
    setMobileChatOpen(true);
    setError("");
  }, []);

  const toggleFavourite = useCallback((id) => {
    setFavourites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
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
            headers: {
              "Content-Type": "application/json",
            },
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
            "The server did not return a valid conversation. Check the POST /conversation/:applicationId response."
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

  const sendMessage = useCallback(
    (event) => {
      event.preventDefault();

      if (!draft.trim() || sending) return;

      setError(
        "Message sending is not connected yet. Connect the Socket.IO send-message event to enable sending."
      );
    },
    [draft, sending]
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

  const messageList = Array.isArray(messages) ? messages : [];

  return (
    <main className="fixed inset-0 z-40 flex h-dvh w-full overflow-hidden bg-white font-sans text-[#202124]">
      <SectionNavigation
        section={section}
        showSection={showSection}
        unreadCount={unreadCount}
        currentUser={currentUser}
      />

      <aside
        className={`${
          mobileChatOpen ? "hidden md:flex" : "flex"
        } min-h-0 w-full shrink-0 flex-col border-r border-[#e8e8eb] bg-white md:w-[290px] sm:w-[320px] lg:w-[360px]`}
      >
        <header className="shrink-0 px-4 pb-4 pt-5 sm:px-5">
          <div className="mb-5 flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#202124]">
                {section}
              </h1>
              <p className="mt-1 text-xs text-[#777d87]">
                {section === "Chats"
                  ? "Messages about job applications"
                  : `${section} workspace`}
              </p>
            </div>

            {section === "Chats" && (
              <button
                type="button"
                title="Open applications"
                aria-label="Open applications"
                onClick={() => showSection("Applications")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e6e2ef] text-[#554092] transition hover:bg-[#f5f2fc]"
              >
                <Plus size={20} strokeWidth={1.9} />
              </button>
            )}
          </div>

          {section === "Chats" && (
            <>
              <label className="flex h-[42px] items-center gap-2.5 rounded-lg border border-[#e5e6e9] bg-[#f6f7f8] px-3 transition focus-within:border-[#a69acb] focus-within:bg-white">
                <Search size={17} className="shrink-0 text-[#777d87]" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search people or jobs"
                  aria-label="Search conversations"
                  className="w-full min-w-0 bg-transparent text-[13px] text-[#202124] outline-none placeholder:text-[#888e98]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="shrink-0 text-[#777d87]"
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
                    className={`flex h-[34px] shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs transition ${
                      filter === label
                        ? "border-[#ded5f3] bg-[#f1edfa] font-semibold text-[#59409c]"
                        : "border-[#e4e5e8] bg-white text-[#626872] hover:bg-[#f7f7f9]"
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

        {section === "Chats" ? (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2 [scrollbar-color:#d5d6da_transparent] [scrollbar-width:thin]">
            {filteredChats.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <MessageSquare size={23} className="mb-3 text-[#9a9da5]" />
                <p className="text-sm font-medium text-[#35383e]">
                  No conversations found
                </p>
                <p className="mt-1 text-xs text-[#81858e]">
                  {search
                    ? "Try another name or filter."
                    : "Choose an application to start a conversation."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={() => showSection("Applications")}
                    className="mt-4 rounded-lg bg-[#6547b8] px-4 py-2 text-xs font-medium text-white"
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

                const image = getAvatar(person);
                const selected = id === activeId;
                const favourite = favourites.includes(id);
                const unread = unreadIds.includes(id);

                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => selectChat(chat)}
                    className={`mb-0.5 flex w-full items-center gap-3 rounded-lg px-2.5 py-3 text-left transition-colors ${
                      selected ? "bg-[#f0edf8]" : "hover:bg-[#f6f6f8]"
                    }`}
                  >
                    <Avatar
                      name={name}
                      image={image}
                      online={Boolean(person?.isOnline)}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-semibold text-[#26282d]">
                          {name}
                        </span>
                        <span
                          className={`shrink-0 text-[10px] ${
                            unread
                              ? "font-semibold text-[#59409c]"
                              : "text-[#828690]"
                          }`}
                        >
                          {formatTime(chat.lastMessageAt || chat.updatedAt)}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="truncate text-[11px] text-[#6d727c]">
                          {chat.application?.jobId?.title ||
                            chat.application?.jobTitle ||
                            "Conversation"}
                        </span>

                        {favourite && (
                          <Star
                            size={11}
                            className="shrink-0 fill-[#b28a35] text-[#b28a35]"
                          />
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-[#7a7f88]">
                          {getLastMessageText(chat)}
                        </p>

                        {unread && (
                          <span className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-[#6547b8] px-1 text-[10px] font-semibold text-white">
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
              <p className="text-xs text-[#777d87]">
                {visibleApplications.length} application(s)
              </p>

              <button
                type="button"
                title="Refresh applications"
                onClick={() => {
                  setLoadedApplications([]);
                  setApplicationsRefreshKey((value) => value + 1);
                }}
                className="rounded-lg p-2 text-[#626872] hover:bg-[#f3f0fa]"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {applicationsError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
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
                <LoaderCircle className="animate-spin text-[#6547b8]" />
              </div>
            ) : visibleApplications.length === 0 ? (
              <div className="px-3 py-10 text-center">
                <BriefcaseBusiness
                  className="mx-auto mb-3 text-[#9a9da5]"
                  size={24}
                />
                <p className="text-sm font-medium text-[#35383e]">
                  No applications found
                </p>
                <p className="mt-1 text-xs text-[#81858e]">
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
                    className="mb-2 rounded-xl border border-[#e8e8eb] bg-white p-3"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eeebf8] text-[#6547b8]">
                        <BriefcaseBusiness size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-[#26282d]">
                          {title}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[#777d87]">
                          {company}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#f1edfa] px-2 py-1 text-[9px] capitalize text-[#59409c]">
                        {status}
                      </span>
                    </div>

                    <p className="mt-2 truncate text-[11px] text-[#6d727c]">
                      <Users size={12} className="mr-1 inline" />
                      {isRecruiter ? "Candidate" : "Recruiter"}: {name}
                    </p>

                    <button
                      type="button"
                      disabled={!applicationId || Boolean(openingApplicationId)}
                      onClick={() => openApplicationConversation(item)}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#6547b8] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5539a4] disabled:cursor-not-allowed disabled:opacity-60"
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
            <div className="rounded-xl border border-[#e8e8eb] bg-[#fafafa] px-5 py-8 text-center">
              <p className="text-sm font-semibold text-[#35383e]">{section}</p>
              <p className="mt-2 text-xs leading-5 text-[#777d87]">
                This section is ready for integration with your Peer.Hiring account.
              </p>
              <button
                type="button"
                onClick={() => showSection("Chats")}
                className="mt-4 rounded-lg border border-[#e2e2e7] bg-white px-4 py-2 text-xs font-medium text-[#454951] hover:bg-[#f6f6f8]"
              >
                Back to chats
              </button>
            </div>
          </div>
        )}

        <footer className="flex shrink-0 items-center gap-2 border-t border-[#ededf0] px-3.5 py-3">
          <ShieldCheck size={15} className="shrink-0 text-[#77718d]" />
          <p className="text-[10px] text-[#777d87]">
            Professional communication for job applications
          </p>
        </footer>
      </aside>

      <section
        className={`${
          mobileChatOpen ? "flex" : "hidden md:flex"
        } min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-white`}
      >
        {activeChat ? (
          <>
            <header className="flex min-h-[68px] shrink-0 items-center justify-between gap-3 border-b border-[#e9e9ed] bg-white px-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileChatOpen(false)}
                  aria-label="Back to conversations"
                  className="rounded-lg p-1.5 text-[#626872] hover:bg-[#f2f2f5] md:hidden"
                >
                  <ArrowLeft size={19} />
                </button>

                <Avatar
                  name={activeName}
                  image={activeImage}
                  online={Boolean(otherParticipant?.isOnline)}
                />

                <div className="min-w-0">
                  <h2 className="truncate text-[14px] font-semibold text-[#202124]">
                    {activeName}
                  </h2>
                  <p className="mt-1 truncate text-[11px] text-[#747983]">
                    {activeChat.conversationType === "group"
                      ? `${participants.length} participants`
                      : otherParticipant?.email || "Peer.Hiring member"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  title="Call (coming soon)"
                  aria-label="Call"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#666b74] hover:bg-[#f4f4f6]"
                >
                  <Phone size={18} />
                </button>

                <button
                  type="button"
                  title="More options"
                  aria-label="More conversation options"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#666b74] hover:bg-[#f4f4f6]"
                >
                  <MoreVertical size={19} strokeWidth={1.8} />
                </button>
              </div>
            </header>

            {linkedApplication && (
              <div className="flex min-h-[43px] shrink-0 items-center gap-2.5 border-b border-[#ededf0] bg-[#fafafa] px-4 sm:px-6">
                <BriefcaseBusiness
                  size={15}
                  className="shrink-0 text-[#6b59a5]"
                />
                <div className="min-w-0">
                  <p className="truncate text-[10px] text-[#777d87]">
                    {activeCompanyName}
                  </p>
                  <span className="truncate text-xs font-semibold text-[#3e4148]">
                    {activeJobTitle}
                  </span>
                </div>
                <ShieldCheck
                  size={16}
                  className="ml-auto shrink-0 text-[#65509f]"
                />
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-white px-3 py-5 sm:px-6 sm:py-6 [scrollbar-color:#d5d6da_transparent] [scrollbar-width:thin]">
              <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-4">
                {messageList.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
                    <MessageSquare
                      size={25}
                      className="mb-3 text-[#9a9da5]"
                    />
                    <p className="text-sm font-medium text-[#35383e]">
                      Start the conversation
                    </p>
                    <p className="mt-1 text-xs text-[#81858e]">
                      Send a message to get things moving.
                    </p>
                  </div>
                ) : (
                  messageList.map((message, index) => {
                    const mine = isMyMessage(message);
                    const deleted = message.isDeleted;

                    const content = deleted
                      ? "This message was deleted"
                      : message.content ||
                        (message.attachments?.length ? "Attachment" : "");

                    const previous = messageList[index - 1];

                    const showAvatar =
                      !mine &&
                      (!previous ||
                        getId(previous.sender) !== getId(message.sender));

                    const senderImage = getAvatar(message.sender);

                    return (
                      <div
                        key={message._id || message.id || index}
                        className={`flex min-w-0 items-end gap-2 ${
                          mine ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!mine &&
                          (showAvatar ? (
                            <Avatar
                              name={getName(message.sender)}
                              image={senderImage}
                              size="sm"
                            />
                          ) : (
                            <div className="w-8 shrink-0" />
                          ))}

                        <div
                          className={`flex min-w-0 max-w-[86%] flex-col sm:max-w-[72%] ${
                            mine ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`break-words rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.65] [overflow-wrap:anywhere] ${
                              mine
                                ? "rounded-br-[5px] bg-[#e9e2f8] text-[#292333]"
                                : "rounded-bl-[5px] border border-[#e8e8eb] bg-[#f6f6f7] text-[#292b30]"
                            }`}
                          >
                            {content}

                            {Array.isArray(message.attachments) &&
                              message.attachments.map((attachment, i) => (
                                <a
                                  key={
                                    attachment._id || attachment.url || i
                                  }
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`mt-2 block break-all text-xs underline ${
                                    mine
                                      ? "text-[#65509f]"
                                      : "text-[#6547b8]"
                                  }`}
                                >
                                  {attachment.originalName ||
                                    attachment.fileName ||
                                    "View attachment"}
                                </a>
                              ))}
                          </div>

                          <div className="mt-1 flex items-center gap-1.5 px-1 text-[10px] text-[#858994]">
                            {formatTime(message.createdAt)}
                            {mine && (
                              <CheckCheck
                                size={13}
                                className="text-[#65509f]"
                              />
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

            {error && (
              <div className="mx-3 mb-2 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:mx-5">
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

            <div className="shrink-0 border-t border-[#e8e8eb] bg-white px-3 py-3 sm:px-5 sm:py-3.5">
              <form onSubmit={sendMessage} className="mx-auto max-w-5xl">
                <div className="flex min-h-[54px] items-end gap-1.5 rounded-[28px] border border-[#e0e1e5] bg-[#f6f6f7] px-2 py-1.5 transition focus-within:border-[#b9add9] focus-within:bg-white sm:gap-2 sm:px-2.5">
                  <button
                    type="button"
                    title="Attachments coming soon"
                    aria-label="Attach a file"
                    onClick={() =>
                      setError(
                        "File attachments need to be connected to your upload endpoint."
                      )
                    }
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#626872] hover:bg-[#eaeaf0]"
                  >
                    <Paperclip size={20} strokeWidth={1.8} />
                  </button>

                  <button
                    type="button"
                    title="Insert emoji"
                    aria-label="Insert emoji"
                    onClick={() => setDraft((prev) => `${prev}😊`)}
                    className="mb-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#626872] hover:bg-[#eaeaf0] sm:flex"
                  >
                    <Smile size={20} strokeWidth={1.8} />
                  </button>

                  <textarea
                    ref={textareaRef}
                    rows={1}
                    maxLength={5000}
                    value={draft}
                    onChange={(event) => {
                      setDraft(event.target.value);
                      event.target.style.height = "auto";
                      event.target.style.height = `${Math.min(
                        event.target.scrollHeight,
                        112
                      )}px`;
                    }}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Type a message"
                    aria-label="Type a message"
                    className="max-h-28 min-h-[40px] min-w-0 flex-1 resize-none self-center bg-transparent px-1 py-[10px] text-[13px] leading-5 text-[#25272c] outline-none placeholder:text-[#777d87]"
                  />

                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    title="Send message"
                    aria-label="Send message"
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6547b8] text-white transition hover:bg-[#5539a4] disabled:bg-[#d7d1e5] disabled:text-white"
                  >
                    {sending ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Send size={17} strokeWidth={1.9} />
                    )}
                  </button>
                </div>

                <p className="mt-2 hidden text-center text-[10px] text-[#858994] sm:block">
                  Keep conversations professional and related to the application.
                </p>
              </form>
            </div>
          </>
        ) : (
          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-[#fbfbfc] px-5 py-8 text-center">
            <div className="mb-7 flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[25px] border border-[#e6e0f1] bg-white text-[#65509f] shadow-[0_4px_20px_rgba(30,25,50,0.05)]">
              <MessageSquare size={38} strokeWidth={1.45} />
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#74649f]">
              Peer.Hiring messages
            </p>

            <h2 className="mt-3 max-w-md text-2xl font-semibold tracking-[-0.6px] text-[#24252a] sm:text-[30px]">
              Make your next career connection.
            </h2>

            <p className="mt-3 max-w-[390px] text-sm leading-6 text-[#747983]">
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
                className="flex h-10 items-center gap-2 rounded-lg bg-[#6547b8] px-4 text-[13px] font-medium text-white transition hover:bg-[#5539a4]"
              >
                <MessageSquare size={16} />
                View conversations
              </button>

              <button
                type="button"
                onClick={() => showSection("Applications")}
                className="flex h-10 items-center gap-2 rounded-lg border border-[#e1e1e6] bg-white px-4 text-[13px] font-medium text-[#41434a] hover:bg-[#f5f5f7]"
              >
                <BriefcaseBusiness size={16} />
                Applications
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] text-[#747983]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#65509f]" />
                Professional communication
              </span>
              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness size={15} className="text-[#65509f]" />
                Job-focused conversations
              </span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
