



# 🛡️ Real-Time Authentication Monitoring & Threat Detection System

A 100% free-tier compatible Security Operations Center (SOC) dashboard and real-time threat detection system built with **React (Vite)**, **Tailwind CSS (Glassmorphism)**, **Recharts**, **Firebase (Auth, Firestore, Hosting)**, and **Leaflet Geolocation Mapping**.

> 💡 **Firebase Spark (Free Plan) Ready**: Powered by client-side threat evaluation and Firestore `onSnapshot` real-time listeners. Zero Cloud Functions or GCP Blaze billing required!

---

## 🌟 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS (Glassmorphism), Recharts, Lucide React, Leaflet Maps
- **Backend Services**: Firebase Authentication, Cloud Firestore (Real-time `onSnapshot` subscriptions), Firebase Hosting
- **Telemetry**: Public IP & Geolocation API integration + User-Agent device fingerprinting

---

## 🎯 Threat Detection Rules (Running Client-Side via Firestore)

1. **⚡ Brute Force Detection (High Severity)**:
   - Evaluates consecutive failed login attempts within a 5-minute sliding window for the same user/email.
   - If count $\ge 5$, triggers a High-Severity Alert and sets `locked: true` on the user document in Firestore.

2. **✈️ Impossible Travel Velocity Detection (High Severity)**:
   - Calculates distance in km using the **Haversine formula** between current and previous successful login geolocations.
   - Computes implied speed $v = d / \Delta t$. If implied speed $> 800$ km/h (and distance $> 50$ km), fires a High-Severity Alert and auto-locks the user account.

3. **💻 New Device Signature Fingerprint (Medium Severity)**:
   - Compares client browser and OS fingerprint against `knownDevices` stored in `users/{userId}`.
   - Creates a Medium-Severity Alert if an unrecognized device is detected.

4. **🌙 Unusual Operating Hours Detection (Low Severity)**:
   - Flags authentication events occurring between 01:00 AM and 05:00 AM outside standard operating hours.

---

## 🎨 Glassmorphism & Modern SOC Aesthetics

- **Frosted Glass Cards & Panels**: Built with `bg-white/10`, `backdrop-blur-xl`, `border-white/15`, and soft rounded corners (`rounded-2xl`).
- **Severity-Tinted Glowing Cards**:
  - 🔴 **High Severity Alert**: Glowing Red Tint (`bg-red-500/10`, `border-red-500/30`, `glow-severity-high`)
  - 🟡 **Medium Severity Alert**: Glowing Yellow Tint (`bg-amber-500/10`, `border-amber-500/30`, `glow-severity-medium`)
  - 🔵 **Low Severity Alert**: Glowing Cyan Tint (`bg-cyan-500/10`, `border-cyan-500/30`, `glow-severity-low`)

---

## 🚀 How to Run & Connect Firebase

### 1. Run Locally in Standalone Demo Mode
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the dashboard immediately!

---

