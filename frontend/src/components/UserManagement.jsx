import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Users, 
  Lock, 
  Unlock, 
  UserX, 
  UserCheck, 
  Search, 
  Filter, 
  Laptop, 
  MapPin, 
  CheckCircle, 
  AlertTriangle,
  Building2,
  Shield,
  Eye,
  X,
  Clock,
  History,
  ShieldAlert
} from "lucide-react";
import { DEPARTMENTS, RBAC_ROLES } from "../services/enterpriseData";

export function UserManagement() {
  const { 
    usersList = [], 
    loginAttempts = [], 
    alerts = [], 
    lockUser, 
    unlockUser, 
    disableUser, 
    enableUser, 
    updateEmployeeRole,
    hasPermission 
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Selected Employee for Details & History Modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("details"); // "details" | "loginHistory" | "threatHistory"

  const filteredEmployees = usersList.filter((usr) => {
    if (!usr) return false;
    const matchesSearch = 
      (usr.empId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.designation || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.department || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === "all" || usr.department === departmentFilter;
    const matchesRole = roleFilter === "all" || usr.role === roleFilter;
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "Active" && !usr.locked && !usr.disabled) ||
      (statusFilter === "Locked" && usr.locked) ||
      (statusFilter === "Disabled" && usr.disabled);

    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner & Filters */}
      <div className="glass-panel p-6 border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Enterprise Employee Database & Identity Governance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, inspect login & threat histories, lock/unlock, and manage RBAC roles for enterprise employees.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Name, ID, Email..."
              className="glass-input pl-9 pr-3 py-1.5 text-xs w-48"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs bg-[#111827] text-white cursor-pointer relative z-20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 border border-white/15"
          >
            <option value="all" className="bg-[#111827] text-white">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} className="bg-[#111827] text-white">{d}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs bg-[#111827] text-white cursor-pointer relative z-20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 border border-white/15"
          >
            <option value="all" className="bg-[#111827] text-white">All Statuses</option>
            <option value="Active" className="bg-[#111827] text-white">Active</option>
            <option value="Locked" className="bg-[#111827] text-white">Locked</option>
            <option value="Disabled" className="bg-[#111827] text-white">Disabled</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs bg-[#111827] text-white cursor-pointer relative z-20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 border border-white/15"
          >
            <option value="all" className="bg-[#111827] text-white">All Roles</option>
            {Object.values(RBAC_ROLES).map((r) => (
              <option key={r} value={r} className="bg-[#111827] text-white">{r}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((usr) => {
          const isLocked = usr.locked || usr.accountStatus === "Locked";
          const isDisabled = usr.disabled || usr.accountStatus === "Disabled";

          return (
            <div
              key={usr.id || usr.empId || usr.email}
              className={`glass-card p-5 border flex flex-col justify-between transition ${
                isDisabled
                  ? "border-red-600/50 bg-red-900/10"
                  : isLocked
                  ? "border-red-500/40 bg-red-500/5 glow-severity-high"
                  : "border-white/10"
              }`}
            >
              <div>
                {/* Employee Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-300 font-mono">{usr.empId || "EMP-10001"}</span>
                    <h3 className="font-bold text-white text-base leading-tight">{usr.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{usr.email}</p>
                  </div>

                  {isDisabled ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/30 text-red-300 border border-red-600/50">
                      DISABLED
                    </span>
                  ) : isLocked ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> ACTIVE
                    </span>
                  )}
                </div>

                {/* Designation, Dept & Role */}
                <div className="text-xs space-y-1 mb-3 pt-2 border-t border-white/5">
                  <div className="text-slate-300 font-medium">{usr.designation || "SOC Specialist"}</div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-cyan-400" />
                    <span>{usr.department || "Cybersecurity / SOC"}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Role:</span>
                    {hasPermission("canEditRoles") ? (
                      <select
                        value={usr.role || RBAC_ROLES.EMPLOYEE}
                        onChange={(e) => updateEmployeeRole(usr.id || usr.empId || usr.email, e.target.value)}
                        className="bg-black/50 border border-white/10 text-[10px] text-indigo-300 font-bold rounded px-1.5 py-0.5"
                      >
                        {Object.values(RBAC_ROLES).map((r) => (
                          <option key={r} value={r} className="bg-[#0f172a] text-white">
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-indigo-300 font-bold">{usr.role || RBAC_ROLES.EMPLOYEE}</span>
                    )}
                  </div>
                </div>

                {/* Location & Devices */}
                <div className="text-[10px] text-slate-400 space-y-1 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Office: {usr.officeLocation || "San Jose, USA"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Laptop className="w-3 h-3 text-cyan-400" />
                    <span>Devices: {(usr.assignedDevices || []).length} assigned</span>
                  </div>
                </div>
              </div>

              {/* Administrative Action Controls */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                
                <button
                  onClick={() => {
                    setSelectedEmployee(usr);
                    setActiveModalTab("details");
                  }}
                  className="w-full py-1.5 px-3 rounded-lg glass-card bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 text-xs font-semibold flex items-center justify-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Profile & History</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  
                  {/* Lock / Unlock */}
                  {isLocked ? (
                    hasPermission("canUnlockUsers") && (
                      <button
                        onClick={() => unlockUser(usr.id || usr.empId || usr.email)}
                        className="py-1 px-2 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold flex items-center justify-center space-x-1"
                      >
                        <Unlock className="w-3 h-3" />
                        <span>Unlock</span>
                      </button>
                    )
                  ) : (
                    hasPermission("canLockUsers") && (
                      <button
                        onClick={() => lockUser(usr.id || usr.empId || usr.email, "Administrative Manual Lockout")}
                        className="py-1 px-2 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 text-[10px] font-bold flex items-center justify-center space-x-1"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Lock</span>
                      </button>
                    )
                  )}

                  {/* Disable / Enable */}
                  {isDisabled ? (
                    (hasPermission("canDisableUsers") || hasPermission("canEnableDisableAccounts")) && (
                      <button
                        onClick={() => enableUser(usr.id || usr.empId || usr.email)}
                        className="py-1 px-2 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold flex items-center justify-center space-x-1"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>Enable</span>
                      </button>
                    )
                  ) : (
                    (hasPermission("canDisableUsers") || hasPermission("canEnableDisableAccounts")) && (
                      <button
                        onClick={() => disableUser(usr.id || usr.empId || usr.email, "HR Deactivation Policy")}
                        className="py-1 px-2 rounded bg-red-600/30 text-red-200 hover:bg-red-600/40 text-[10px] font-bold flex items-center justify-center space-x-1"
                      >
                        <UserX className="w-3 h-3" />
                        <span>Disable</span>
                      </button>
                    )
                  )}

                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Employee Profile & History Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-3xl glass-panel p-6 border-white/20 relative shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedEmployee(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg glass-card transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-300 font-mono">{selectedEmployee.empId}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white capitalize">
                    {selectedEmployee.role}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedEmployee.name}</h2>
                <p className="text-xs text-slate-400">{selectedEmployee.email}</p>
              </div>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex items-center space-x-2 border-b border-white/10 mb-4 pb-2 text-xs">
              <button
                onClick={() => setActiveModalTab("details")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeModalTab === "details" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Employee Profile Details
              </button>
              <button
                onClick={() => setActiveModalTab("loginHistory")}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition ${
                  activeModalTab === "loginHistory" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>Login History ({loginAttempts.filter((a) => a.email === selectedEmployee.email || a.empId === selectedEmployee.empId).length})</span>
              </button>
              <button
                onClick={() => setActiveModalTab("threatHistory")}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition ${
                  activeModalTab === "threatHistory" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Threat History ({alerts.filter((a) => a.email === selectedEmployee.email || a.empId === selectedEmployee.empId).length})</span>
              </button>
            </div>

            {/* Tab 1: Profile Details */}
            {activeModalTab === "details" && (
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl glass-card bg-black/30">
                  <div><span className="text-slate-500">Department:</span> <span className="text-white">{selectedEmployee.department}</span></div>
                  <div><span className="text-slate-500">Designation:</span> <span className="text-white">{selectedEmployee.designation}</span></div>
                  <div><span className="text-slate-500">Team:</span> <span className="text-white">{selectedEmployee.team || "Threat Operations"}</span></div>
                  <div><span className="text-slate-500">Manager:</span> <span className="text-indigo-300">{selectedEmployee.manager || "Sarah Jenkins"}</span></div>
                  <div><span className="text-slate-500">Office Location:</span> <span className="text-white">{selectedEmployee.officeLocation}</span></div>
                  <div><span className="text-slate-500">Account Status:</span> <span className="text-emerald-400 font-bold">{selectedEmployee.accountStatus || "Active"}</span></div>
                  <div><span className="text-slate-500">Created Date:</span> <span className="text-slate-300">{new Date(selectedEmployee.createdAt || Date.now()).toLocaleDateString()}</span></div>
                  <div><span className="text-slate-500">Last Login:</span> <span className="text-slate-300">{selectedEmployee.lastLogin ? new Date(selectedEmployee.lastLogin).toLocaleString() : 'N/A'}</span></div>
                </div>

                <div className="p-4 rounded-xl glass-card bg-black/20">
                  <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-cyan-400" /> Assigned Corporate Devices
                  </div>
                  <div className="space-y-1">
                    {(selectedEmployee.assignedDevices || []).map((dev, i) => (
                      <div key={i} className="p-2 rounded bg-black/40 text-slate-300 font-mono text-[11px]">
                        {dev}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Login History */}
            {activeModalTab === "loginHistory" && (
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase">
                      <th className="pb-2">Timestamp</th>
                      <th className="pb-2">IP</th>
                      <th className="pb-2">Location</th>
                      <th className="pb-2">Device</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[11px]">
                    {loginAttempts
                      .filter((a) => a.email === selectedEmployee.email || a.empId === selectedEmployee.empId)
                      .map((att) => (
                        <tr key={att.id} className="hover:bg-white/5">
                          <td className="py-2 text-slate-400">{new Date(att.timestamp || att.loginTime).toLocaleString()}</td>
                          <td className="py-2 text-cyan-300">{att.ip}</td>
                          <td className="py-2 text-slate-300">{att.city || ''}, {att.country || ''}</td>
                          <td className="py-2 text-slate-400 truncate max-w-[120px]">{att.device}</td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              att.status === "success" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                            }`}>
                              {att.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: Threat History */}
            {activeModalTab === "threatHistory" && (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
                {alerts
                  .filter((a) => a.email === selectedEmployee.email || a.empId === selectedEmployee.empId)
                  .map((alt) => (
                    <div key={alt.id} className="p-3 rounded-xl glass-card bg-red-500/10 border-red-500/30 space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>{alt.title || alt.threatType}</span>
                        <span className="text-red-400 uppercase text-[10px] font-mono">{alt.severity}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{alt.details?.reason || 'Threat detected'}</p>
                      <div className="text-[10px] text-slate-500 font-mono">{new Date(alt.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
