import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eef2ff] to-[#f5d0fe]">
      <Sidebar />
      <Header />

      <main className="ml-72 pt-28 px-8 pb-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}