### 2. Connect your Live Firebase Project (Free Spark Plan)

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Authentication** (Email/Password) and **Cloud Firestore**.
3. Create a `.env` file in the `frontend` folder ([frontend/.env](file:///c:/Users/harini/Desktop/Real-time%20authentication%20monitoring%20&%20threat%20detection%20system/frontend/.env)):
   ```env
  ## ⚙️ Firebase Configuration

Add this configuration to your Firebase initialization file:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBHWVEDxDAhk69MlB9rIkHcUcYnsixxKz8",
  authDomain: "auth-threat-monitor-70301.firebaseapp.com",
  projectId: "auth-threat-monitor-70301",
  storageBucket: "auth-threat-monitor-70301.firebasestorage.app",
  messagingSenderId: "379409973675",
  appId: "1:379409973675:web:8f644971b11026f60a52ee",
  measurementId: "G-JPDLZ7W9V2"
};

   ```
4. Deploy Firestore Rules:
   ```bash
   npx firebase deploy --only firestore:rules
   ```

---

## 📄 License
MIT License

## 👥 Enterprise Employee & Role Management

The system provides a centralized enterprise employee management module where authorized administrators can monitor and manage employee accounts, assigned roles, departments, devices, authentication activity, and security status in real time.

The platform supports **50 enterprise employees** distributed across different organizational roles and departments. Each role has a dedicated dashboard with role-specific permissions, features, and monitoring capabilities.

### 🏢 Employee Management

The Employee Management dashboard provides a complete overview of all 50 employees, including:

- Employee Name
- Employee ID
- Email Address
- Department
- Assigned Role
- Account Status
- Security Status
- Device Information
- Browser & Operating System
- IP Address
- Last Login
- Last Logout
- Login History
- Authentication Activity
- Assigned Devices
- Profile & Security History

Administrators can search and filter employees by name, employee ID, email, department, role, and account status.

---

## 🔐 Role-Based Dashboards

The platform implements **Role-Based Access Control (RBAC)**. When a user logs in, the system identifies their assigned role and automatically provides the appropriate dashboard and permissions.

Different roles see different dashboards, features, and security controls.

## authentication page:

![image alt](https://github.com/harini426/real-time-authentication-monitoring-system/blob/main/Screenshot%202026-08-08%20095039.png?raw=true)


### 👤 1. Employee Dashboard

The Employee dashboard is designed for normal enterprise users.

Employees can:

- View their personal profile
- View assigned department and role
- View login and logout history
- View active sessions
- View registered devices
- View recent authentication activity
- View account security status
- Update permitted profile information
- Logout from active sessions

Employees cannot access administrative controls or other employees' sensitive information.

---

### 🛡️ 2. SOC Analyst L1 Dashboard

The SOC Analyst L1 dashboard focuses on first-level security monitoring and alert triage.

SOC Analyst L1 can:

- Monitor real-time authentication events
- View failed and successful login attempts
- Monitor active employee sessions
- Identify suspicious login activity
- Review security alerts
- Investigate brute-force attempts
- Detect unusual authentication patterns
- Perform initial alert triage
- Monitor IP addresses and locations
- Escalate suspicious incidents to L2

The L1 analyst primarily handles initial detection, monitoring, validation, and escalation.

---

### 🔎 3. SOC Analyst L2 Dashboard

The SOC Analyst L2 dashboard provides advanced investigation capabilities.

SOC Analyst L2 can:

- Investigate escalated security alerts
- Analyze authentication history
- Investigate suspicious IP addresses
- Review device and browser changes
- Analyze impossible-travel events
- Investigate repeated failed logins
- Correlate multiple authentication events
- Perform deeper threat analysis
- Validate incident severity
- Escalate confirmed incidents to Incident Response

L2 analysts have broader investigation permissions than L1 analysts.

---

### 🚨 4. Incident Responder Dashboard

The Incident Responder dashboard focuses on handling confirmed security incidents.

Incident Responders can:

- View confirmed security incidents
- Investigate affected employee accounts
- Review complete authentication history
- Analyze suspicious sessions
- Identify affected devices
- Contain compromised accounts
- Terminate suspicious sessions
- Coordinate incident response activities
- Track incident status
- Document investigation actions
- Close incidents after resolution

The Incident Responder focuses on containment, investigation, remediation, and recovery.

---

### ⚙️ 5. Security Administrator Dashboard

The Security Administrator dashboard provides security and access management capabilities.

Security Administrators can:

- Manage employee accounts
- Assign and modify roles
- Enable or disable employee accounts
- Lock suspicious accounts
- Unlock accounts after verification
- Manage assigned devices
- Review security policies
- Monitor authentication controls
- Review employee security history
- Manage access permissions
- Monitor security configuration

Security Administrators are responsible for maintaining secure access and enforcing organizational security policies.

---

### 👑 6. Super Admin Dashboard

The Super Admin has the highest level of administrative access.

The Super Admin can:

- View the complete enterprise dashboard
- Monitor all 50 employees
- View all departments and roles
- Create employee accounts
- Assign roles and departments
- Modify employee information
- Enable or disable accounts
- Lock and unlock accounts
- Manage administrative access
- Monitor all authentication activities
- View security alerts and threats
- Configure security policies
- Monitor system-wide security status
- Review audit logs
- Manage role permissions
- Monitor SOC operations

The Super Admin dashboard provides centralized visibility and control over the entire authentication monitoring and threat detection platform.

---
## super admin dashboard:

![image alt](https://github.com/harini426/real-time-authentication-monitoring-system/blob/main/Screenshot%202026-08-08%20095126.png?raw=true)
![image alt](https://raw.githubusercontent.com/harini426/real-time-authentication-monitoring-system/7a2b62eb46557f2bf95b5abb7651f5a2d27c0e4d/Screenshot%202026-08-08%20095143.png)
![image alt](https://github.com/harini426/real-time-authentication-monitoring-system/blob/main/Screenshot%202026-08-08%20095205.png?raw=true)
![image alt](https://github.com/harini426/real-time-authentication-monitoring-system/blob/main/Screenshot%202026-08-08%20122909.png?raw=true)
![image alt](https://github.com/harini426/real-time-authentication-monitoring-system/blob/main/Screenshot%202026-08-08%20095346.png?raw=true)


## 🏢 Enterprise Employee Distribution

The system simulates an enterprise environment with **50 employees** distributed across multiple departments and security roles.

Example organizational distribution:

| Role | Employees | Primary Responsibility |
|------|-----------|------------------------|
| Employee | 35 | Normal business operations |
| SOC Analyst L1 | 5 | Security monitoring & alert triage |
| SOC Analyst L2 | 3 | Advanced security investigation |
| Incident Responder | 2 | Incident containment & response |
| Security Administrator | 3 | Security & access management |
| Super Admin | 2 | Enterprise-wide administration |
| **Total** | **50** | **Complete Enterprise Environment** |

---

## 📊 Role-Based Dashboard Behavior

Each user receives a different dashboard based on their assigned role.

For example:

**Employee Login**
→ Employee Dashboard  
→ Personal profile & authentication history

**SOC Analyst L1 Login**
→ SOC Monitoring Dashboard  
→ Alerts, authentication events & initial investigation

**SOC Analyst L2 Login**
→ Advanced Investigation Dashboard  
→ Threat analysis & incident investigation

**Incident Responder Login**
→ Incident Response Dashboard  
→ Containment & remediation

**Security Administrator Login**
→ Security Administration Dashboard  
→ Account, role & policy management

**Super Admin Login**
→ Enterprise Administration Dashboard  
→ Complete system visibility & control

This role-based architecture ensures that users only access the features and information required for their responsibilities.

---

## 🔍 Employee Profile & Security History

Each employee has a dedicated profile containing authentication and security information.

The profile can include:

- Employee ID
- Full Name
- Corporate Email
- Department
- Job Role
- Account Status
- Security Status
- IP Address
- Location
- Browser
- Operating System
- Device Type
- Last Login
- Last Logout
- Login Attempts
- Failed Login Attempts
- Active Sessions
- Registered Devices
- Security Alerts
- Authentication History
- Administrative Actions

Authorized administrators can inspect an employee's profile and security history to understand account activity and investigate suspicious behavior.

---

## 🛡️ Access Control & Security

The system follows the principle of **least privilege**, ensuring that every role receives only the permissions required for its responsibilities.

Role-based restrictions prevent normal employees from accessing administrative functions, while security teams receive appropriate monitoring and investigation capabilities.

All important administrative and security actions can be tracked through the system's audit and activity monitoring mechanisms.

---

## 🎯 Enterprise Monitoring Objective

The objective of the role-based architecture is to simulate how an enterprise Security Operations Center monitors employee authentication activities, investigates suspicious behavior, manages security incidents, and controls access across the organization.

The system combines:

- Real-time authentication monitoring
- Role-Based Access Control
- Employee management
- Security alert monitoring
- Threat detection
- Authentication history
- Device monitoring
- IP and location analysis
- Incident investigation
- Account security management
- Enterprise-wide administrative control
- 










