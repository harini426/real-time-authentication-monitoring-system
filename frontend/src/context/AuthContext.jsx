import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db, isConfigured } from "../firebase/config";
import { getClientTelemetry } from "../services/telemetryService";
import { evaluateLoginAttempt } from "../services/detectionEngine";
import { 
  RBAC_ROLES, 
  ROLE_PERMISSIONS, 
  generateEnterpriseEmployees, 
  generateInitialTelemetry 
} from "../services/enterpriseData";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(RBAC_ROLES.SUPER_ADMIN); // Active system role

  // Real-time State
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeTelemetry, setActiveTelemetry] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);

  // Fetch Client Telemetry on Mount
  useEffect(() => {
    getClientTelemetry().then((telemetry) => {
      setActiveTelemetry(telemetry);
    });
  }, []);

  // Sync role whenever currentUser changes
  useEffect(() => {
    if (currentUser?.role) {
      setRole(currentUser.role);
    }
  }, [currentUser]);

  // Seed Data Generator for Local State & Firestore Initialization
  const initializeSeedDataset = () => {
    const seedEmployees = generateEnterpriseEmployees();
    const seedAttempts = generateInitialTelemetry(seedEmployees);

    const seedAlerts = [
      {
        id: "alt_seed_201",
        threatType: "impossible_travel",
        title: "Impossible Travel Velocity Anomaly",
        severity: "high",
        empId: "EMP-10001",
        empName: "Alex Mercer",
        email: "alex.cyber@company.com",
        user: "alex.cyber@company.com",
        name: "Alex Mercer",
        ip: "203.0.113.195",
        device: "Chrome Enterprise 126.0 on macOS Sequoia",
        browser: "Chrome Enterprise",
        os: "macOS Sequoia",
        location: "Tokyo, Japan",
        time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: "active",
        assignedAnalyst: "Unassigned",
        investigationNotes: [
          {
            id: "n1",
            author: "System Threat Engine",
            text: "Triggered travel speed check (>49,000 km/h) between San Francisco and Tokyo.",
            timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString()
          }
        ],
        details: {
          distanceKm: 8270,
          timeDiffMinutes: 10,
          impliedSpeedKmh: 49620,
          fromLocation: "San Francisco, United States",
          toLocation: "Tokyo, Japan",
          reason: "Impossible Travel: Alex Mercer (EMP-10001) authenticated from Tokyo, Japan 10 mins after San Francisco, United States (8,270 km away)."
        }
      },
      {
        id: "alt_seed_202",
        threatType: "brute_force",
        title: "Critical Brute Force Attack Detected",
        severity: "critical",
        empId: "EMP-10004",
        empName: "Target Victim Account",
        email: "target.user@corp.internal",
        user: "target.user@corp.internal",
        name: "Target Victim Account",
        ip: "185.220.101.5",
        device: "Python-urllib/3.10 (Bot Scanner)",
        browser: "Bot Scanner",
        os: "Linux",
        location: "Moscow, Russia",
        time: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        status: "investigating",
        assignedAnalyst: "Alex Mercer (Super Admin)",
        investigationNotes: [
          {
            id: "n2",
            author: "Alex Mercer (Super Admin)",
            text: "Account automatically locked by Threat Engine. IP 185.220.101.5 added to threat intelligence watchlist.",
            timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString()
          }
        ],
        details: {
          failedCount: 5,
          timeWindow: "5 minutes",
          targetEmail: "target.user@corp.internal",
          lastIp: "185.220.101.5",
          reason: "Brute Force Attack: 5 rapid failed logins targeting Target Victim Account (EMP-10004)."
        }
      },
      {
        id: "alt_seed_203",
        threatType: "new_device",
        title: "Unrecognized Device Signature Alert",
        severity: "medium",
        empId: "EMP-10002",
        empName: "Sarah Jenkins",
        email: "admin@soc.io",
        user: "admin@soc.io",
        name: "Sarah Jenkins",
        ip: "103.21.244.0",
        device: "Opera 109.0 on Linux x86_64",
        browser: "Opera",
        os: "Ubuntu Linux",
        location: "Sydney, Australia",
        time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        status: "active",
        assignedAnalyst: "Unassigned",
        investigationNotes: [],
        details: {
          device: "Opera 109.0 on Linux x86_64",
          reason: "Unrecognized Device Alert: Authentication attempt from unverified device fingerprint."
        }
      },
      {
        id: "alt_seed_204",
        threatType: "off_hours",
        title: "Off-Hours Workforce Authentication",
        severity: "low",
        empId: "EMP-10005",
        empName: "Ananya Roy",
        email: "ananya.roy@corp.internal",
        user: "ananya.roy@corp.internal",
        name: "Ananya Roy",
        ip: "103.45.89.12",
        device: "Edge 126.0 on Windows 11 Enterprise",
        browser: "Microsoft Edge Enterprise",
        os: "Windows 11 Enterprise",
        location: "Hyderabad, India",
        time: new Date(new Date().setHours(3, 14, 0, 0)).toISOString(),
        timestamp: new Date(new Date().setHours(3, 14, 0, 0)).toISOString(),
        status: "resolved",
        assignedAnalyst: "Sarah Jenkins (Sec Admin)",
        investigationNotes: [
          {
            id: "n3",
            author: "Sarah Jenkins (Sec Admin)",
            text: "Confirmed planned off-hours database maintenance with HR team.",
            timestamp: new Date().toISOString()
          }
        ],
        details: {
          hour: 3,
          formattedTime: "03:14:00 AM",
          reason: "Off-Hours Login: Ananya Roy (EMP-10005) authenticated at 03:14 AM (outside business hours)."
        }
      }
    ];

    setUsersList(seedEmployees);
    setLoginAttempts(seedAttempts);
    setAlerts(seedAlerts);

    // Initial Active Sessions
    const active = seedAttempts
      .filter((a) => a.status === "success" && !a.logoutTime)
      .map((a) => ({
        sessionId: a.sessionId || `sess_${a.id}`,
        empId: a.empId,
        empName: a.name,
        email: a.email,
        loginTime: a.loginTime || a.timestamp,
        ip: a.ip,
        device: a.device,
        location: `${a.city}, ${a.country}`
      }));
    setActiveSessions(active);

    return { seedEmployees, seedAttempts, seedAlerts };
  };

  // Real-time Firestore Listeners with automatic seeding
  useEffect(() => {
    if (!isConfigured) {
      console.log("Firestore not configured: Loading enterprise seed dataset.");
      const { seedEmployees } = initializeSeedDataset();
      setCurrentUser(seedEmployees[0]);
      setLoading(false);
      return;
    }

    try {
      // Seed Firestore if empty
      const seedIfEmpty = async () => {
        try {
          const userSnap = await getDocs(query(collection(db, "users"), limit(1)));
          if (userSnap.empty) {
            console.log("Seeding Firestore with enterprise employees & telemetry...");
            const { seedEmployees, seedAttempts, seedAlerts } = initializeSeedDataset();
            for (const emp of seedEmployees) {
              await setDoc(doc(db, "users", emp.id), emp);
            }
            for (const att of seedAttempts) {
              await addDoc(collection(db, "authEvents"), att);
            }
            for (const alt of seedAlerts) {
              await addDoc(collection(db, "alerts"), alt);
            }
          }
        } catch (e) {
          console.warn("Firestore seed check notice:", e);
        }
      };
      seedIfEmpty();

      // 1. Listen to Auth Events
      const qEvents = query(collection(db, "authEvents"), orderBy("timestamp", "desc"), limit(100));
      const unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
        if (!snapshot.empty) {
          const events = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate().toISOString() : doc.data().timestamp
          }));
          setLoginAttempts(events);

          // Compute Active Sessions
          const active = events
            .filter((a) => a.status === "success" && !a.logoutTime)
            .map((a) => ({
              sessionId: a.sessionId || `sess_${a.id}`,
              empId: a.empId,
              empName: a.name || a.empName,
              email: a.email,
              loginTime: a.loginTime || a.timestamp,
              ip: a.ip,
              device: a.device,
              location: a.location || `${a.city || ''}, ${a.country || ''}`
            }));
          setActiveSessions(active);
        }
      }, (err) => {
        console.warn("Firestore authEvents snapshot fallback:", err);
      });

      // 2. Listen to Alerts
      const qAlerts = query(collection(db, "alerts"), orderBy("timestamp", "desc"), limit(100));
      const unsubscribeAlerts = onSnapshot(qAlerts, (snapshot) => {
        if (!snapshot.empty) {
          const altList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate().toISOString() : doc.data().timestamp
          }));
          setAlerts(altList);
        }
      }, (err) => {
        console.warn("Firestore alerts snapshot fallback:", err);
      });

      // 3. Listen to Users
      const qUsers = collection(db, "users");
      const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
        if (!snapshot.empty) {
          const uList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUsersList(uList);
        }
      }, (err) => {
        console.warn("Firestore users snapshot fallback:", err);
      });

      // Firebase Auth Listener
      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              setCurrentUser({ id: user.uid, ...userSnap.data() });
            } else {
              const matchedEmp = usersList.find((u) => u.email?.toLowerCase() === user.email?.toLowerCase());
              setCurrentUser(matchedEmp || { id: user.uid, email: user.email, name: user.displayName || user.email.split("@")[0], role: RBAC_ROLES.SUPER_ADMIN });
            }
          } catch (e) {
            setCurrentUser({ id: user.uid, email: user.email, name: user.email.split("@")[0], role: RBAC_ROLES.SUPER_ADMIN });
          }
        } else {
          setCurrentUser((prev) => prev || {
            id: "emp_10001",
            empId: "EMP-10001",
            email: "alex.cyber@company.com",
            name: "Alex Mercer",
            role: RBAC_ROLES.SUPER_ADMIN,
            accountStatus: "Active",
            department: "Cybersecurity / SOC",
            designation: "Lead SOC Architect"
          });
        }
        setLoading(false);
      });

      return () => {
        unsubscribeEvents();
        unsubscribeAlerts();
        unsubscribeUsers();
        unsubscribeAuth();
      };
    } catch (err) {
      console.warn("Firebase initialization notice, using local seed:", err);
      const { seedEmployees } = initializeSeedDataset();
      setCurrentUser(seedEmployees[0]);
      setLoading(false);
    }
  }, []);

  /**
   * Check permission helper
   */
  const hasPermission = (permName) => {
    const currentRole = currentUser?.role || role || RBAC_ROLES.EMPLOYEE;
    const perms = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS[RBAC_ROLES.EMPLOYEE];
    return Boolean(perms[permName]);
  };

  /**
   * Log Login / Logout Authentication Event & Trigger Threat Detection
   */
  const recordLoginAttempt = async (attemptData) => {
    if (!attemptData) return;
    const telemetry = activeTelemetry || await getClientTelemetry();
    
    const userObj = usersList.find(
      (u) => u && (u.email?.toLowerCase() === attemptData.email?.toLowerCase() || u.empId === attemptData.empId || u.id === attemptData.userId)
    ) || currentUser;

    const empIdVal = attemptData.empId || userObj?.empId || "EMP-10001";
    const empNameVal = attemptData.name || attemptData.empName || userObj?.name || (attemptData.email || "user").split("@")[0];

    const newAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      empId: empIdVal,
      empName: empNameVal,
      name: empNameVal,
      userId: attemptData.userId || userObj?.id || null,
      email: attemptData.email || userObj?.email || "unknown@company.com",
      loginTime: attemptData.loginTime || attemptData.timestamp || new Date().toISOString(),
      logoutTime: attemptData.logoutTime || null,
      status: attemptData.status || "success",
      failedCount: attemptData.failedCount || (attemptData.status === "failed" ? 1 : 0),
      ip: attemptData.ip || telemetry?.ip || "198.51.100.42",
      browser: attemptData.browser || telemetry?.browser || "Chrome Enterprise",
      browserVersion: attemptData.browserVersion || telemetry?.browserVersion || "126.0",
      os: attemptData.os || telemetry?.os || "Windows 11 Enterprise",
      deviceType: attemptData.deviceType || telemetry?.deviceType || "Desktop",
      deviceFingerprint: attemptData.deviceFingerprint || telemetry?.deviceFingerprint || "fp_hash_default",
      screenResolution: attemptData.screenResolution || telemetry?.screenResolution || "1920x1080",
      timeZone: attemptData.timeZone || telemetry?.timeZone || "Asia/Kolkata",
      language: attemptData.language || telemetry?.language || "en-US",
      latitude: attemptData.latitude ?? telemetry?.latitude ?? 37.3382,
      longitude: attemptData.longitude ?? telemetry?.longitude ?? -121.8863,
      country: attemptData.country || telemetry?.country || "United States",
      state: attemptData.state || telemetry?.state || "California",
      city: attemptData.city || telemetry?.city || "San Jose",
      isp: attemptData.isp || telemetry?.isp || "Corporate Fiber Enterprise",
      vpnDetected: attemptData.vpnDetected ?? telemetry?.vpnDetected ?? false,
      proxyDetected: attemptData.proxyDetected ?? telemetry?.proxyDetected ?? false,
      sessionId: attemptData.sessionId || telemetry?.sessionId || `sess_${Date.now()}`,
      networkType: attemptData.networkType || telemetry?.networkType || "Corporate Wi-Fi",
      device: attemptData.device || telemetry?.deviceInfo || "Chrome Enterprise on Windows 11",
      deviceInfo: attemptData.deviceInfo || telemetry?.deviceInfo || "Chrome Enterprise on Windows 11",
      location: attemptData.location || `${telemetry?.city || 'San Jose'}, ${telemetry?.country || 'United States'}`,
      timestamp: attemptData.timestamp || new Date().toISOString()
    };

    // 1. Local state update
    setLoginAttempts((prev) => [newAttempt, ...prev]);

    // 2. Evaluate Threat Engine
    const { alertsToCreate, lockAccount } = evaluateLoginAttempt(newAttempt, [newAttempt, ...loginAttempts], userObj);

    if (alertsToCreate.length > 0) {
      setAlerts((prev) => [...alertsToCreate, ...prev]);
    }

    if (lockAccount && userObj) {
      setUsersList((prev) =>
        prev.map((u) =>
          u && (u.email?.toLowerCase() === userObj.email?.toLowerCase() || u.id === userObj.id || u.empId === userObj.empId)
            ? { ...u, locked: true, accountStatus: "Locked", lockedReason: "Account locked automatically by Threat Detection Engine (Security Threat Detected)" }
            : u
        )
      );
    }

    // 3. Write to Firestore if configured
    if (isConfigured) {
      try {
        await addDoc(collection(db, "authEvents"), {
          ...newAttempt,
          timestamp: serverTimestamp()
        });

        for (const alert of alertsToCreate) {
          await addDoc(collection(db, "alerts"), {
            ...alert,
            timestamp: serverTimestamp()
          });
        }

        if (lockAccount && userObj?.id) {
          try {
            await updateDoc(doc(db, "users", userObj.id), {
              locked: true,
              accountStatus: "Locked",
              lockedReason: "Automated threat response (Critical/High Severity Alert)"
            });
          } catch (err) {}
        }
      } catch (e) {
        console.warn("Firestore write notice:", e);
      }
    }

    return { newAttempt, alertsToCreate, lockAccount };
  };

  /**
   * Firebase User Signup
   */
  const signup = async (email, password, name, department, designation, userRole) => {
    const telemetry = activeTelemetry || await getClientTelemetry();
    const empNum = 10050 + usersList.length;
    const empId = `EMP-${empNum}`;
    let userId = `user_${Date.now()}`;

    if (isConfigured) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        userId = userCred.user.uid;
        await sendEmailVerification(userCred.user);
      } catch (err) {
        console.warn("Firebase auth signup error:", err);
      }
    }

    const newUser = {
      id: userId,
      empId,
      email,
      name: name || email.split("@")[0],
      department: department || "Cybersecurity / SOC",
      designation: designation || "SOC Analyst",
      team: "Security Incident Response",
      officeLocation: `${telemetry.city}, ${telemetry.country}`,
      city: telemetry.city,
      country: telemetry.country,
      manager: "Sarah Jenkins",
      role: userRole || RBAC_ROLES.EMPLOYEE,
      accountStatus: "Active",
      locked: false,
      disabled: false,
      assignedDevices: [telemetry.deviceInfo],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    setUsersList((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    if (isConfigured) {
      try {
        await setDoc(doc(db, "users", userId), newUser);
      } catch (e) {}
    }

    await recordLoginAttempt({
      empId,
      userId,
      email,
      name: newUser.name,
      status: "success",
      device: telemetry.deviceInfo,
      location: `${telemetry.city}, ${telemetry.country}`,
      ip: telemetry.ip
    });

    return newUser;
  };

  /**
   * Firebase User Login
   */
  const login = async (email, password, rememberDevice = true) => {
    const telemetry = activeTelemetry || await getClientTelemetry();
    const existingUser = usersList.find((u) => u && u.email?.toLowerCase() === email?.toLowerCase());

    if (existingUser && (existingUser.locked || existingUser.disabled || existingUser.accountStatus === "Locked" || existingUser.accountStatus === "Disabled")) {
      const isDis = existingUser.disabled || existingUser.accountStatus === "Disabled";
      await recordLoginAttempt({
        empId: existingUser.empId,
        userId: existingUser.id,
        email,
        name: existingUser.name,
        status: "failed",
        device: telemetry.deviceInfo,
        location: `${telemetry.city}, ${telemetry.country}`,
        ip: telemetry.ip
      });
      throw new Error(`SECURITY EXCEPTION: Account is ${isDis ? 'DISABLED' : 'LOCKED'}. ${existingUser.lockedReason || existingUser.disabledReason || "Contact Security Administrator."}`);
    }

    let authUser = null;
    if (isConfigured) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        authUser = res.user;
      } catch (err) {
        await recordLoginAttempt({
          empId: existingUser ? existingUser.empId : "EMP-UNKNOWN",
          userId: existingUser ? existingUser.id : null,
          email,
          name: existingUser ? existingUser.name : email.split("@")[0],
          status: "failed",
          device: telemetry.deviceInfo,
          location: `${telemetry.city}, ${telemetry.country}`,
          ip: telemetry.ip
        });
        throw new Error("Invalid credentials provided.");
      }
    }

    const userObj = existingUser || {
      id: authUser ? authUser.uid : `user_${Date.now()}`,
      empId: `EMP-${Math.floor(10000 + Math.random() * 9000)}`,
      email,
      name: email.split("@")[0],
      department: "Cybersecurity / SOC",
      designation: "SOC Analyst",
      team: "Threat Operations",
      officeLocation: `${telemetry.city}, ${telemetry.country}`,
      role: email.includes("admin") ? RBAC_ROLES.SUPER_ADMIN : RBAC_ROLES.SOC_ANALYST_L1,
      accountStatus: "Active",
      locked: false,
      disabled: false,
      assignedDevices: [telemetry.deviceInfo]
    };

    if (rememberDevice) {
      localStorage.setItem("soc_remembered_device", telemetry.deviceFingerprint);
    }

    setCurrentUser(userObj);

    await recordLoginAttempt({
      empId: userObj.empId,
      userId: userObj.id,
      email,
      name: userObj.name,
      status: "success",
      device: telemetry.deviceInfo,
      location: `${telemetry.city}, ${telemetry.country}`,
      ip: telemetry.ip
    });

    return userObj;
  };

  /**
   * Password Reset
   */
  const resetPassword = async (email) => {
    if (isConfigured) {
      await sendPasswordResetEmail(auth, email);
    }
    return true;
  };

  /**
   * Demo Switch Role for quick testing
   */
  const switchRole = (newRole) => {
    setRole(newRole);
    if (currentUser) {
      setCurrentUser((prev) => prev ? ({ ...prev, role: newRole }) : null);
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    if (currentUser) {
      await recordLoginAttempt({
        empId: currentUser.empId,
        userId: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        status: "success",
        logoutTime: new Date().toISOString(),
        device: activeTelemetry?.deviceInfo || "Browser Client"
      });
    }

    if (isConfigured) {
      try {
        await signOut(auth);
      } catch (e) {}
    }
    setCurrentUser(null);
  };

  // -------------------------------------------------------------
  // ALERT MANAGEMENT ACTIONS
  // -------------------------------------------------------------
  const investigateAlert = async (alertId, analystName) => {
    const assigned = analystName || currentUser?.name || "SOC Analyst";
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "investigating", assignedAnalyst: assigned } : a))
    );
    if (isConfigured) {
      try {
        await updateDoc(doc(db, "alerts", alertId), { status: "investigating", assignedAnalyst: assigned });
      } catch (e) {}
    }
  };

  const resolveAlert = async (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "resolved", resolved: true } : a))
    );
    if (isConfigured) {
      try {
        await updateDoc(doc(db, "alerts", alertId), { status: "resolved", resolved: true });
      } catch (e) {}
    }
  };

  const ignoreAlert = async (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "ignored" } : a))
    );
    if (isConfigured) {
      try {
        await updateDoc(doc(db, "alerts", alertId), { status: "ignored" });
      } catch (e) {}
    }
  };

  const escalateAlert = async (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          return {
            ...a,
            status: "escalated",
            severity: "critical",
            details: { ...a.details, reason: `[ESCALATED] ${a.details?.reason || 'Escalated to High Severity Incident'}` }
          };
        }
        return a;
      })
    );
    if (isConfigured) {
      try {
        await updateDoc(doc(db, "alerts", alertId), { status: "escalated", severity: "critical" });
      } catch (e) {}
    }
  };

  const assignAnalyst = async (alertId, analystName) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, assignedAnalyst: analystName } : a))
    );
    if (isConfigured) {
      try {
        await updateDoc(doc(db, "alerts", alertId), { assignedAnalyst: analystName });
      } catch (e) {}
    }
  };

  const addInvestigationNote = async (alertId, noteText) => {
    const author = currentUser?.name ? `${currentUser.name} (${currentUser.role || 'Analyst'})` : "SOC Analyst";
    const newNote = {
      id: `note_${Date.now()}`,
      author,
      text: noteText,
      timestamp: new Date().toISOString()
    };

    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const notes = a.investigationNotes || [];
          return { ...a, investigationNotes: [newNote, ...notes] };
        }
        return a;
      })
    );

    if (isConfigured) {
      try {
        const targetAlert = alerts.find((a) => a.id === alertId);
        const existingNotes = targetAlert?.investigationNotes || [];
        await updateDoc(doc(db, "alerts", alertId), { investigationNotes: [newNote, ...existingNotes] });
      } catch (e) {}
    }
  };

  // -------------------------------------------------------------
  // EMPLOYEE MANAGEMENT ACTIONS
  // -------------------------------------------------------------
  const lockUser = async (empIdOrEmail, reason) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u && (u.id === empIdOrEmail || u.empId === empIdOrEmail || u.email === empIdOrEmail)
          ? { ...u, locked: true, accountStatus: "Locked", lockedReason: reason || "Locked by Security Administrator" }
          : u
      )
    );
    if (isConfigured) {
      try {
        await updateDoc(doc(db, "users", empIdOrEmail), { locked: true, accountStatus: "Locked", lockedReason: reason || "Locked by Security Administrator" });
      } catch (e) {}
    }
  };

  const unlockUser = async (empIdOrEmail) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u && (u.id === empIdOrEmail || u.empId === empIdOrEmail || u.email === empIdOrEmail)
          ? { ...u, locked: false, accountStatus: "Active", lockedReason: null }
          : u
      )
    );
    if (isConfigured) {
      try {
        await updateDoc(doc(db, "users", empIdOrEmail), { locked: false, accountStatus: "Active", lockedReason: null });
      } catch (e) {}
    }
  };

  const disableUser = async (empIdOrEmail, reason) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u && (u.id === empIdOrEmail || u.empId === empIdOrEmail || u.email === empIdOrEmail)
          ? { ...u, disabled: true, accountStatus: "Disabled", disabledReason: reason || "Deactivated by HR Policy" }
          : u
      )
    );
    if (isConfigured) {
      try {
        await updateDoc(doc(db, "users", empIdOrEmail), { disabled: true, accountStatus: "Disabled", disabledReason: reason || "Deactivated by HR Policy" });
      } catch (e) {}
    }
  };

  const enableUser = async (empIdOrEmail) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u && (u.id === empIdOrEmail || u.empId === empIdOrEmail || u.email === empIdOrEmail)
          ? { ...u, disabled: false, accountStatus: "Active", disabledReason: null }
          : u
      )
    );
    if (isConfigured) {
      try {
        await updateDoc(doc(db, "users", empIdOrEmail), { disabled: false, accountStatus: "Active", disabledReason: null });
      } catch (e) {}
    }
  };

  const updateEmployeeRole = async (empIdOrEmail, newRole) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u && (u.id === empIdOrEmail || u.empId === empIdOrEmail || u.email === empIdOrEmail)
          ? { ...u, role: newRole }
          : u
      )
    );
    if (isConfigured) {
      try {
        await updateDoc(doc(db, "users", empIdOrEmail), { role: newRole });
      } catch (e) {}
    }
  };

  const terminateSession = (sessionId) => {
    setActiveSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
  };

  const value = {
    currentUser,
    loading,
    role,
    setRole,
    switchRole,
    hasPermission,
    loginAttempts,
    alerts,
    usersList,
    activeSessions,
    activeTelemetry,
    login,
    signup,
    resetPassword,
    logout,
    recordLoginAttempt,
    investigateAlert,
    resolveAlert,
    ignoreAlert,
    escalateAlert,
    assignAnalyst,
    addInvestigationNote,
    lockUser,
    unlockUser,
    disableUser,
    enableUser,
    updateEmployeeRole,
    terminateSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
