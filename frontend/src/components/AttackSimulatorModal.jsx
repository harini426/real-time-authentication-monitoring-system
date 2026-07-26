import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Zap, 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Compass, 
  Laptop, 
  Clock, 
  CheckCircle2, 
  Globe, 
  Network, 
  UserX, 
  Lock, 
  Activity, 
  Smartphone 
} from "lucide-react";

export function AttackSimulatorModal({ onClose }) {
  const { recordLoginAttempt } = useAuth();
  const [runningAttack, setRunningAttack] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  /** 1. Brute Force */
  const handleBruteForce = async () => {
    setRunningAttack("brute_force");
    setStatusMessage("Executing 5 rapid failed login bursts for Target Victim Account (EMP-10004)...");
    for (let i = 1; i <= 5; i++) {
      await recordLoginAttempt({
        empId: "EMP-10004",
        userId: "emp_10004",
        name: "Target Victim Account",
        email: "target.user@corp.internal",
        status: "failed",
        ip: "185.220.101.5",
        device: "Python-urllib/3.10 (Bot Scanner)",
        city: "Moscow",
        country: "Russia",
        latitude: 55.7558,
        longitude: 37.6173
      });
      await new Promise((r) => setTimeout(r, 200));
    }
    setStatusMessage("⚡ Brute Force Attack executed! Critical Alert generated and account locked automatically.");
    setRunningAttack(null);
  };

  /** 2. Impossible Travel */
  const handleImpossibleTravel = async () => {
    setRunningAttack("impossible_travel");
    setStatusMessage("Simulating initial login from San Francisco, USA...");
    await recordLoginAttempt({
      empId: "EMP-10001",
      userId: "emp_10001",
      name: "Alex Mercer",
      email: "alex.cyber@company.com",
      status: "success",
      ip: "198.51.100.42",
      device: "Chrome Enterprise on macOS",
      city: "San Francisco",
      country: "United States",
      latitude: 37.7749,
      longitude: -122.4194
    });

    await new Promise((r) => setTimeout(r, 800));
    setStatusMessage("Simulating concurrent login from Tokyo, Japan 1 minute later (8,270 km away)...");
    await recordLoginAttempt({
      empId: "EMP-10001",
      userId: "emp_10001",
      name: "Alex Mercer",
      email: "alex.cyber@company.com",
      status: "success",
      ip: "203.0.113.195",
      device: "Chrome Enterprise on macOS",
      city: "Tokyo",
      country: "Japan",
      latitude: 35.6762,
      longitude: 139.6503
    });
    setStatusMessage("✈️ Impossible Travel Velocity (>49,000 km/h) detected! High Severity Alert created.");
    setRunningAttack(null);
  };

  /** 3. New Device */
  const handleNewDevice = async () => {
    setRunningAttack("new_device");
    setStatusMessage("Simulating login from unknown device signature (Opera 109 on Linux)...");
    await recordLoginAttempt({
      empId: "EMP-10002",
      userId: "emp_10002",
      name: "Sarah Jenkins",
      email: "admin@soc.io",
      status: "success",
      ip: "103.21.244.0",
      deviceFingerprint: "fp_unknown_unverified_sig",
      device: "Opera 109.0 on Linux x86_64",
      city: "Sydney",
      country: "Australia",
      latitude: -33.8688,
      longitude: 151.2093
    });
    setStatusMessage("💻 Unrecognized Device Signature detected! Medium Severity Alert created.");
    setRunningAttack(null);
  };

  /** 4. Off Hours Login */
  const handleOffHours = async () => {
    setRunningAttack("off_hours");
    setStatusMessage("Injecting login forced at 03:14 AM local time...");
    const lateDate = new Date();
    lateDate.setHours(3, 14, 0, 0);

    await recordLoginAttempt({
      empId: "EMP-10005",
      userId: "emp_10005",
      name: "Ananya Roy",
      email: "ananya.roy@corp.internal",
      timestamp: lateDate.toISOString(),
      status: "success",
      ip: "82.165.197.1",
      device: "Edge 126.0 on Windows 11",
      city: "Berlin",
      country: "Germany",
      latitude: 52.52,
      longitude: 13.405
    });
    setStatusMessage("🌙 Off-Hours Workforce Login detected! Low Severity Alert created.");
    setRunningAttack(null);
  };

  /** 5. Multiple Country Login */
  const handleMultiCountry = async () => {
    setRunningAttack("multi_country");
    setStatusMessage("Injecting simultaneous logins across Germany & Singapore within 5 mins...");
    await recordLoginAttempt({
      empId: "EMP-10003",
      userId: "emp_10003",
      name: "Rajesh Sharma",
      email: "rajesh.sharma@corp.internal",
      status: "success",
      ip: "85.214.0.1",
      city: "Berlin",
      country: "Germany",
      latitude: 52.52,
      longitude: 13.405
    });
    await new Promise((r) => setTimeout(r, 500));
    await recordLoginAttempt({
      empId: "EMP-10003",
      userId: "emp_10003",
      name: "Rajesh Sharma",
      email: "rajesh.sharma@corp.internal",
      status: "success",
      ip: "203.116.45.1",
      city: "Singapore",
      country: "Singapore",
      latitude: 1.3521,
      longitude: 103.8198
    });
    setStatusMessage("🌍 Simultaneous Multi-Country Logins detected! High Severity Alert created.");
    setRunningAttack(null);
  };

  /** 6. VPN or Proxy Login */
  const handleVpnProxy = async () => {
    setRunningAttack("vpn_proxy");
    setStatusMessage("Injecting login with active NordVPN / Anonymizing Proxy flag...");
    await recordLoginAttempt({
      empId: "EMP-10006",
      userId: "emp_10006",
      name: "David Miller",
      email: "david.miller@corp.internal",
      status: "success",
      vpnDetected: true,
      proxyDetected: true,
      ip: "185.220.101.99",
      isp: "NordVPN Anonymizing Proxy Gateway",
      city: "Zurich",
      country: "Switzerland",
      latitude: 47.3769,
      longitude: 8.5417
    });
    setStatusMessage("🔒 VPN / Proxy Tunnel Authentication detected! Medium Severity Alert created.");
    setRunningAttack(null);
  };

  /** 7. Disabled Account Login */
  const handleDisabledLogin = async () => {
    setRunningAttack("disabled_login");
    setStatusMessage("Injecting access attempt targeting disabled profile (Elena Rostova)...");
    await recordLoginAttempt({
      empId: "EMP-10010",
      userId: "emp_10010",
      name: "Elena Rostova",
      email: "elena.rostova@corp.internal",
      status: "failed",
      ip: "198.51.100.99",
      city: "London",
      country: "United Kingdom"
    });
    setStatusMessage("⛔ Critical Access Violation: Login attempt on Disabled Employee Profile!");
    setRunningAttack(null);
  };

  /** 8. Device Switching */
  const handleDeviceSwitching = async () => {
    setRunningAttack("device_switching");
    setStatusMessage("Simulating rapid Windows -> Android Knox -> macOS Sequoia switching within 5 mins...");
    await recordLoginAttempt({
      empId: "EMP-10007",
      userId: "emp_10007",
      name: "Marcus Vance",
      email: "marcus.vance@corp.internal",
      status: "success",
      os: "Windows 11 Enterprise",
      ip: "103.24.120.5"
    });
    await new Promise((r) => setTimeout(r, 400));
    await recordLoginAttempt({
      empId: "EMP-10007",
      userId: "emp_10007",
      name: "Marcus Vance",
      email: "marcus.vance@corp.internal",
      status: "success",
      os: "Android 15 Knox",
      ip: "103.24.120.6"
    });
    await new Promise((r) => setTimeout(r, 400));
    await recordLoginAttempt({
      empId: "EMP-10007",
      userId: "emp_10007",
      name: "Marcus Vance",
      email: "marcus.vance@corp.internal",
      status: "success",
      os: "macOS Sequoia",
      ip: "103.24.120.7"
    });
    setStatusMessage("📱 Impossible Rapid Device/OS Switching Anomaly! High Severity Alert created.");
    setRunningAttack(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-3xl glass-panel p-6 border-red-500/30 relative shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg glass-card transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Enterprise Threat Simulation Suite</h2>
            <p className="text-xs text-slate-400">
              Launch live simulated threat scenarios against the real-time Firestore detection engine.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl glass-card bg-indigo-500/10 border-indigo-500/30 text-indigo-200 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Simulation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6 text-xs">
          
          {/* 1. Brute Force */}
          <div className="p-3.5 rounded-xl glass-card border-red-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-red-400 uppercase">Critical</span>
                <ShieldAlert className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Brute Force Attack</h3>
              <p className="text-[11px] text-slate-400 mb-3">5 failed logins in 5 minutes.</p>
            </div>
            <button
              onClick={handleBruteForce}
              disabled={Boolean(runningAttack)}
              className="w-full py-1.5 rounded bg-red-500/20 text-red-200 font-bold hover:bg-red-500/30 text-[11px]"
            >
              {runningAttack === "brute_force" ? "Firing Bursts..." : "Launch Brute Force"}
            </button>
          </div>

          {/* 2. Impossible Travel */}
          <div className="p-3.5 rounded-xl glass-card border-red-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-red-400 uppercase">High</span>
                <Compass className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Impossible Travel</h3>
              <p className="text-[11px] text-slate-400 mb-3">SF -&gt; Tokyo in 1 min (&gt;800 km/h).</p>
            </div>
            <button
              onClick={handleImpossibleTravel}
              disabled={Boolean(runningAttack)}
              className="w-full py-1.5 rounded bg-red-500/20 text-red-200 font-bold hover:bg-red-500/30 text-[11px]"
            >
              {runningAttack === "impossible_travel" ? "Calculating Speed..." : "Launch Travel"}
            </button>
          </div>

          {/* 3. New Device */}
          <div className="p-3.5 rounded-xl glass-card border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Medium</span>
                <Laptop className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="font-bold text-white mb-1">New Device Alert</h3>
              <p className="text-[11px] text-slate-400 mb-3">Unrecognized browser fingerprint.</p>
            </div>
            <button
              onClick={handleNewDevice}
              disabled={Boolean(runningAttack)}
              className="w-full py-1.5 rounded bg-amber-500/20 text-amber-200 font-bold hover:bg-amber-500/30 text-[11px]"
            >
              {runningAttack === "new_device" ? "Fingerprinting..." : "Trigger Device"}
            </button>
          </div>

          {/* 4. Off Hours */}
          <div className="p-3.5 rounded-xl glass-card border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">Low</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Off-Hours Access</h3>
              <p className="text-[11px] text-slate-400 mb-3">Logins between 12 AM and 5 AM.</p>
            </div>
            <button
              onClick={handleOffHours}
              disabled={Boolean(runningAttack)}
              className="w-full py-1.5 rounded bg-cyan-500/20 text-cyan-200 font-bold hover:bg-cyan-500/30 text-[11px]"
            >
              {runningAttack === "off_hours" ? "Injecting Time..." : "Trigger Off-Hours"}
            </button>
          </div>

          {/* 5. Multi-Country */}
          <div className="p-3.5 rounded-xl glass-card border-red-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-red-400 uppercase">High</span>
                <Globe className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Multi-Country Login</h3>
              <p className="text-[11px] text-slate-400 mb-3">Concurrent logins across countries.</p>
            </div>
            <button
              onClick={handleMultiCountry}
              disabled={Boolean(runningAttack)}
              className="w-full py-1.5 rounded bg-red-500/20 text-red-200 font-bold hover:bg-red-500/30 text-[11px]"
            >
              {runningAttack === "multi_country" ? "Simulating Multi-Country..." : "Launch Multi-Country"}
            </button>
          </div>

          {/* 6. VPN / Proxy */}
          <div className="p-3.5 rounded-xl glass-card border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Medium</span>
                <Network className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="font-bold text-white mb-1">VPN / Proxy Flag</h3>
              <p className="text-[11px] text-slate-400 mb-3">Anonymizing proxy gateway.</p>
            </div>
            <button
              onClick={handleVpnProxy}
              disabled={Boolean(runningAttack)}
              className="w-full py-1.5 rounded bg-amber-500/20 text-amber-200 font-bold hover:bg-amber-500/30 text-[11px]"
            >
              {runningAttack === "vpn_proxy" ? "Flagging Tunnel..." : "Launch VPN Flag"}
            </button>
          </div>

          {/* 7. Disabled Account */}
          <div className="p-3.5 rounded-xl glass-card border-red-600/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-red-200 uppercase">Critical</span>
                <UserX className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Disabled Account Login</h3>
              <p className="text-[11px] text-slate-400 mb-3">Attempt on disabled profile.</p>
            </div>
            <button
              onClick={handleDisabledLogin}
              disabled={Boolean(runningAttack)}
              className="w-full py-1.5 rounded bg-red-600/20 text-red-200 font-bold hover:bg-red-600/30 text-[11px]"
            >
              {runningAttack === "disabled_login" ? "Simulating Breach..." : "Launch Disabled Breach"}
            </button>
          </div>

          {/* 8. Impossible Device Switching */}
          <div className="p-3.5 rounded-xl glass-card border-red-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-red-400 uppercase">High</span>
                <Smartphone className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Device Switch Anomaly</h3>
              <p className="text-[11px] text-slate-400 mb-3">Windows -&gt; Android -&gt; macOS.</p>
            </div>
            <button
              onClick={handleDeviceSwitching}
              disabled={Boolean(runningAttack)}
              className="w-full py-1.5 rounded bg-red-500/20 text-red-200 font-bold hover:bg-red-500/30 text-[11px]"
            >
              {runningAttack === "device_switching" ? "Switching OS..." : "Launch OS Switch"}
            </button>
          </div>

        </div>

        <div className="flex justify-end pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white"
          >
            Close Threat Simulator
          </button>
        </div>

      </div>
    </div>
  );
}
