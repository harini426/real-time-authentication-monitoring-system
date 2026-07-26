import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldAlert, 
  Activity, 
  UserX, 
  Globe, 
  AlertTriangle, 
  Users, 
  Shield, 
  Flame, 
  TrendingUp,
  Server,
  Lock,
  Laptop,
  Clock,
  LogOut,
  MapPin,
  CheckCircle,
  BarChart3,
  PieChart as PieIcon,
  Layers,
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import { LocationMap } from "./LocationMap";
import { AlertDetailModal } from "./AlertDetailModal";

export function Dashboard() {
  const { 
    loginAttempts = [], 
    alerts = [], 
    usersList = [], 
    activeSessions = [], 
    resolveAlert, 
    terminateSession 
  } = useAuth();
  
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [severityFilter, setSeverityFilter] = useState("all");

  // -------------------------------------------------------------
  // 14 METRIC CARDS CALCULATIONS
  // -------------------------------------------------------------
  const totalEmployees = usersList.length;
  const totalLogins = loginAttempts.length;
  const failedLogins = loginAttempts.filter((a) => a && a.status === "failed").length;
  const activeSessionsCount = activeSessions.length;
  const onlineEmployeesCount = new Set(activeSessions.map((s) => s.email)).size;
  const offlineEmployeesCount = Math.max(0, totalEmployees - onlineEmployeesCount);
  const lockedAccountsCount = usersList.filter((u) => u && (u.locked || u.accountStatus === "Locked")).length;
  const disabledAccountsCount = usersList.filter((u) => u && (u.disabled || u.accountStatus === "Disabled")).length;
  
  const activeThreatsCount = alerts.filter((a) => a && !a.resolved && a.status !== "resolved").length;
  const criticalAlertsCount = alerts.filter((a) => a && a.severity === "critical").length;
  const highAlertsCount = alerts.filter((a) => a && a.severity === "high").length;
  const mediumAlertsCount = alerts.filter((a) => a && a.severity === "medium").length;
  const lowAlertsCount = alerts.filter((a) => a && a.severity === "low").length;

  const uniqueCountriesSet = new Set(
    loginAttempts.map((a) => a?.country || (typeof a?.location === "object" ? a.location?.country : null)).filter(Boolean)
  );
  const uniqueCountriesCount = uniqueCountriesSet.size || 1;

  // -------------------------------------------------------------
  // RECHARTS PREPARATION DATA
  // -------------------------------------------------------------
  
  // 1. Login Activity Timeline
  const attemptsByHour = {};
  loginAttempts.slice().reverse().forEach((att) => {
    if (!att) return;
    const time = new Date(att.timestamp || att.loginTime || Date.now());
    const hourLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!attemptsByHour[hourLabel]) {
      attemptsByHour[hourLabel] = { time: hourLabel, success: 0, failed: 0 };
    }
    if (att.status === "success") attemptsByHour[hourLabel].success += 1;
    else attemptsByHour[hourLabel].failed += 1;
  });
  const loginTimelineData = Object.values(attemptsByHour).slice(-12);

  // 2. Threat Severity Chart Data
  const severityChartData = [
    { name: "Critical", count: criticalAlertsCount, color: "#dc2626" },
    { name: "High", count: highAlertsCount, color: "#ef4444" },
    { name: "Medium", count: mediumAlertsCount, color: "#f59e0b" },
    { name: "Low", count: lowAlertsCount, color: "#06b6d4" }
  ];

  // 3. Login Success vs Failure Donut Chart Data
  const successVsFailureData = [
    { name: "Success", value: totalLogins - failedLogins, color: "#6366f1" },
    { name: "Failed", value: failedLogins, color: "#ef4444" }
  ];

  // 4. Failed Login Trend
  const failedTrendData = loginTimelineData.map((d) => ({ time: d.time, failed: d.failed }));

  // 5. Top Attack Countries
  const countryCounts = {};
  loginAttempts.forEach((a) => {
    const c = a?.country || "United States";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });
  const topCountriesData = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 6. Top Cities
  const cityCounts = {};
  loginAttempts.forEach((a) => {
    const c = a?.city || "San Jose";
    cityCounts[c] = (cityCounts[c] || 0) + 1;
  });
  const topCitiesData = Object.entries(cityCounts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 7. Top Browsers
  const browserCounts = {};
  loginAttempts.forEach((a) => {
    const b = (a?.browser || "Chrome Enterprise").split(" ")[0];
    browserCounts[b] = (browserCounts[b] || 0) + 1;
  });
  const topBrowsersData = Object.entries(browserCounts)
    .map(([browser, count]) => ({ browser, count }))
    .sort((a, b) => b.count - a.count);

  // 8. Top Devices
  const deviceCounts = {};
  loginAttempts.forEach((a) => {
    const d = a?.os || "Windows 11 Enterprise";
    deviceCounts[d] = (deviceCounts[d] || 0) + 1;
  });
  const topDevicesData = Object.entries(deviceCounts)
    .map(([os, count]) => ({ os, count }))
    .sort((a, b) => b.count - a.count);

  // Filtered Alerts Feed
  const filteredAlerts = alerts.filter((a) => {
    if (!a) return false;
    if (severityFilter === "all") return true;
    return a.severity === severityFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. 14 METRIC CARDS GRID */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        
        {/* Total Employees */}
        <div className="glass-card p-3 border-white/10 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Workforce</div>
          <div className="text-xl font-bold text-white mt-1 font-mono">{totalEmployees}</div>
          <div className="text-[9px] text-indigo-400 mt-1 flex items-center gap-1">
            <Users className="w-3 h-3" /> Enrolled
          </div>
        </div>

        {/* Total Logins */}
        <div className="glass-card p-3 border-white/10 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Logins</div>
          <div className="text-xl font-bold text-white mt-1 font-mono">{totalLogins}</div>
          <div className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Firestore Stream
          </div>
        </div>

        {/* Failed Logins */}
        <div className="glass-card p-3 border-white/10 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Failed Logins</div>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{failedLogins}</div>
          <div className="text-[9px] text-amber-300 mt-1 font-semibold">
            {totalLogins > 0 ? `${Math.round((failedLogins / totalLogins) * 100)}% Failed` : '0%'}
          </div>
        </div>

        {/* Active Sessions */}
        <div className="glass-card p-3 border-indigo-500/30 bg-indigo-500/5 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Active Sessions</div>
          <div className="text-xl font-bold text-indigo-400 mt-1 font-mono">{activeSessionsCount}</div>
          <div className="text-[9px] text-indigo-300 mt-1">Live Tokens</div>
        </div>

        {/* Online Employees */}
        <div className="glass-card p-3 border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Online Workforce</div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{onlineEmployeesCount}</div>
          <div className="text-[9px] text-emerald-300 mt-1">Authenticated Now</div>
        </div>

        {/* Offline Employees */}
        <div className="glass-card p-3 border-white/10 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offline Workforce</div>
          <div className="text-xl font-bold text-slate-300 mt-1 font-mono">{offlineEmployeesCount}</div>
          <div className="text-[9px] text-slate-400 mt-1">No Active Session</div>
        </div>

        {/* Locked Accounts */}
        <div className="glass-card p-3 border-purple-500/30 bg-purple-500/5 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Locked Accounts</div>
          <div className="text-xl font-bold text-purple-400 mt-1 font-mono">{lockedAccountsCount}</div>
          <div className="text-[9px] text-purple-300 mt-1">Auto Security Lock</div>
        </div>

        {/* Disabled Accounts */}
        <div className="glass-card p-3 border-red-500/30 bg-red-500/5 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-red-300 uppercase tracking-wider">Disabled Profiles</div>
          <div className="text-xl font-bold text-red-400 mt-1 font-mono">{disabledAccountsCount}</div>
          <div className="text-[9px] text-red-300 mt-1">HR Policy Action</div>
        </div>

        {/* Active Threats */}
        <div className="glass-card p-3 border-red-500/40 bg-red-500/10 glow-severity-high flex flex-col justify-between">
          <div className="text-[10px] font-bold text-red-200 uppercase tracking-wider">Active Threats</div>
          <div className="text-xl font-bold text-red-400 mt-1 font-mono">{activeThreatsCount}</div>
          <div className="text-[9px] text-red-300 mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" /> Action Needed
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="glass-card p-3 border-red-600/40 bg-red-600/10 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-red-300 uppercase tracking-wider">Critical Alerts</div>
          <div className="text-xl font-bold text-red-400 mt-1 font-mono">{criticalAlertsCount}</div>
          <div className="text-[9px] text-red-400 mt-1">Immediate SecOps</div>
        </div>

        {/* High Alerts */}
        <div className="glass-card p-3 border-amber-500/30 bg-amber-500/5 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">High Alerts</div>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{highAlertsCount}</div>
          <div className="text-[9px] text-amber-300 mt-1">Velocity/Country</div>
        </div>

        {/* Medium Alerts */}
        <div className="glass-card p-3 border-amber-400/30 bg-amber-400/5 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">Medium Alerts</div>
          <div className="text-xl font-bold text-amber-300 mt-1 font-mono">{mediumAlertsCount}</div>
          <div className="text-[9px] text-amber-200 mt-1">Device/IP Anomaly</div>
        </div>

        {/* Low Alerts */}
        <div className="glass-card p-3 border-cyan-500/30 bg-cyan-500/5 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Low Alerts</div>
          <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">{lowAlertsCount}</div>
          <div className="text-[9px] text-cyan-300 mt-1">Off-Hours Login</div>
        </div>

        {/* Unique Countries */}
        <div className="glass-card p-3 border-white/10 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unique Countries</div>
          <div className="text-xl font-bold text-cyan-300 mt-1 font-mono">{uniqueCountriesCount}</div>
          <div className="text-[9px] text-cyan-300 mt-1">Global Origins</div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN CHARTS ROW (LOGIN TIMELINE + THREAT TIMELINE + SEVERITY) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Widget 4: Login Timeline Chart (6 Cols) */}
        <div className="lg:col-span-6 glass-panel p-5 border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Authentication Activity Timeline</span>
              </h3>
              <p className="text-[11px] text-slate-400">Real-time Stream: Success vs Failed Logins</p>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center gap-1 text-indigo-300">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Success
              </span>
              <span className="flex items-center gap-1 text-red-300">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Failed
              </span>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loginTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.2)", borderRadius: "0.5rem", color: "#fff", fontSize: "11px" }} />
                <Area type="monotone" dataKey="success" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSuccess)" name="Successful" />
                <Area type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorFailed)" name="Failed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget 5 & 6: Threat Severity Distribution & Success vs Fail (6 Cols) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Widget 6: Threat Severity Chart */}
          <div className="glass-panel p-5 border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Threat Severity Breakdown</span>
              </h3>
              <p className="text-[11px] text-slate-400">Distribution across active alerts</p>
            </div>
            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.2)", borderRadius: "0.5rem", color: "#fff", fontSize: "11px" }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {severityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Widget 7: Login Success vs Failure Donut */}
          <div className="glass-panel p-5 border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                <span>Success vs Failure Ratio</span>
              </h3>
              <p className="text-[11px] text-slate-400">Overall authentication outcomes</p>
            </div>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={successVsFailureData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {successVsFailureData.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.2)", borderRadius: "0.5rem", color: "#fff", fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. FEEDS & TABLES ROW (LIVE THREAT FEED + LIVE LOGIN FEED) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Widget 3: Real-Time Threat Feed (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Real-Time Threat Feed</span>
                </h3>
                <p className="text-[11px] text-slate-400">Live detection engine findings</p>
              </div>

              {/* Severity Filter */}
              <div className="flex items-center space-x-1 glass-card p-1 rounded-lg">
                {["all", "critical", "high", "medium"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSeverityFilter(f)}
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                      severityFilter === f ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredAlerts.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs glass-card">
                  No active threat alerts matching filter.
                </div>
              ) : (
                filteredAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    className={`glass-card p-3 rounded-xl cursor-pointer border transition ${
                      alt.severity === "critical" ? "glow-severity-high border-red-600/40 bg-red-600/10" :
                      alt.severity === "high" ? "glow-severity-high border-red-500/40" :
                      alt.severity === "medium" ? "glow-severity-medium border-amber-500/40" :
                      "glow-severity-low border-cyan-500/40"
                    } ${alt.resolved ? "opacity-60" : ""}`}
                    onClick={() => setSelectedAlert(alt)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          alt.severity === "critical" ? "bg-red-600/30 text-red-200 border border-red-600/50" :
                          alt.severity === "high" ? "bg-red-500/20 text-red-300 border border-red-500/40" :
                          alt.severity === "medium" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                          "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        }`}>
                          {alt.severity}
                        </span>
                        <span className="text-xs font-bold text-white capitalize">
                          {(alt.threatType || alt.type || "Threat").replace(/_/g, " ")}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(alt.timestamp || Date.now()).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2 mb-1.5">
                      {alt.details?.reason || "Anomaly flagged by detection engine."}
                    </p>

                    <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[10px]">
                      <span className="text-indigo-300 font-mono">{alt.email}</span>
                      <span className="text-slate-400 flex items-center gap-0.5">
                        Investigate <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Widget 1 & 2: Live Login Feed & Active Sessions Table (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-5 border-white/10 space-y-4">
          
          {/* Widget 2: Active Sessions Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-indigo-400" />
                <span>Active Employee Sessions ({activeSessions.length})</span>
              </h3>
              <span className="text-[10px] text-slate-400">Tokens currently live</span>
            </div>
            <div className="overflow-x-auto max-h-44">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase text-[9px]">
                    <th className="pb-1.5">Employee</th>
                    <th className="pb-1.5">IP</th>
                    <th className="pb-1.5">Device</th>
                    <th className="pb-1.5">Location</th>
                    <th className="pb-1.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[10px]">
                  {activeSessions.slice(0, 5).map((s) => (
                    <tr key={s.sessionId} className="hover:bg-white/5">
                      <td className="py-1.5 text-white font-medium truncate max-w-[120px]">{s.email}</td>
                      <td className="py-1.5 text-indigo-300">{s.ip}</td>
                      <td className="py-1.5 text-slate-400 truncate max-w-[110px]">{s.device}</td>
                      <td className="py-1.5 text-slate-300">{s.location}</td>
                      <td className="py-1.5 text-right">
                        <button
                          onClick={() => terminateSession(s.sessionId)}
                          className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 text-[9px] font-bold"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Widget 1: Live Login Feed */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Live Authentication Stream (27 Fields Telemetry)</span>
              </h3>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Real-time
              </span>
            </div>
            <div className="overflow-x-auto max-h-48">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase text-[9px]">
                    <th className="pb-1.5">Time</th>
                    <th className="pb-1.5">Employee ID</th>
                    <th className="pb-1.5">User Email</th>
                    <th className="pb-1.5">IP</th>
                    <th className="pb-1.5">Location</th>
                    <th className="pb-1.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[10px]">
                  {loginAttempts.slice(0, 10).map((att) => {
                    if (!att) return null;
                    return (
                      <tr key={att.id} className="hover:bg-white/5">
                        <td className="py-1.5 text-slate-400">
                          {new Date(att.timestamp || att.loginTime || Date.now()).toLocaleTimeString()}
                        </td>
                        <td className="py-1.5 text-indigo-300 font-bold">{att.empId || "EMP-10001"}</td>
                        <td className="py-1.5 text-white truncate max-w-[130px]">{att.email}</td>
                        <td className="py-1.5 text-cyan-300">{att.ip || "0.0.0.0"}</td>
                        <td className="py-1.5 text-slate-300">{att.city || "San Jose"}, {att.country || "USA"}</td>
                        <td className="py-1.5">
                          {att.status === "success" ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              SUCCESS
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                              FAILED
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. BREAKDOWN BAR CHARTS ROW (TOP COUNTRIES, TOP CITIES, BROWSERS, DEVICES) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Widget 9: Top Attack Countries */}
        <div className="glass-panel p-4 border-white/10">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> Top Auth Countries
          </h4>
          <div className="space-y-1.5 text-[11px]">
            {topCountriesData.map((item) => (
              <div key={item.country} className="flex justify-between items-center p-1.5 rounded glass-card bg-black/20">
                <span className="text-slate-300 truncate">{item.country}</span>
                <span className="text-indigo-400 font-mono font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 10: Top Cities */}
        <div className="glass-panel p-4 border-white/10">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" /> Top Auth Cities
          </h4>
          <div className="space-y-1.5 text-[11px]">
            {topCitiesData.map((item) => (
              <div key={item.city} className="flex justify-between items-center p-1.5 rounded glass-card bg-black/20">
                <span className="text-slate-300 truncate">{item.city}</span>
                <span className="text-amber-400 font-mono font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 11: Top Browsers */}
        <div className="glass-panel p-4 border-white/10">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-indigo-400" /> Top Browsers
          </h4>
          <div className="space-y-1.5 text-[11px]">
            {topBrowsersData.slice(0, 5).map((item) => (
              <div key={item.browser} className="flex justify-between items-center p-1.5 rounded glass-card bg-black/20">
                <span className="text-slate-300 truncate">{item.browser}</span>
                <span className="text-emerald-400 font-mono font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 12: Top Operating Systems */}
        <div className="glass-panel p-4 border-white/10">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" /> Top Operating Systems
          </h4>
          <div className="space-y-1.5 text-[11px]">
            {topDevicesData.slice(0, 5).map((item) => (
              <div key={item.os} className="flex justify-between items-center p-1.5 rounded glass-card bg-black/20">
                <span className="text-slate-300 truncate">{item.os}</span>
                <span className="text-purple-400 font-mono font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. GEOLOCATION MAP & THREAT HEATMAP */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Widget 14: Country Login Leaflet Map (8 Cols) */}
        <div className="lg:col-span-8 glass-panel p-5 border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Interactive Country Authentication & Threat Map</span>
              </h3>
              <p className="text-[11px] text-slate-400">Leaflet geographic coordinates telemetry</p>
            </div>
          </div>
          <LocationMap loginAttempts={loginAttempts} />
        </div>

        {/* Widget 13 & 15: Threat Heatmap & Employee Activity Feed (4 Cols) */}
        <div className="lg:col-span-4 glass-panel p-5 border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Threat Heatmap Density Matrix</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">Threat concentration intensity</p>
            
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold font-mono">
              <div className="p-2.5 rounded bg-red-600/30 text-red-200 border border-red-500/40">
                <span>CRITICAL</span>
                <span className="block text-sm mt-0.5">{criticalAlertsCount}</span>
              </div>
              <div className="p-2.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                <span>HIGH</span>
                <span className="block text-sm mt-0.5">{highAlertsCount}</span>
              </div>
              <div className="p-2.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <span>MED</span>
                <span className="block text-sm mt-0.5">{mediumAlertsCount}</span>
              </div>
              <div className="p-2.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <span>LOW</span>
                <span className="block text-sm mt-0.5">{lowAlertsCount}</span>
              </div>
            </div>
          </div>

          {/* Widget 15: Employee Activity Timeline */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Employee Activity Feed
            </h4>
            <div className="space-y-2 max-h-36 overflow-y-auto text-[10px]">
              {loginAttempts.slice(0, 5).map((att) => (
                <div key={att.id} className="p-1.5 rounded glass-card bg-black/20 flex justify-between items-center">
                  <div className="truncate pr-2">
                    <span className="text-white font-bold block">{att.name || att.email}</span>
                    <span className="text-slate-400">{att.city}, {att.country}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                    att.status === "success" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}

    </div>
  );
}
