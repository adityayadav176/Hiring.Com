function DashboardLayout({ children }) {
    return (
        <div className="flex h-[100dvh] min-h-0 w-full overflow-hidden">
            {children}
        </div>
    );
}

export default DashboardLayout;