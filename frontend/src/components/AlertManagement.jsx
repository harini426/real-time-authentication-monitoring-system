import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  UserCheck, 
  MessageSquare, 
  Filter, 
  Search, 
  Clock, 
  Activity,
  Layers,
  ChevronRight
} from "lucide-react";
import { SOC_ANALYSTS } from "../services/enterpriseData";
import { AlertDetailModal } from "./AlertDetailModal";

export function AlertManagement() {
  const { 
    alerts = [], 
    investigateAlert, 
    resolveAlert, 
    ignoreAlert, 
    escalateAlert, 
    assignAnalyst, 
    addInvestigationNote,
    hasPermission 
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  const filteredAlerts = alerts.filter((a) => {
    if (!a) return false;
    const matchesSearch = 
      (a.empId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.name || a.empName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.threatType || a.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.ip || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === "all" || a.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="glass-panel p-6 border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2.5">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <span>Enterprise Alert Management Console</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Investigate, resolve, ignore, escalate, assign analysts, and document notes across real-time threat alerts.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search alert, ID, user, IP..."
              className="glass-input pl-9 pr-3 py-1.5 text-xs w-48"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs bg-[#0f172a] text-white"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs bg-[#0f172a] text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="ignored">Ignored</option>
            <option value="escalated">Escalated</option>
          </select>

        </div>
      </div>

      {/* Alert Queue Table */}
      <div className="glass-panel p-6 border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">Alert ID</th>
                <th className="pb-3">Threat Type</th>
                <th className="pb-3">Severity</th>
                <th className="pb-3">Employee</th>
                <th className="pb-3">IP & Location</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Assigned Analyst</th>
                <th className="pb-3 text-right">SOC Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">
                    No threat alerts match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alt) => (
                  <tr key={alt.id} className="hover:bg-white/5 transition">
                    
                    {/* Alert ID & Time */}
                    <td className="py-3">
                      <span className="text-indigo-300 font-bold block">{alt.id}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(alt.timestamp || alt.time || Date.now()).toLocaleTimeString()}
                      </span>
                    </td>

                    {/* Threat Type */}
                    <td className="py-3 text-white font-bold capitalize">
                      {(alt.threatType || alt.type || "Threat").replace(/_/g, " ")}
                    </td>

                    {/* Severity Badge */}
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alt.severity === "critical" ? "bg-red-600/30 text-red-200 border border-red-600/50" :
                        alt.severity === "high" ? "bg-red-500/20 text-red-300 border border-red-500/40" :
                        alt.severity === "medium" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                        "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      }`}>
                        {alt.severity}
                      </span>
                    </td>

                    {/* Employee Profile */}
                    <td className="py-3">
                      <span className="text-white font-bold block truncate max-w-[130px]">
                        {alt.name || alt.empName || alt.email}
                      </span>
                      <span className="text-[10px] text-indigo-300">{alt.empId || "EMP-10001"}</span>
                    </td>

                    {/* IP & Location */}
                    <td className="py-3">
                      <span className="text-cyan-300 block">{alt.ip || "0.0.0.0"}</span>
                      <span className="text-[10px] text-slate-400">{alt.location || "San Jose, USA"}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alt.status === "resolved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" :
                        alt.status === "investigating" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" :
                        alt.status === "escalated" ? "bg-red-600/30 text-red-300 border border-red-600/50 animate-pulse" :
                        alt.status === "ignored" ? "bg-slate-500/20 text-slate-400 border border-slate-500/40" :
                        "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}>
                        {alt.status || "active"}
                      </span>
                    </td>

                    {/* Assigned Analyst */}
                    <td className="py-3">
                      <select
                        value={alt.assignedAnalyst || "Unassigned"}
                        onChange={(e) => assignAnalyst(alt.id, e.target.value)}
                        className="bg-black/40 border border-white/10 text-xs text-indigo-300 rounded px-2 py-1 focus:outline-none"
                      >
                        {SOC_ANALYSTS.map((an) => (
                          <option key={an} value={an} className="bg-[#0f172a] text-white">
                            {an}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        
                        {/* Investigate */}
                        {alt.status !== "investigating" && alt.status !== "resolved" && (
                          <button
                            onClick={() => investigateAlert(alt.id)}
                            title="Start Investigation"
                            className="p-1.5 rounded glass-card bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-[10px] font-bold"
                          >
                            Investigate
                          </button>
                        )}

                        {/* Resolve */}
                        {alt.status !== "resolved" && (
                          <button
                            onClick={() => resolveAlert(alt.id)}
                            title="Resolve Alert"
                            className="p-1.5 rounded glass-card bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-[10px] font-bold"
                          >
                            Resolve
                          </button>
                        )}

                        {/* Escalate */}
                        {hasPermission("canEscalateAlerts") && alt.status !== "escalated" && (
                          <button
                            onClick={() => escalateAlert(alt.id)}
                            title="Escalate Alert"
                            className="p-1.5 rounded glass-card bg-red-500/10 text-red-300 hover:bg-red-500/20 text-[10px] font-bold"
                          >
                            Escalate
                          </button>
                        )}

                        {/* Ignore */}
                        {alt.status !== "ignored" && alt.status !== "resolved" && (
                          <button
                            onClick={() => ignoreAlert(alt.id)}
                            title="Ignore Alert"
                            className="p-1.5 rounded glass-card bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 text-[10px] font-bold"
                          >
                            Ignore
                          </button>
                        )}

                        {/* Details Modal Trigger */}
                        <button
                          onClick={() => setSelectedAlert(alt)}
                          className="p-1.5 rounded glass-card text-white hover:bg-white/10"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Alert Modal */}
      {selectedAlert && (
        <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}

    </div>
  );
}
