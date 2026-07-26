import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Unlock, 
  X, 
  MapPin, 
  Laptop, 
  Clock, 
  Activity, 
  Compass,
  UserCheck,
  MessageSquare,
  Send,
  AlertOctagon,
  XCircle
} from "lucide-react";
import { SOC_ANALYSTS } from "../services/enterpriseData";

export function AlertDetailModal({ alert, onClose }) {
  const { 
    resolveAlert, 
    investigateAlert,
    ignoreAlert,
    escalateAlert,
    assignAnalyst,
    addInvestigationNote,
    lockUser,
    unlockUser, 
    usersList,
    hasPermission 
  } = useAuth();

  const [noteText, setNoteText] = useState("");

  if (!alert) return null;

  const targetUser = usersList.find((u) => u.email === alert.email || u.id === alert.userId || u.empId === alert.empId);
  const isLocked = targetUser ? targetUser.locked || targetUser.accountStatus === "Locked" : false;

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case "critical":
        return "glow-severity-high text-red-100 border-red-600/50 bg-red-600/20";
      case "high":
        return "glow-severity-high text-red-200 border-red-500/40 bg-red-500/10";
      case "medium":
        return "glow-severity-medium text-amber-200 border-amber-500/40 bg-amber-500/10";
      default:
        return "glow-severity-low text-cyan-200 border-cyan-500/40 bg-cyan-500/10";
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addInvestigationNote(alert.id, noteText);
    setNoteText("");
  };

  const handleToggleLock = () => {
    const targetId = targetUser?.id || targetUser?.empId || alert.empId || alert.email;
    if (isLocked) {
      unlockUser(targetId);
    } else {
      lockUser(targetId, `Locked via alert diagnostics modal (${alert.threatType || alert.type})`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-3xl glass-panel p-6 border-white/20 relative shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg glass-card transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className={`p-3 rounded-2xl border ${getSeverityStyle(alert.severity)}`}>
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                alert.severity === "critical" ? "bg-red-600/30 text-red-200 border border-red-600/50" :
                alert.severity === "high" ? "bg-red-500/20 text-red-300 border border-red-500/40" :
                alert.severity === "medium" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              }`}>
                {alert.severity} SEVERITY
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                STATUS: {alert.status || "active"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {alert.title || (alert.threatType || alert.type || "Threat").replace(/_/g, " ").toUpperCase()}
            </h2>
            <p className="text-xs text-slate-400">Target Employee: <span className="text-indigo-300 font-bold">{alert.name || alert.empName || alert.email} ({alert.empId || "EMP-10001"})</span></p>
          </div>
        </div>

        {/* Threat Diagnostics Grid */}
        <div className="space-y-4 mb-6">
          
          {/* Reason Card */}
          <div className="p-4 rounded-xl glass-card bg-white/5 border-white/10">
            <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Automated Threat Rule Analysis</span>
            </div>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {alert.details?.reason || "Anomaly triggered by real-time threat detection rule engine."}
            </p>
          </div>

          {/* Specific Diagnostics per Threat Type */}
          {(alert.threatType === "impossible_travel" || alert.type === "impossible_travel") && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl glass-card bg-black/20 text-center">
                <div className="text-[10px] text-slate-400 font-medium uppercase">Implied Velocity</div>
                <div className="text-lg font-bold text-red-400 font-mono mt-0.5">
                  {alert.details?.impliedSpeedKmh?.toLocaleString() || "49,620"} <span className="text-xs text-slate-300">km/h</span>
                </div>
                <div className="text-[10px] text-slate-500">&gt; 800 km/h threshold</div>
              </div>
              <div className="p-3 rounded-xl glass-card bg-black/20 text-center">
                <div className="text-[10px] text-slate-400 font-medium uppercase">Geodesic Distance</div>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                  {alert.details?.distanceKm?.toLocaleString() || "8,270"} <span className="text-xs text-slate-300">km</span>
                </div>
                <div className="text-[10px] text-slate-500">Haversine geodesics</div>
              </div>
              <div className="p-3 rounded-xl glass-card bg-black/20 text-center">
                <div className="text-[10px] text-slate-400 font-medium uppercase">Time Elapsed</div>
                <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                  {alert.details?.timeDiffMinutes || 10} <span className="text-xs text-slate-300">mins</span>
                </div>
                <div className="text-[10px] text-slate-500">Between logins</div>
              </div>
            </div>
          )}

          {/* Telemetry Metadata Table */}
          <div className="p-4 rounded-xl glass-card bg-black/30 text-xs space-y-2 font-mono">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-500">Alert ID:</span>
              <span className="text-slate-300">{alert.id}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-500">Employee ID / Email:</span>
              <span className="text-indigo-300">{alert.empId || "EMP-10001"} ({alert.email})</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-500">Timestamp:</span>
              <span className="text-slate-300">{new Date(alert.timestamp || alert.time || Date.now()).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-500">Public IP Address:</span>
              <span className="text-cyan-300">{alert.ip || "198.51.100.42"}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-500">Location Origin:</span>
              <span className="text-slate-300">{alert.location || "San Jose, United States"}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-500">Device Signature:</span>
              <span className="text-slate-300 truncate max-w-xs">{alert.device || alert.details?.device || "Chrome Enterprise"}</span>
            </div>
          </div>

          {/* Assigned Analyst Selector */}
          <div className="flex items-center justify-between p-3 rounded-xl glass-card bg-indigo-500/10 border-indigo-500/30 text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-400" /> Assigned SOC Analyst:
            </span>
            <select
              value={alert.assignedAnalyst || "Unassigned"}
              onChange={(e) => assignAnalyst(alert.id, e.target.value)}
              className="bg-black/50 border border-white/10 text-xs text-indigo-200 rounded px-3 py-1 font-semibold focus:outline-none"
            >
              {SOC_ANALYSTS.map((an) => (
                <option key={an} value={an} className="bg-[#0f172a] text-white">
                  {an}
                </option>
              ))}
            </select>
          </div>

          {/* Investigation Notes Log */}
          <div className="p-4 rounded-xl glass-card bg-black/20 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Analyst Investigation Notes ({(alert.investigationNotes || []).length})</span>
            </h4>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add investigation observation or forensics notes..."
                className="glass-input flex-1 px-3 py-1.5 text-xs"
              />
              <button
                type="submit"
                className="glass-button-primary px-3 py-1.5 text-xs flex items-center space-x-1"
              >
                <Send className="w-3 h-3" />
                <span>Add Note</span>
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
              {(alert.investigationNotes || []).length === 0 ? (
                <div className="text-[11px] text-slate-500 italic">No notes logged yet.</div>
              ) : (
                (alert.investigationNotes || []).map((note) => (
                  <div key={note.id || note.timestamp} className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
                    <div className="flex justify-between text-[10px] text-indigo-300 font-semibold">
                      <span>{note.author}</span>
                      <span className="text-slate-500">{new Date(note.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-200 text-[11px]">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Action Controls Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          
          {/* Account Lock Toggle */}
          <button
            onClick={handleToggleLock}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
              isLocked
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                : "bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30"
            }`}
          >
            {isLocked ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlock Account Access</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Lock Account Access</span>
              </>
            )}
          </button>

          {/* Workflow Status Actions */}
          <div className="flex items-center space-x-2">
            {alert.status !== "investigating" && (
              <button
                onClick={() => investigateAlert(alert.id)}
                className="px-3 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-xs font-semibold"
              >
                Investigate
              </button>
            )}

            {hasPermission("canEscalateAlerts") && alert.status !== "escalated" && (
              <button
                onClick={() => escalateAlert(alert.id)}
                className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 text-xs font-semibold"
              >
                Escalate
              </button>
            )}

            {alert.status !== "ignored" && (
              <button
                onClick={() => ignoreAlert(alert.id)}
                className="px-3 py-2 rounded-xl bg-slate-500/20 border border-slate-500/40 text-slate-300 hover:bg-slate-500/30 text-xs font-semibold"
              >
                Ignore
              </button>
            )}

            {alert.status !== "resolved" && (
              <button
                onClick={() => resolveAlert(alert.id)}
                className="glass-button-primary px-4 py-2 text-xs flex items-center space-x-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Resolve Alert</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
