import React, { useState, Component } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { AlertManagement } from "./components/AlertManagement";
import { UserManagement } from "./components/UserManagement";
import { EmployeeProfile } from "./components/EmployeeProfile";
import { AccessDenied } from "./components/AccessDenied";
import { AttackSimulatorModal } from "./components/AttackSimulatorModal";
import { Shield, RefreshCw } from "lucide-react";
import { RBAC_ROLES, ROLE_PERMISSIONS } from "./services/enterpriseData";

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SOC Sentinel Render Exception caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0f19] p-6">
          <div className="glass-panel p-8 max-w-md text-center space-y-4 border-red-500/30">
            <Shield className="w-12 h-12 text-red-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">SOC Console Telemetry Notice</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              A temporary telemetry rendering state occurred. Click below to reload the real-time SOC Sentinel dashboard.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="glass-button-primary px-4 py-2 text-xs flex items-center justify-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload SOC Console</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function MainContent() {
  const { currentUser, loading, role } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSimulator, setShowSimulator] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0f19]">
        <div className="flex flex-col items-center space-y-3 glass-panel p-8">
          <Shield className="w-10 h-10 text-indigo-400 animate-pulse" />
          <span className="text-sm font-semibold tracking-wider">Initializing SecOps Threat Sentinel...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  // Determine user role and authorized navigation tabs
  const userRole = role || currentUser.role || RBAC_ROLES.SUPER_ADMIN;
  const rolePerms = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS[RBAC_ROLES.EMPLOYEE];
  const allowedTabs = rolePerms.allowedTabs || ["dashboard", "my_profile"];
  
  const isAuthorized = allowedTabs.includes(activeTab);
  const defaultHomeTab = allowedTabs[0] || "my_profile";

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar
        onOpenSimulator={() => setShowSimulator(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!isAuthorized ? (
          <AccessDenied
            requestedTab={activeTab}
            onRedirect={() => setActiveTab(defaultHomeTab)}
          />
        ) : (
          <>
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "alerts" && <AlertManagement />}
            {activeTab === "users" && <UserManagement />}
            {activeTab === "my_profile" && <EmployeeProfile />}
          </>
        )}
      </main>

      <footer className="w-full glass-panel rounded-none border-x-0 border-b-0 border-t-white/10 py-4 px-6 text-center text-xs text-slate-400">
        Enterprise Real-Time Employee Authentication Monitoring & Threat Detection System • Role-Based Access Control (RBAC) Architecture
      </footer>

      {showSimulator && (
        <AttackSimulatorModal onClose={() => setShowSimulator(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
