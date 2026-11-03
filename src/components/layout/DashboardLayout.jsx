function DashboardLayout({ children }) {
    return (
        <div className="flex h-[100vh] min-h-screen w-full flex-col overflow-hidden">
            {children}
        </div>
    );
}

export default DashboardLayout;