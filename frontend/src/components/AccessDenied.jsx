import React from "react";
import { ShieldAlert, Lock, ArrowLeft, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { RBAC_ROLES } from "../services/enterpriseData";

export function AccessDenied({ requestedTab, onRedirect }) {
  const { currentUser, role } = useAuth();
  const currentRole = role || currentUser?.role || RBAC_ROLES.EMPLOYEE;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel p-8 text-center space-y-6 border-red-500/30 glow-severity-high shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient background element */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header Icon */}
        <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 inline-block shadow-lg shadow-red-500/20">
          <ShieldAlert className="w-12 h-12 mx-auto animate-pulse" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 border border-red-500/40 text-red-300">
            HTTP 403 FORBIDDEN
          </span>
          <h2 className="text-2xl font-bold text-white mt-3">
            Access Restricted by RBAC Policy
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            You do not have the required Security Clearance or Role Privileges to view the requested tab (<span className="text-red-300 font-mono font-bold">"{requestedTab || 'restricted_page'}"</span>).
          </p>
        </div>

        {/* User Identity Info */}
        <div className="p-4 rounded-xl glass-card bg-black/40 border-white/10 text-left text-xs space-y-2 font-mono">
          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400">Authenticated Identity:</span>
            <span className="text-white font-bold">{currentUser?.name || currentUser?.email || "Authenticated User"}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400">Assigned RBAC Role:</span>
            <span className="text-indigo-300 font-bold px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30">{currentRole}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Security Audit Status:</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" /> Policy Violation Intercepted
            </span>
          </div>
        </div>

        {/* Return Button */}
        <button
          onClick={onRedirect}
          className="glass-button-primary w-full py-3 text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Authorized Home Dashboard</span>
        </button>

      </div>
    </div>
  );
}
