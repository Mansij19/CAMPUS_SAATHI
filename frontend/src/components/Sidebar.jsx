import { FileSearch, LayoutDashboard, Megaphone, MessageCircle, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/dashboard/admin" : "/dashboard/student";
  const links = [
    { to: dashboardPath, label: "Dashboard", icon: LayoutDashboard },
    { to: "/chat", label: "AI Helpdesk", icon: MessageCircle },
    { to: "/forms", label: "Forms", icon: FileSearch },
    { to: "/notices", label: "Notices", icon: Megaphone },
    { to: "/profile", label: "Profile", icon: User }
  ];

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-slate-950/40 lg:hidden ${open ? "block" : "hidden"}`} onClick={onClose} />
      <aside className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 border-r border-slate-200 bg-white p-4 transition-transform dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-16 lg:z-10 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-soft"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
