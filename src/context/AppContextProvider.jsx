import AdminProvider from "./AdminContext";
import AuthProvider from "./AuthContext";
import CompanyProvider from "./CompanyContext";
import ProfileProvider from "./ProfileContext";
import ReportProvider from "./ReportContext";
import NotificationProvider from "./NotificationContext";
import ConversationProvider from "./Conversation";
import MessageProvider from "./MessageContext";
import SessionProvider from "./SessionContext";
import TitleProvider from "./TitleContext";
import InterviewProvider from "./InterviewContext";
import ApplicationProvider from "./ApplicationContext";
import JobProvider from "./JobContext";
import ResumeProvider from "./ResumeContext";

const AppContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <CompanyProvider>
          <JobProvider>
            <ResumeProvider>
              <ApplicationProvider>
                <InterviewProvider>
                  <SessionProvider>
                    <ConversationProvider>
                      <MessageProvider>
                        <NotificationProvider>
                          <ReportProvider>
                            <AdminProvider>
                              <TitleProvider>
                                {children}
                              </TitleProvider>
                            </AdminProvider>
                          </ReportProvider>
                        </NotificationProvider>
                      </MessageProvider>
                    </ConversationProvider>
                  </SessionProvider>
                </InterviewProvider>
              </ApplicationProvider>
            </ResumeProvider>
          </JobProvider>
        </CompanyProvider>
      </ProfileProvider>
    </AuthProvider>
  );
};

export default AppContextProvider;