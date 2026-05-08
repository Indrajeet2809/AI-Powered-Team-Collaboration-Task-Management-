import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="ml-72 pt-24 p-8">
        {children}
      </main>
    </div>
  );
}