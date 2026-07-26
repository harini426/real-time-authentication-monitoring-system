/**
 * Enterprise Data Service - Real-Time Employee Authentication Monitoring & Threat Detection System
 * Standardized RBAC Roles, 50 Enterprise Employee Profiles & Enriched Telemetry Constants
 */

export const RBAC_ROLES = {
  SUPER_ADMIN: "Super Admin",
  SEC_ADMIN: "Security Administrator",
  SOC_MANAGER: "SOC Manager",
  SOC_ANALYST_L2: "SOC Analyst L2",
  SOC_ANALYST_L1: "SOC Analyst L1",
  INCIDENT_RESPONDER: "Incident Responder",
  EMPLOYEE: "Employee"
};

export const ROLE_PERMISSIONS = {
  [RBAC_ROLES.SUPER_ADMIN]: {
    canViewGlobalDashboard: true,
    canViewAlerts: true,
    canManageAlerts: true,
    canEscalateAlerts: true,
    canResolveAlerts: true,
    canAssignAnalyst: true,
    canAddNotes: true,
    canManageUsers: true,
    canLockUsers: true,
    canDisableUsers: true,
    canEditRoles: true,
    canSimulateThreats: true
  },
  [RBAC_ROLES.SEC_ADMIN]: {
    canViewGlobalDashboard: true,
    canViewAlerts: true,
    canManageAlerts: true,
    canEscalateAlerts: true,
    canResolveAlerts: true,
    canAssignAnalyst: true,
    canAddNotes: true,
    canManageUsers: true,
    canLockUsers: true,
    canDisableUsers: true,
    canEditRoles: true,
    canSimulateThreats: true
  },
  [RBAC_ROLES.SOC_MANAGER]: {
    canViewGlobalDashboard: true,
    canViewAlerts: true,
    canManageAlerts: true,
    canEscalateAlerts: true,
    canResolveAlerts: true,
    canAssignAnalyst: true,
    canAddNotes: true,
    canManageUsers: true,
    canLockUsers: true,
    canDisableUsers: false,
    canEditRoles: false,
    canSimulateThreats: true
  },
  [RBAC_ROLES.SOC_ANALYST_L2]: {
    canViewGlobalDashboard: true,
    canViewAlerts: true,
    canManageAlerts: true,
    canEscalateAlerts: true,
    canResolveAlerts: true,
    canAssignAnalyst: true,
    canAddNotes: true,
    canManageUsers: false,
    canLockUsers: true,
    canDisableUsers: false,
    canEditRoles: false,
    canSimulateThreats: true
  },
  [RBAC_ROLES.SOC_ANALYST_L1]: {
    canViewGlobalDashboard: true,
    canViewAlerts: true,
    canManageAlerts: true,
    canEscalateAlerts: false,
    canResolveAlerts: true,
    canAssignAnalyst: false,
    canAddNotes: true,
    canManageUsers: false,
    canLockUsers: false,
    canDisableUsers: false,
    canEditRoles: false,
    canSimulateThreats: false
  },
  [RBAC_ROLES.INCIDENT_RESPONDER]: {
    canViewGlobalDashboard: true,
    canViewAlerts: true,
    canManageAlerts: true,
    canEscalateAlerts: true,
    canResolveAlerts: true,
    canAssignAnalyst: true,
    canAddNotes: true,
    canManageUsers: true,
    canLockUsers: true,
    canDisableUsers: true,
    canEditRoles: false,
    canSimulateThreats: true
  },
  [RBAC_ROLES.EMPLOYEE]: {
    canViewGlobalDashboard: false,
    canViewAlerts: false,
    canManageAlerts: false,
    canEscalateAlerts: false,
    canResolveAlerts: false,
    canAssignAnalyst: false,
    canAddNotes: false,
    canManageUsers: false,
    canLockUsers: false,
    canDisableUsers: false,
    canEditRoles: false,
    canSimulateThreats: false
  }
};

export const DEPARTMENTS = [
  "Cybersecurity / SOC",
  "Cloud Operations & DevOps",
  "Software Engineering",
  "Data Science & AI",
  "Finance & Risk Management",
  "Human Resources & Talent",
  "Legal & Compliance",
  "Product & Architecture",
  "Enterprise Infrastructure",
  "Sales & Global Consulting"
];

export const ENTERPRISE_COMPANIES = [
  "Microsoft",
  "Google",
  "Amazon",
  "TCS",
  "Infosys",
  "Accenture",
  "IBM",
  "Deloitte",
  "Wipro"
];

