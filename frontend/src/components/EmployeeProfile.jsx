import React from "react";
import { useAuth } from "../context/AuthContext";
import { 
  User, 
  Building2, 
  Briefcase, 
  MapPin, 
  Laptop, 
  ShieldCheck, 
  History, 
  ShieldAlert, 
  Lock, 
  CheckCircle,
  Clock
} from "lucide-react";

export function EmployeeProfile() {
  const { currentUser, loginAttempts = [], alerts = [], activeSessions = [] } = useAuth();

  if (!currentUser) return null;

  const myLoginAttempts = loginAttempts.filter(
    (a) => a && (a.email?.toLowerCase() === currentUser.email?.toLowerCase() || a.empId === currentUser.empId)
  );

  const myAlerts = alerts.filter(
    (a) => a && (a.email?.toLowerCase() === currentUser.email?.toLowerCase() || a.empId === currentUser.empId)
  );

  const myActiveSessions = activeSessions.filter(
    (s) => s && (s.email?.toLowerCase() === currentUser.email?.toLowerCase() || s.empId === currentUser.empId)
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/40 text-white shadow-lg">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-indigo-300 font-mono">{currentUser.empId || "EMP-10001"}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {currentUser.accountStatus || "ACTIVE"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">{currentUser.name || currentUser.email}</h2>
            <p className="text-xs text-slate-400">{currentUser.designation || "Enterprise Staff"} • {currentUser.department || "Cybersecurity / SOC"}</p>
          </div>
        </div>

        <div className="text-right text-xs space-y-1">
          <div className="text-slate-400">Assigned Role: <span className="text-white font-bold capitalize">{currentUser.role}</span></div>
          <div className="text-slate-400">Manager: <span className="text-indigo-300">{currentUser.manager || "Sarah Jenkins"}</span></div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Personal Security Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Identity & Location Card */}
          <div className="glass-panel p-5 border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Identity & Geolocation Details</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded glass-card bg-black/20">
                <span className="text-slate-500">Corporate Email:</span>
                <span className="text-white">{currentUser.email}</span>
              </div>
              <div className="flex justify-between p-2 rounded glass-card bg-black/20">
                <span className="text-slate-500">Office Location:</span>
                <span className="text-cyan-300">{currentUser.officeLocation || "San Jose, USA"}</span>
              </div>
              <div className="flex justify-between p-2 rounded glass-card bg-black/20">
                <span className="text-slate-500">Team / Business Unit:</span>
                <span className="text-white">{currentUser.team || "Core Engineering"}</span>
              </div>
              <div className="flex justify-between p-2 rounded glass-card bg-black/20">
                <span className="text-slate-500">Account Enrolled:</span>
                <span className="text-slate-300">{new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Trusted Devices Card */}
          <div className="glass-panel p-5 border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-cyan-400" />
              <span>Trusted Corporate Devices ({(currentUser.assignedDevices || []).length})</span>
            </h3>
            <div className="space-y-1.5">
              {(currentUser.assignedDevices || []).map((dev, i) => (
                <div key={i} className="p-2.5 rounded-xl glass-card bg-black/30 text-xs font-mono text-slate-300">
                  {dev}
                </div>
              ))}
            </div>
          </div>

          {/* Personal Active Sessions */}
          <div className="glass-panel p-5 border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>My Active Sessions ({myActiveSessions.length})</span>
            </h3>
            <div className="space-y-2">
              {myActiveSessions.length === 0 ? (
                <div className="text-xs text-slate-400 italic">No other active sessions.</div>
              ) : (
                myActiveSessions.map((s) => (
                  <div key={s.sessionId} className="p-2.5 rounded-xl glass-card bg-indigo-500/10 border-indigo-500/30 text-xs font-mono">
                    <div className="flex justify-between text-indigo-300 font-bold">
                      <span>IP: {s.ip}</span>
                      <span>{s.location}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 truncate">{s.device}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Personal History Logs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Personal Login History Log */}
          <div className="glass-panel p-5 border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-indigo-400" />
              <span>My Authentication History ({myLoginAttempts.length} events)</span>
            </h3>

            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">IP Address</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Device</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[11px]">
                  {myLoginAttempts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-slate-500">No login history recorded yet.</td>
                    </tr>
                  ) : (
                    myLoginAttempts.map((att) => (
                      <tr key={att.id} className="hover:bg-white/5">
                        <td className="py-2 text-slate-400">{new Date(att.timestamp || att.loginTime).toLocaleString()}</td>
                        <td className="py-2 text-indigo-300">{att.ip}</td>
                        <td className="py-2 text-slate-300">{att.city || ''}, {att.country || ''}</td>
                        <td className="py-2 text-slate-400 truncate max-w-[130px]">{att.device}</td>
                        <td className="py-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            att.status === "success" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                          }`}>
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Personal Threat Alerts Log */}
          <div className="glass-panel p-5 border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>My Security Anomaly Alerts ({myAlerts.length})</span>
            </h3>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {myAlerts.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs glass-card">
                  No security alerts triggered for your account. Clean record!
                </div>
              ) : (
                myAlerts.map((alt) => (
                  <div key={alt.id} className="p-3.5 rounded-xl glass-card bg-red-500/10 border-red-500/30 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-xs">{alt.title || alt.threatType}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                        {alt.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{alt.details?.reason}</p>
                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                      Triggered: {new Date(alt.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
