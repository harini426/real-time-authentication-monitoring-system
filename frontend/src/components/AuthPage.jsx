import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Shield, 
  Lock, 
  Mail, 
  User, 
  AlertTriangle, 
  Globe, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound, 
  ArrowLeft, 
  Zap, 
  Building2, 
  Briefcase 
} from "lucide-react";
import { RBAC_ROLES, DEPARTMENTS } from "../services/enterpriseData";

export function AuthPage() {
  const { login, signup, resetPassword, activeTelemetry } = useAuth();
  
  // Auth Modes: "login" | "signup" | "reset"
  const [authMode, setAuthMode] = useState("login");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [designation, setDesignation] = useState("SOC Analyst");
  const [userRole, setUserRole] = useState(RBAC_ROLES.EMPLOYEE);
  const [rememberDevice, setRememberDevice] = useState(true);
  
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");
    setSubmitting(true);

    try {
      if (authMode === "login") {
        await login(email, password, rememberDevice);
      } else if (authMode === "signup") {
        await signup(email, password, name, department, designation, userRole);
        setInfoMsg("Registration successful! Verification email link sent.");
      } else if (authMode === "reset") {
        await resetPassword(email);
        setInfoMsg("Password reset email dispatched to your inbox.");
      }
    } catch (err) {
      setError(err.message || "Authentication verification failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickLogin = (demoUser, demoPass) => {
    setEmail(demoUser);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0b0f19]">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 z-10">
        
        {/* Left Information Card */}
        <div className="md:col-span-5 glass-panel p-8 flex flex-col justify-between border-white/10">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 glass-card bg-indigo-500/20 border-indigo-500/40 text-indigo-400 rounded-2xl shadow-lg shadow-indigo-500/20">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">SOC Threat Sentinel</h1>
                <p className="text-xs text-slate-400">Enterprise Authentication Monitoring</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Production-grade Security Operations platform monitoring real-time employee authentication, Haversine travel velocity, brute force bursts, device fingerprinting, and RBAC control across global enterprise workforces.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2.5 p-2 rounded-xl glass-card text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Firestore Real-Time Stream Ingestion</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2 rounded-xl glass-card text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Haversine Travel Velocity (&gt;800 km/h)</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2 rounded-xl glass-card text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated 11-Rule Detection Engine</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2 rounded-xl glass-card text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>7 Role-Based Access Control (RBAC)</span>
              </div>
            </div>

            {/* Demo Credentials Shortcuts */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Demo Accounts (Click to autofill)</span>
              <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => fillQuickLogin("superadmin", "Super@123")}
                  className="p-2 rounded-xl glass-card bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-left flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold block text-white">1. Super Admin</span>
                    <span className="text-[10px] text-slate-400">superadmin / Super@123</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200">Full Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickLogin("manager", "Manager@123")}
                  className="p-2 rounded-xl glass-card bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-left flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold block text-white">2. SOC Manager</span>
                    <span className="text-[10px] text-slate-400">manager / Manager@123</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200">Manager Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickLogin("analyst", "Analyst@123")}
                  className="p-2 rounded-xl glass-card bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-left flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold block text-white">3. SOC Analyst</span>
                    <span className="text-[10px] text-slate-400">analyst / Analyst@123</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-200">Analyst Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickLogin("responder", "Responder@123")}
                  className="p-2 rounded-xl glass-card bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-left flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold block text-white">4. Incident Responder</span>
                    <span className="text-[10px] text-slate-400">responder / Responder@123</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/30 text-red-200">Responder Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickLogin("securityadmin", "Security@123")}
                  className="p-2 rounded-xl glass-card bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-left flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold block text-white">5. Security Administrator</span>
                    <span className="text-[10px] text-slate-400">securityadmin / Security@123</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200">Security Admin Access</span>
                </button>
              </div>
            </div>
          </div>

          {/* Captured Client Telemetry Box */}
          {activeTelemetry && (
            <div className="mt-6 pt-4 border-t border-white/10 text-xs">
              <div className="text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Captured Client Telemetry</span>
              </div>
              <div className="bg-black/40 p-3 rounded-xl space-y-1 font-mono text-[10px] text-slate-300 border border-white/5">
                <div><span className="text-slate-500">IP:</span> {activeTelemetry.ip}</div>
                <div><span className="text-slate-500">LOCATION:</span> {activeTelemetry.city}, {activeTelemetry.country}</div>
                <div><span className="text-slate-500">FINGERPRINT:</span> {activeTelemetry.deviceFingerprint}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Auth Form */}
        <div className="md:col-span-7 glass-panel p-8 flex flex-col justify-center border-white/15">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {authMode === "login" && "Employee Portal Sign In"}
              {authMode === "signup" && "Register Enterprise Profile"}
              {authMode === "reset" && "Reset Password Request"}
            </h2>

            {authMode !== "reset" ? (
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === "login" ? "signup" : "login");
                  setError("");
                  setInfoMsg("");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
              >
                {authMode === "login" ? "New Registration" : "Sign In to Account"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setError("");
                  setInfoMsg("");
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl glass-card border-red-500/40 bg-red-500/10 text-red-200 text-sm flex items-start space-x-3 glow-severity-high">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Authentication Exception</span>
                <span className="text-xs leading-relaxed">{error}</span>
              </div>
            </div>
          )}

          {infoMsg && (
            <div className="mb-6 p-4 rounded-xl glass-card border-emerald-500/40 bg-emerald-500/10 text-emerald-200 text-sm flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Status Notification</span>
                <span className="text-xs">{infoMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Employee Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full glass-input pl-10 pr-4 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full glass-input px-3 py-2.5 text-xs bg-[#0f172a] text-white"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role Assignment</label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-full glass-input px-3 py-2.5 text-xs bg-[#0f172a] text-white"
                    >
                      {Object.values(RBAC_ROLES).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Designation</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Lead Cybersecurity Architect"
                    className="w-full glass-input px-4 py-2.5 text-sm"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username or Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. superadmin, manager, analyst..."
                  className="w-full glass-input pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            {authMode !== "reset" && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  {authMode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("reset");
                        setError("");
                        setInfoMsg("");
                      }}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full glass-input pl-10 pr-4 py-2.5 text-sm"
                  />
                </div>
              </div>
            )}

            {authMode === "login" && (
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberDevice"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded bg-slate-800 border-white/20 text-indigo-500 focus:ring-0"
                />
                <label htmlFor="rememberDevice" className="text-xs text-slate-300 cursor-pointer">
                  Remember device token for device fingerprinting
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full glass-button-primary py-3 text-sm flex items-center justify-center space-x-2 mt-4"
            >
              {submitting ? (
                <span>Verifying Credentials & Telemetry...</span>
              ) : (
                <>
                  <span>
                    {authMode === "login" && "Authenticate & Ingest Session"}
                    {authMode === "signup" && "Register Employee Profile"}
                    {authMode === "reset" && "Send Password Reset Link"}
                  </span>
                  {authMode === "reset" ? <KeyRound className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