export const OFFICE_LOCATIONS = [
  { city: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946, ipPrefix: "103.24.120." },
  { city: "Hyderabad", state: "Telangana", country: "India", lat: 17.3850, lng: 78.4867, ipPrefix: "103.45.89." },
  { city: "Pune", state: "Maharashtra", country: "India", lat: 18.5204, lng: 73.8567, ipPrefix: "103.56.12." },
  { city: "London", state: "Greater London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, ipPrefix: "82.165.197." },
  { city: "New York", state: "New York", country: "United States", lat: 40.7128, lng: -74.0060, ipPrefix: "198.51.100." },
  { city: "San Jose", state: "California", country: "United States", lat: 37.3382, lng: -121.8863, ipPrefix: "192.0.2." },
  { city: "Singapore", state: "Central", country: "Singapore", lat: 1.3521, lng: 103.8198, ipPrefix: "203.116.45." },
  { city: "Sydney", state: "New South Wales", country: "Australia", lat: -33.8688, lng: 151.2093, ipPrefix: "103.21.244." },
  { city: "Tokyo", state: "Kanto", country: "Japan", lat: 35.6762, lng: 139.6503, ipPrefix: "202.214.192." },
  { city: "Berlin", state: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, ipPrefix: "85.214.0." }
];

export const MANAGERS = [
  { name: "Vikram Malhotra", email: "vikram.malhotra@corp.internal" },
  { name: "Sarah Jenkins", email: "sarah.jenkins@corp.internal" },
  { name: "Ananya Roy", email: "ananya.roy@corp.internal" },
  { name: "David Miller", email: "david.miller@corp.internal" },
  { name: "Rajesh Sharma", email: "rajesh.sharma@corp.internal" },
  { name: "Elena Rostova", email: "elena.rostova@corp.internal" }
];

export const SOC_ANALYSTS = [
  "Unassigned",
  "Alex Mercer (Super Admin)",
  "Sarah Jenkins (Sec Admin)",
  "Vikram Malhotra (SOC Mgr)",
  "Marcus Vance (L2 Analyst)",
  "Priya Nair (L1 Analyst)",
  "Chen Wei (Incident Responder)"
];

/**
 * Generate 50 Enterprise Employee Profiles
 */
export function generateEnterpriseEmployees() {
  const names = [
    "Alex Mercer", "Sarah Jenkins", "Rajesh Sharma", "Target Victim Account", "Ananya Roy",
    "David Miller", "Marcus Vance", "Priya Nair", "Chen Wei", "Elena Rostova",
    "Michael Scott", "Pam Beesly", "Jim Halpert", "Dwight Schrute", "Angela Martin",
    "Kevin Malone", "Oscar Martinez", "Stanley Hudson", "Phyllis Vance", "Ryan Howard",
    "Kelly Kapoor", "Toby Flenderson", "Creed Bratton", "Meredith Palmer", "Darryl Philbin",
    "Andy Bernard", "Erin Hannon", "Gabe Lewis", "Holly Flax", "Jan Levinson",
    "Robert California", "Nate Nickerson", "Clark Green", "Pete Miller", "Karen Filippelli",
    "Roy Anderson", "David Wallace", "Charles Miner", "Todd Packer", "Bob Vance",
    "Hank Tate", "Mose Schrute", "Vikram Patel", "Kavita Reddy", "Suresh Kumar",
    "Rohan Verma", "Deepak Gupta", "Meera Joshi", "Arjun Mehta", "Siddharth Rao"
  ];

  const rolesList = [
    RBAC_ROLES.SUPER_ADMIN,
    RBAC_ROLES.SEC_ADMIN,
    RBAC_ROLES.SOC_MANAGER,
    RBAC_ROLES.SOC_ANALYST_L2,
    RBAC_ROLES.SOC_ANALYST_L1,
    RBAC_ROLES.INCIDENT_RESPONDER,
    RBAC_ROLES.EMPLOYEE
  ];

  const designations = [
    "Lead SOC Architect", "Security Operations Director", "Principal Software Engineer",
    "Financial Controller", "HR Workforce Lead", "Senior Threat Hunter",
    "Cloud Infrastructure Lead", "SIEM Detection Engineer", "L1 Security Analyst",
    "L2 Incident Specialist", "Staff DevOps Engineer", "Data Privacy Officer"
  ];

  const teams = [
    "Threat Hunting", "Incident Response Command", "Core Platform",
    "FP&A Accounting", "Workforce Operations", "Cloud Sentinel",
    "IAM Governance", "SecOps Engineering", "Red Team Operations"
  ];

  const employees = [];
  const now = Date.now();

  for (let i = 0; i < names.length; i++) {
    const empNum = 10001 + i;
    const empId = `EMP-${empNum}`;
    const name = names[i];
    let email = `${name.toLowerCase().replace(/[^a-z]/g, ".")}@company.com`;
    if (i === 1) email = "admin@soc.io";
    if (i === 3) email = "target.user@corp.internal";

    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const locationObj = OFFICE_LOCATIONS[i % OFFICE_LOCATIONS.length];
    const company = ENTERPRISE_COMPANIES[i % ENTERPRISE_COMPANIES.length];
    const managerObj = MANAGERS[i % MANAGERS.length];

    let role = RBAC_ROLES.EMPLOYEE;
    if (i === 0) role = RBAC_ROLES.SUPER_ADMIN;
    else if (i === 1) role = RBAC_ROLES.SEC_ADMIN;
    else if (i === 2) role = RBAC_ROLES.EMPLOYEE;
    else if (i === 3) role = RBAC_ROLES.EMPLOYEE;
    else if (i === 4) role = RBAC_ROLES.SOC_MANAGER;
    else if (i === 5) role = RBAC_ROLES.SOC_ANALYST_L2;
    else if (i === 6) role = RBAC_ROLES.SOC_ANALYST_L1;
    else if (i === 7) role = RBAC_ROLES.INCIDENT_RESPONDER;
    else role = rolesList[i % rolesList.length];

    const isLocked = i === 3 || i % 13 === 0;
    const isDisabled = i === 11 || i % 17 === 0;
    let accountStatus = "Active";
    if (isDisabled) accountStatus = "Disabled";
    else if (isLocked) accountStatus = "Locked";

    employees.push({
      id: `emp_${empNum}`,
      empId,
      name,
      email,
      department: dept,
      designation: designations[i % designations.length],
      team: teams[i % teams.length],
      company,
      officeLocation: `${locationObj.city}, ${locationObj.country}`,
      city: locationObj.city,
      state: locationObj.state,
      country: locationObj.country,
      latitude: locationObj.lat,
      longitude: locationObj.lng,
      manager: managerObj.name,
      managerEmail: managerObj.email,
      role,
      accountStatus,
      locked: isLocked,
      disabled: isDisabled,
      lockedReason: isLocked ? "Automated security lockout triggered due to anomalous access attempt." : null,
      disabledReason: isDisabled ? "Employee account deactivated by HR Security Policy." : null,
      createdAt: new Date(now - (30 + i * 3) * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(now - (i * 15 + 5) * 60 * 1000).toISOString(),
      lastLogout: i % 2 === 0 ? new Date(now - (i * 15 + 60) * 60 * 1000).toISOString() : null,
      assignedDevices: [
        `Chrome 126.0 on Windows 11 Enterprise (DEVICE-${empId}-A)`,
        `Safari 17.4 on macOS Sequoia (DEVICE-${empId}-B)`
      ]
    });
  }

  return employees;
}

/**
 * Generate Initial 27-field Authentication Events
 */
export function generateInitialTelemetry(employees) {
  const attempts = [];
  const now = Date.now();

  for (let i = 0; i < 40; i++) {
    const emp = employees[i % employees.length];
    const loc = OFFICE_LOCATIONS[i % OFFICE_LOCATIONS.length];
    const isFail = i % 5 === 0;

    const eventTime = new Date(now - i * 8 * 60 * 1000).toISOString();
    const logoutTime = !isFail && i > 5 ? new Date(now - (i * 8 - 4) * 60 * 1000).toISOString() : null;

    attempts.push({
      id: `att_${2000 + i}`,
      empId: emp.empId,
      name: emp.name,
      email: emp.email,
      loginTime: eventTime,
      logoutTime: logoutTime,
      status: isFail ? "failed" : "success",
      failedCount: isFail ? (i % 3) + 1 : 0,
      ip: `${loc.ipPrefix}${10 + (i % 200)}`,
      browser: i % 4 === 0 ? "Microsoft Edge Enterprise" : i % 3 === 0 ? "Firefox ESM" : "Chrome Enterprise",
      browserVersion: "126.0.6478.127",
      os: i % 3 === 0 ? "macOS Sequoia" : "Windows 11 Enterprise",
      deviceType: i % 6 === 0 ? "Mobile" : "Desktop",
      deviceFingerprint: `fp_hash_${emp.empId}_${i % 4}`,
      screenResolution: "1920x1080",
      timeZone: "Asia/Kolkata",
      language: "en-US",
      latitude: loc.lat,
      longitude: loc.lng,
      country: loc.country,
      state: loc.state,
      city: loc.city,
      isp: "Corporate Fiber Enterprise",
      vpnDetected: i % 7 === 0,
      proxyDetected: i % 11 === 0,
      sessionId: `sess_${Date.now()}_${i}`,
      networkType: i % 2 === 0 ? "Corporate Wi-Fi" : "Ethernet Direct",
      timestamp: eventTime,
      device: `${i % 4 === 0 ? "Microsoft Edge Enterprise" : "Chrome Enterprise"} on ${i % 3 === 0 ? "macOS Sequoia" : "Windows 11 Enterprise"}`
    });
  }

  return attempts;
}
