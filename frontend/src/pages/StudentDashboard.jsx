import {
  Bell,
  Bot,
  Calendar,
  FileText,
  Globe,
  MessageSquare,
  Timer,
  TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import ChatWidget from "../components/ChatWidget.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import DeadlineCard from "../components/DeadlineCard.jsx";
import NotificationsPanel from "../components/NotificationsPanel.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import QuickActions from "../components/QuickActions.jsx";
import RecentActivity from "../components/RecentActivity.jsx";
import ScholarshipCard from "../components/ScholarshipCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, actRes] = await Promise.all([
          api.get("/dashboard/student"),
          api.get("/student/activity")
        ]);
        setDashboard(dashRes.data);
        setActivity(actRes.data.activities || []);
      } catch (error) {
        console.warn("Failed to load student dashboard:", error.message);
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    {
      label: "AI Messages",
      value: dashboard?.stats?.totalMessages ?? 0,
      icon: MessageSquare,
      color: "bg-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/40"
    },
    {
      label: "Documents",
      value: dashboard?.stats?.uploadedDocuments ?? 0,
      icon: FileText,
      color: "bg-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/40"
    },
    {
      label: "Scholarships",
      value: dashboard?.stats?.activeScholarships ?? 0,
      icon: TrendingUp,
      color: "bg-green-500",
      bg: "bg-green-50 dark:bg-green-950/40"
    },
    {
      label: "Notifications",
      value: dashboard?.stats?.unreadNotifications ?? 0,
      icon: Bell,
      color: "bg-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/40"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <DashboardHeader
          eyebrow="Student Portal"
          title={dashboard?.welcome || `Welcome back, ${user?.name?.split(" ")[0]}!`}
          description="Your personalized campus helpdesk. Ask questions, track scholarships, and manage documents all in one place."
          actions={[
            { to: "/chat", label: "Ask AI Assistant", icon: Bot },
            { to: "/forms", label: "Upload Form", icon: FileText, variant: "outline" }
          ]}
          meta={[
            { label: user?.preferredLanguage || "English", icon: Globe },
            {
              label: dashboard?.stats?.lastActive ? new Date(dashboard.stats.lastActive).toLocaleDateString() : "Today",
              icon: Timer
            }
          ]}
        />

        {!loading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className={`flex items-center gap-4 rounded-2xl border border-slate-200/60 ${bg} p-4 shadow-sm dark:border-slate-700/50`}
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${color} text-white shadow`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <QuickActions />

            {dashboard?.scholarshipRecommendations?.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Scholarship Opportunities</h2>
                  <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                    {dashboard.scholarshipRecommendations.length} available
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {dashboard.scholarshipRecommendations.map((scholarship) => (
                    <ScholarshipCard key={scholarship._id || scholarship.id} scholarship={scholarship} />
                  ))}
                </div>
              </section>
            )}

            {dashboard?.upcomingDeadlines?.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h2>
                  <Calendar size={18} className="text-slate-400" />
                </div>
                <div className="space-y-3">
                  {dashboard.upcomingDeadlines.map((deadline, index) => (
                    <DeadlineCard key={deadline.id || index} deadline={deadline} />
                  ))}
                </div>
              </section>
            )}

            <RecentActivity activities={activity} />
          </div>

          <div className="space-y-6">
            <ProfileCard user={user} />

            <NotificationsPanel
              notifications={dashboard?.notifications || []}
              onMarkRead={async (id) => {
                await api.patch(`/notifications/${id}/read`);
                setDashboard((current) => {
                  if (!current?.notifications) return current;
                  return {
                    ...current,
                    notifications: current.notifications.map((notification) =>
                      (notification._id || notification.id) === id
                        ? { ...notification, status: "read" }
                        : notification
                    )
                  };
                });
              }}
              title="Recent Notifications"
            />

            {dashboard?.recentChats?.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Recent Chat History</h3>
                <div className="space-y-2">
                  {dashboard.recentChats.map((msg, index) => (
                    <div
                      key={index}
                      className={`rounded-xl px-3 py-2 text-sm ${
                        msg.role === "user"
                          ? "ml-4 bg-blue-50 text-slate-800 dark:bg-blue-950/40 dark:text-slate-200"
                          : "mr-4 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <span className="mr-1 text-xs font-bold uppercase text-slate-400">
                        {msg.role === "user" ? "You" : "AI"}:
                      </span>
                      {typeof msg.content === "string"
                        ? `${msg.content.slice(0, 80)}${msg.content.length > 80 ? "..." : ""}`
                        : ""}
                    </div>
                  ))}
                </div>
                <a
                  href="/chat"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400"
                >
                  <MessageSquare size={15} /> Continue in Chat
                </a>
              </div>
            )}

            {dashboard?.uploadedDocuments?.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Uploaded Documents</h3>
                <div className="space-y-2">
                  {dashboard.uploadedDocuments.map((doc, index) => (
                    <div key={doc._id || doc.id || index} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                      <FileText size={16} className="flex-shrink-0 text-purple-500" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                          {doc.originalname || doc.filename || `Document ${index + 1}`}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(doc.createdAt || doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatWidget />
    </AppLayout>
  );
};

export default StudentDashboard;
