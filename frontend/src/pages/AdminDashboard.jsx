import {
  BarChart3,
  FileText,
  HelpCircle,
  MessageSquare,
  ScrollText,
  Users,
  Workflow
} from "lucide-react";
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import AnalyticsCards from "../components/AnalyticsCards.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import FAQManager from "../components/FAQManager.jsx";
import NoticeManager from "../components/NoticeManager.jsx";
import ScholarshipManager from "../components/ScholarshipManager.jsx";
import UserTable from "../components/UserTable.jsx";
import api from "../services/api.js";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "User Management", icon: Users },
  { id: "scholarships", label: "Scholarships", icon: ScrollText },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "notices", label: "Notices", icon: FileText }
];

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    api
      .get("/dashboard/admin")
      .then(({ data }) => setDashboard(data))
      .catch(() => setDashboard(null));
  }, []);

  useEffect(() => {
    if (activeTab === "users" && users.length === 0) {
      setLoadingUsers(true);
      api
        .get("/admin/users")
        .then(({ data }) => setUsers(data.users || []))
        .catch(() => setUsers([]))
        .finally(() => setLoadingUsers(false));
    }
  }, [activeTab, users.length]);

  const stats = [
    { label: "Total Users", value: dashboard?.stats?.totalUsers ?? "—", icon: Users, colorClass: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "AI Queries", value: dashboard?.stats?.totalQueries ?? "—", icon: MessageSquare, colorClass: "bg-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
    { label: "Conversations", value: dashboard?.stats?.activeConversations ?? "—", icon: Workflow, colorClass: "bg-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: "Notices", value: dashboard?.stats?.noticesCount ?? "—", icon: FileText, colorClass: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <DashboardHeader
          eyebrow="Admin Control Panel"
          title="Campus Helpdesk Overview"
          description="Manage users, FAQs, scholarships, and notices. Monitor AI query volume and platform analytics in real time."
          accent="from-slate-900 via-slate-800 to-slate-950"
        />

        <AnalyticsCards cards={stats} />

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto border-b border-slate-200 dark:border-slate-800">
            <div className="flex min-w-max gap-1 p-2">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  id={`admin-tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    activeTab === id
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Recent Registrations</h2>
                <UserTable users={dashboard?.recentRegistrations || []} />
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">All Users</h2>
                {loadingUsers ? (
                  <div className="py-12 text-center text-slate-400">Loading users...</div>
                ) : (
                  <UserTable users={users} />
                )}
              </div>
            )}

            {activeTab === "scholarships" && (
              <div>
                <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Scholarship Management</h2>
                <ScholarshipManager />
              </div>
            )}

            {activeTab === "faqs" && (
              <div>
                <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">FAQ Management</h2>
                <FAQManager />
              </div>
            )}

            {activeTab === "notices" && (
              <div>
                <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Notice Management</h2>
                <NoticeManager />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
