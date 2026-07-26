import React from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Shield, 
  Zap, 
  LogOut, 
  ShieldAlert, 
  User, 
  Users, 
  LayoutDashboard, 
  AlertOctagon,
  ChevronDown,
  ShieldCheck,
  Activity,
  Lock
} from "lucide-react";
import { RBAC_ROLES, ROLE_PERMISSIONS } from "../services/enterpriseData";

export function Navbar({ onOpenSimulator, activeTab, setActiveTab }) {
  const { currentUser, role, switchRole, logout, alerts, hasPermission } = useAuth();
  const currentRole = role || currentUser?.role || RBAC_ROLES.SUPER_ADMIN;
  const rolePerms = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS[RBAC_ROLES.EMPLOYEE];
  const allowedTabs = rolePerms.allowedTabs || ["dashboard", "my_profile"];

  const unresolvedHighAlerts = alerts.filter(
    (a) => !a.resolved && a.status !== "resolved" && (a.severity === "high" || a.severity === "critical")
  ).length;

  const getDashboardTabLabel = () => {
    switch (currentRole) {
      case RBAC_ROLES.SUPER_ADMIN:
        return "Executive Master Dashboard";
      case RBAC_ROLES.SOC_MANAGER:
        return "SOC Operations Overview";
      case RBAC_ROLES.SOC_ANALYST:
      case RBAC_ROLES.SOC_ANALYST_L1:
      case RBAC_ROLES.SOC_ANALYST_L2:
        return "Auth Monitoring Stream";
      case RBAC_ROLES.INCIDENT_RESPONDER:
        return "Incident Command Center";
      case RBAC_ROLES.SEC_ADMIN:
        return "IAM Portal Dashboard";
      default:
        return "Security Dashboard";
    }
  };

  const getRoleBadgeStyle = (r) => {
    switch (r) {
      case RBAC_ROLES.SUPER_ADMIN:
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";
      case RBAC_ROLES.SEC_ADMIN:
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case RBAC_ROLES.SOC_MANAGER:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case RBAC_ROLES.SOC_ANALYST:
      case RBAC_ROLES.SOC_ANALYST_L1:
      case RBAC_ROLES.SOC_ANALYST_L2:
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case RBAC_ROLES.INCIDENT_RESPONDER:
        return "bg-red-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel rounded-none border-x-0 border-t-0 border-b-white/10 px-6 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Branding & Tabs */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/40 text-white shadow-lg shadow-indigo-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-base tracking-wide">SOC Threat Sentinel</span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  RBAC ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Enterprise Role-Based SOC & Identity Sentinel</p>
            </div>
          </div>

          {/* Navigation Tabs strictly filtered by RBAC allowedTabs */}
          <nav className="hidden lg:flex items-center space-x-1 pl-6 border-l border-white/10">
            {allowedTabs.includes("dashboard") && (
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  activeTab === "dashboard"
                    ? "bg-white/15 text-white border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                <span>{getDashboardTabLabel()}</span>
              </button>
            )}

            {allowedTabs.includes("alerts") && (
              <button
                onClick={() => setActiveTab("alerts")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  activeTab === "alerts"
                    ? "bg-white/15 text-white border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentRole === RBAC_ROLES.INCIDENT_RESPONDER ? "Assigned Incidents" : "Incident Alerts"}</span>
              </button>
            )}

            {allowedTabs.includes("users") && (
              <button
                onClick={() => setActiveTab("users")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  activeTab === "users"
                    ? "bg-white/15 text-white border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentRole === RBAC_ROLES.SEC_ADMIN ? "IAM & User Governance" : "Employee Database"}</span>
              </button>
            )}

            {allowedTabs.includes("my_profile") && (
              <button
                onClick={() => setActiveTab("my_profile")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  activeTab === "my_profile"
                    ? "bg-white/15 text-white border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>My Profile</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Cyber Attack Simulator Button */}
          {hasPermission("canSimulateThreats") && (
            <button
              onClick={onOpenSimulator}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-red-500/40 text-red-200 text-xs font-bold hover:from-red-500/30 hover:to-amber-500/30 transition shadow-lg shadow-red-500/10"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Attack Simulator</span>
            </button>
          )}

          {/* Unresolved High Threat Indicator */}
          {unresolvedHighAlerts > 0 && (
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-bounce" />
              <span>{unresolvedHighAlerts} Threat(s)</span>
            </div>
          )}

          {/* Logged-in User Role Badge & Switcher */}
          <div className="relative flex items-center bg-black/40 border border-white/10 rounded-xl px-2.5 py-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mr-2 ${getRoleBadgeStyle(currentRole)}`}>
              {currentRole}
            </span>
            <select
              value={currentRole}
              onChange={(e) => switchRole(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer pr-1"
              title="Switch RBAC Role Presets for Testing"
            >
              {Object.values(RBAC_ROLES).map((r) => (
                <option key={r} value={r} className="bg-[#0f172a] text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-2 pl-3 border-l border-white/10">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-white leading-tight">
                {currentUser?.name || currentUser?.email || "Alex Mercer"}
              </div>
              <div className="text-[10px] text-indigo-300 font-mono">
                {currentUser?.empId || "EMP-10001"}
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out Session"
              className="p-2 rounded-xl glass-card hover:bg-red-500/20 hover:border-red-500/30 text-slate-300 hover:text-red-300 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
