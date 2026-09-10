import { createContext } from "react";

export const NotificationContext = createContext();

const NotificationProvider = ({children}) => {
    return (
        <NotificationContext.Provider>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider;