import { Languages, MessageSquare, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import QuickActions from "../components/QuickActions.jsx";
import RecentChats from "../components/RecentChats.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/dashboard/student").then(({ data }) => setDashboard(data)).catch(() => setDashboard(null));
  }, []);

  const stats = [
    { label: "Total Messages", value: dashboard?.stats?.totalMessages || 0, icon: MessageSquare },
    { label: "Language", value: user?.preferredLanguage || "English", icon: Languages },
    { label: "Last Active", value: dashboard?.stats?.lastActive ? new Date(dashboard.stats.lastActive).toLocaleDateString() : "Today", icon: Timer }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="rounded-3xl bg-blue-600 p-6 text-white shadow-soft">
          <p className="text-sm font-semibold text-blue-100">Student Dashboard</p>
          <h1 className="mt-2 text-3xl font-black">{dashboard?.welcome || `Welcome back, ${user?.name}`}</h1>
          <p className="mt-2 max-w-2xl text-blue-50">Ask questions, review recent helpdesk chats, and keep your language preference updated.</p>
        </section>
        <DashboardStats stats={stats} />
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <QuickActions />
            <RecentChats chats={dashboard?.recentChats || []} />
          </div>
          <ProfileCard user={user} />
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
