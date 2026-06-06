import { MessageSquare, Users, Workflow } from "lucide-react";
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import api from "../services/api.js";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/dashboard/admin").then(({ data }) => setDashboard(data)).catch(() => setDashboard(null));
  }, []);

  const stats = [
    { label: "Total Users", value: dashboard?.stats?.totalUsers || 0, icon: Users },
    { label: "AI Queries", value: dashboard?.stats?.totalQueries || 0, icon: MessageSquare },
    { label: "Conversations", value: dashboard?.stats?.activeConversations || 0, icon: Workflow }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-soft dark:bg-blue-600">
          <p className="text-sm font-semibold text-blue-200">Admin Dashboard</p>
          <h1 className="mt-2 text-3xl font-black">Campus helpdesk overview</h1>
          <p className="mt-2 max-w-2xl text-slate-300 dark:text-blue-50">Track users, registrations, and AI query volume from one focused control surface.</p>
        </section>
        <DashboardStats stats={stats} />
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h2 className="text-lg font-bold">User Management</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Recent registrations</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Language</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard?.users || []).map((member) => (
                  <tr key={member._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-5 py-4 font-semibold">{member.name}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{member.email}</td>
                    <td className="px-5 py-4">{member.role}</td>
                    <td className="px-5 py-4">{member.preferredLanguage}</td>
                    <td className="px-5 py-4">{new Date(member.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
