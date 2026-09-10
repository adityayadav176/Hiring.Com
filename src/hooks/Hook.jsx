import { useContext } from "react";

import { AdminContext } from "../context/AdminContext";
import { AuthContext } from './../context/AuthContext';
import { CompanyContext } from "../context/CompanyContext";
import { ProfileContext } from './../context/ProfileContext';
import { TitleContext } from './../context/TitleContext';
import { ReportContext } from './../context/ReportContext';
import { NotificationContext } from "../context/NotificationContext";
import { ConversationContext } from "../context/Conversation";

const useAdmin = () => {
    const context = useContext(AdminContext);

    if(!context) {
        throw new Error("Use Admin Must Be Used Admin Provider");
    }

    return context;
}

const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error("Use Auth Must Be Used Auth Provider")
    }

    return context;
}

const useCompany = () => {
    const context = useContext(CompanyContext);

    if(!context) {
        throw new Error("Use Company Must Be Used Company Provider")
    }

    return context;
}
const useProfile = () => {
    const context = useContext(ProfileContext);

    if(!context) {
        throw new Error("Use Profile Must Be Used Profile Provider")
    }

    return context;
}
const useTitle = () => {
    const context = useContext(TitleContext);

    if(!context) {
        throw new Error("Use Title Must Be Used Title Provider")
    }

    return context;
}

const useReport = () => {
    const context = useContext(ReportContext);

    if(!context) {
        throw new Error("Use Report Must Be Use In Report Provider");
    }

    return context;
}

const useNotification = () => {
    const context = useContext(NotificationContext);

    if(!context) {
        throw new Error("Use Notification Must Be Use In Notification Provider");
    }

    return context;
}

const useConversation = () => {
    const context = useContext(ConversationContext);

    if(!context) {
        throw new Error("Use Convesation Must Be Use In Conversation Provider");
    }

    return context;
}


export {
    useAdmin,
    useAuth,
    useCompany,
    useProfile,
    useTitle,
    useReport,
    useNotification,
    useConversation
}