import { calculateHaversineDistance } from "./telemetryService";

/**
 * Enterprise SOC Threat Detection Engine
 * Evaluates authentication telemetry events against 11 Cyber Threat Rules:
 * 1. Brute Force Attack (5 failed logins / 5 min) -> CRITICAL
 * 2. Impossible Travel Velocity (> 800 km/h) -> HIGH
 * 3. New Device / Unrecognized Fingerprint -> MEDIUM
 * 4. Off-Hours Access (12 AM - 5 AM) -> LOW
 * 5. Multiple Country Logins (15 min window) -> HIGH
 * 6. Multiple IP Logins (10 min window) -> MEDIUM
 * 7. VPN or Proxy Tunnel Detection -> MEDIUM
 * 8. Disabled Employee Access Attempt -> CRITICAL
 * 9. Locked Account Access Attempt -> CRITICAL
 * 10. Unusual Login Frequency (> 10 logins / 10 min) -> MEDIUM
 * 11. Impossible Rapid OS Device Switching -> HIGH
 */
export function evaluateLoginAttempt(newAttempt, allAttempts = [], user = null) {
  const alertsToCreate = [];
  let lockAccount = false;

  if (!newAttempt) return { alertsToCreate, lockAccount };

  const {
    empId,
    userId,
    email,
    name,
    timestamp,
    loginTime,
    ip,
    isp,
    vpnDetected,
    proxyDetected,
    browser,
    browserVersion,
    os,
    device,
    deviceInfo,
    deviceFingerprint,
    status,
    location,
    city,
    country
  } = newAttempt;

  const attemptTime = new Date(timestamp || loginTime || Date.now());
  const deviceStr = deviceInfo || device || `${browser || 'Chrome Enterprise'} on ${os || 'Windows 11 Enterprise'}`;
  const targetEmail = (email || user?.email || "unknown@corp.internal").toLowerCase();
  const empIdVal = empId || user?.empId || "EMP-10001";
  const empNameVal = name || user?.name || targetEmail.split("@")[0];
  const employeeLabel = `${empNameVal} (${empIdVal})`;
  const locStr = location
    ? (typeof location === 'string' ? location : `${location.city || city || ""}, ${location.country || country || ""}`)
    : `${city || 'San Jose'}, ${country || 'United States'}`;

  const baseAlertFields = {
    empId: empIdVal,
    empName: empNameVal,
    userId: userId || user?.id,
    email: targetEmail,
    user: targetEmail,
    name: empNameVal,
    ip: ip || "198.51.100.42",
    device: deviceStr,
    browser: browser || "Chrome Enterprise",
    os: os || "Windows 11 Enterprise",
    location: locStr,
    time: attemptTime.toISOString(),
    timestamp: attemptTime.toISOString(),
    status: "active",
    assignedAnalyst: "Unassigned",
    investigationNotes: []
  };

  // -------------------------------------------------------------
  // RULE 1: BRUTE FORCE ATTACK (5 failed attempts within 5 mins) -> CRITICAL
  // -------------------------------------------------------------
  const fiveMinsAgo = new Date(attemptTime.getTime() - 5 * 60 * 1000);
  const recentFailures = allAttempts.filter((a) => {
    if (!a) return false;
    const aTime = new Date(a.timestamp || a.loginTime || Date.now());
    const aEmail = (a.email || "").toLowerCase();
    const sameTarget = (userId && a.userId === userId) || (targetEmail && aEmail === targetEmail);
    return sameTarget && a.status === "failed" && aTime >= fiveMinsAgo && aTime <= attemptTime;
  });

  const totalFailedCount = status === "failed"
    ? recentFailures.length + (recentFailures.some((f) => f.id === newAttempt.id) ? 0 : 1)
    : recentFailures.length;

  if (totalFailedCount >= 5) {
    alertsToCreate.push({
      ...baseAlertFields,
      id: `alt_bf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      threatType: "brute_force",
      title: "Critical Brute Force Attack Detected",
      severity: "critical",
      details: {
        failedCount: totalFailedCount,
        timeWindow: "5 minutes",
        targetEmail,
        lastIp: ip,
        reason: `Brute Force Attack: ${totalFailedCount} rapid failed logins targeting ${employeeLabel}.`
      }
    });
    lockAccount = true;
  }

  // -------------------------------------------------------------
  // RULE 2: IMPOSSIBLE TRAVEL VELOCITY (> 800 km/h) -> HIGH
  // -------------------------------------------------------------
  const currentLat = location?.lat ?? newAttempt?.latitude;
  const currentLng = location?.lng ?? newAttempt?.longitude;

  if (status === "success" && currentLat != null && currentLng != null) {
    const previousSuccessfulLogins = allAttempts
      .filter((a) => {
        if (!a) return false;
        const aEmail = (a.email || "").toLowerCase();
        const sameTarget = (userId && a.userId === userId) || (targetEmail && aEmail === targetEmail);
        const aTime = new Date(a.timestamp || a.loginTime || Date.now());
        const aLat = a.location?.lat ?? a.latitude;
        const aLng = a.location?.lng ?? a.longitude;
        return sameTarget && a.status === "success" && aTime < attemptTime && a.id !== newAttempt.id && aLat != null && aLng != null;
      })
      .sort((a, b) => new Date(b.timestamp || b.loginTime) - new Date(a.timestamp || a.loginTime));

    if (previousSuccessfulLogins.length > 0) {
      const prev = previousSuccessfulLogins[0];
      const prevLat = prev.location?.lat ?? prev.latitude;
      const prevLng = prev.location?.lng ?? prev.longitude;
      const prevTime = new Date(prev.timestamp || prev.loginTime);

      const distanceKm = calculateHaversineDistance(prevLat, prevLng, currentLat, currentLng);
      const timeDiffHours = (attemptTime.getTime() - prevTime.getTime()) / (1000 * 3600);

      if (timeDiffHours > 0) {
        const speedKmh = distanceKm / timeDiffHours;
        if (speedKmh > 800 && distanceKm > 100) {
          const prevLocStr = prev.location ? (typeof prev.location === 'string' ? prev.location : `${prev.location.city}, ${prev.location.country}`) : `${prev.city || 'Unknown'}, ${prev.country || 'Unknown'}`;

          alertsToCreate.push({
            ...baseAlertFields,
            id: `alt_it_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            threatType: "impossible_travel",
            title: "Impossible Travel Velocity Anomaly",
            severity: "high",
            details: {
              distanceKm: Math.round(distanceKm),
              timeDiffMinutes: Math.round(timeDiffHours * 60),
              impliedSpeedKmh: Math.round(speedKmh),
              fromLocation: prevLocStr,
              toLocation: locStr,
              reason: `Impossible Travel: ${employeeLabel} authenticated from ${locStr} ${Math.round(timeDiffHours * 60)} mins after ${prevLocStr} (${Math.round(distanceKm)} km away). Velocity: ${Math.round(speedKmh)} km/h.`
            }
          });
          lockAccount = true;
        }
      }
    }
  }

  // -------------------------------------------------------------
  // RULE 3: NEW DEVICE DETECTION -> MEDIUM
  // -------------------------------------------------------------
  if (status === "success" && user) {
    const knownDevices = user.assignedDevices || user.knownDevices || [];
    const currentSig = (deviceFingerprint || deviceStr).toLowerCase();
    const isKnown = knownDevices.some((d) =>
      typeof d === "string" ? d.toLowerCase().includes(currentSig) || currentSig.includes(d.toLowerCase()) : false
    );

    if (!isKnown && knownDevices.length > 0) {
      alertsToCreate.push({
        ...baseAlertFields,
        id: `alt_nd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        threatType: "new_device",
        title: "Unrecognized Device Signature Alert",
        severity: "medium",
        details: {
          device: deviceStr,
          deviceFingerprint,
          reason: `Unrecognized Device Alert: Authentication attempt from unverified device fingerprint ("${deviceStr}").`
        }
      });
    }
  }

  // -------------------------------------------------------------
  // RULE 4: OFF HOURS LOGIN (12 AM - 5 AM) -> LOW
  // -------------------------------------------------------------
  const loginHour = attemptTime.getHours();
  if (loginHour >= 0 && loginHour < 5) {
    alertsToCreate.push({
      ...baseAlertFields,
      id: `alt_oh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      threatType: "off_hours",
      title: "Off-Hours Workforce Authentication",
      severity: "low",
      details: {
        hour: loginHour,
        formattedTime: attemptTime.toLocaleTimeString(),
        reason: `Off-Hours Login: ${employeeLabel} authenticated at ${attemptTime.toLocaleTimeString()} (between 12 AM and 5 AM).`
      }
    });
  }

  // -------------------------------------------------------------
  // RULE 5: MULTIPLE COUNTRY LOGINS (15 min window) -> HIGH
  // -------------------------------------------------------------
  const currentCountry = country || (typeof location === 'object' ? location?.country : null);
  if (status === "success" && currentCountry) {
    const fifteenMinsAgo = new Date(attemptTime.getTime() - 15 * 60 * 1000);
    const otherCountryLogins = allAttempts.filter((a) => {
      if (!a) return false;
      const aEmail = (a.email || "").toLowerCase();
      const sameTarget = (userId && a.userId === userId) || (targetEmail && aEmail === targetEmail);
      const aTime = new Date(a.timestamp || a.loginTime || Date.now());
      const aCountry = a.country || (typeof a.location === 'object' ? a.location?.country : null);
      return sameTarget && a.status === "success" && aTime >= fifteenMinsAgo && aTime <= attemptTime && a.id !== newAttempt.id && aCountry && aCountry.toLowerCase() !== currentCountry.toLowerCase();
    });

    if (otherCountryLogins.length > 0) {
      const prevLog = otherCountryLogins[0];
      const prevCountry = prevLog.country || prevLog.location?.country;
      alertsToCreate.push({
        ...baseAlertFields,
        id: `alt_mc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        threatType: "multiple_country",
        title: "Simultaneous Multi-Country Authentication",
        severity: "high",
        details: {
          currentCountry,
          previousCountry: prevCountry,
          reason: `Multi-Country Logins: Concurrent authentications detected across ${currentCountry} and ${prevCountry} within 15 minutes.`
        }
      });
      lockAccount = true;
    }
  }

  // -------------------------------------------------------------
  // RULE 6: MULTIPLE IP LOGINS (10 min window) -> MEDIUM
  // -------------------------------------------------------------
  if (status === "success" && ip) {
    const tenMinsAgo = new Date(attemptTime.getTime() - 10 * 60 * 1000);
    const otherIpLogins = allAttempts.filter((a) => {
      if (!a) return false;
      const aEmail = (a.email || "").toLowerCase();
      const sameTarget = (userId && a.userId === userId) || (targetEmail && aEmail === targetEmail);
      const aTime = new Date(a.timestamp || a.loginTime || Date.now());
      return sameTarget && a.status === "success" && aTime >= tenMinsAgo && aTime <= attemptTime && a.id !== newAttempt.id && a.ip && a.ip !== ip;
    });

    if (otherIpLogins.length > 0) {
      alertsToCreate.push({
        ...baseAlertFields,
        id: `alt_mip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        threatType: "multiple_ip",
        title: "Concurrent Public IP Access Anomaly",
        severity: "medium",
        details: {
          currentIp: ip,
          previousIp: otherIpLogins[0].ip,
          reason: `Multi-IP Anomaly: Logins from different public IPs (${ip} & ${otherIpLogins[0].ip}) within 10 minutes.`
        }
      });
    }
  }

  // -------------------------------------------------------------
  // RULE 7: VPN OR PROXY LOGIN -> MEDIUM
  // -------------------------------------------------------------
  if (vpnDetected || proxyDetected) {
    alertsToCreate.push({
      ...baseAlertFields,
      id: `alt_vpn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      threatType: "vpn_proxy",
      title: "VPN / Proxy Tunnel Authentication Flag",
      severity: "medium",
      details: {
        isp: isp || "Unknown ISP",
        vpnDetected,
        proxyDetected,
        reason: `VPN/Proxy Threat: Authentication routed through an active VPN or anonymizing proxy gateway (${ip}).`
      }
    });
  }

  // -------------------------------------------------------------
  // RULE 8 & 9: DISABLED OR LOCKED ACCOUNT ACCESS -> CRITICAL
  // -------------------------------------------------------------
  if (user && (user.disabled || user.locked || user.accountStatus === "Disabled" || user.accountStatus === "Locked")) {
    const isDis = user.disabled || user.accountStatus === "Disabled";
    alertsToCreate.push({
      ...baseAlertFields,
      id: `alt_acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      threatType: isDis ? "disabled_employee" : "locked_account",
      title: isDis ? "Critical: Disabled Account Access Attempt" : "Critical: Locked Account Access Attempt",
      severity: "critical",
      details: {
        accountStatus: user.accountStatus || (isDis ? "Disabled" : "Locked"),
        reason: `Critical Access Violation: Login attempt targeting ${isDis ? 'Disabled' : 'Locked'} employee profile ${employeeLabel}.`
      }
    });
  }

  // -------------------------------------------------------------
  // RULE 10: UNUSUAL LOGIN FREQUENCY (> 10 logins in 10 mins) -> MEDIUM
  // -------------------------------------------------------------
  const tenMinsAgo = new Date(attemptTime.getTime() - 10 * 60 * 1000);
  const recentUserLogins = allAttempts.filter((a) => {
    if (!a) return false;
    const aEmail = (a.email || "").toLowerCase();
    const sameTarget = (userId && a.userId === userId) || (targetEmail && aEmail === targetEmail);
    const aTime = new Date(a.timestamp || a.loginTime || Date.now());
    return sameTarget && aTime >= tenMinsAgo && aTime <= attemptTime;
  });

  if (recentUserLogins.length >= 10) {
    alertsToCreate.push({
      ...baseAlertFields,
      id: `alt_freq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      threatType: "unusual_frequency",
      title: "Unusual Authentication Frequency Spike",
      severity: "medium",
      details: {
        count: recentUserLogins.length,
        timeWindow: "10 minutes",
        reason: `Frequency Anomaly: ${recentUserLogins.length} login attempts recorded for ${employeeLabel} within 10 minutes.`
      }
    });
  }

  // -------------------------------------------------------------
  // RULE 11: IMPOSSIBLE DEVICE SWITCHING (Windows -> Android -> macOS in 15 mins) -> HIGH
  // -------------------------------------------------------------
  if (status === "success" && os) {
    const fifteenMinsAgo = new Date(attemptTime.getTime() - 15 * 60 * 1000);
    const recentOtherOsLogins = allAttempts.filter((a) => {
      if (!a) return false;
      const aEmail = (a.email || "").toLowerCase();
      const sameTarget = (userId && a.userId === userId) || (targetEmail && aEmail === targetEmail);
      const aTime = new Date(a.timestamp || a.loginTime || Date.now());
      const aOs = a.os || "";
      return sameTarget && a.status === "success" && aTime >= fifteenMinsAgo && aTime <= attemptTime && a.id !== newAttempt.id && aOs && !os.toLowerCase().includes(aOs.toLowerCase().split(" ")[0]);
    });

    if (recentOtherOsLogins.length >= 2) {
      alertsToCreate.push({
        ...baseAlertFields,
        id: `alt_devsw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        threatType: "device_switching",
        title: "Rapid Operating System Switching Anomaly",
        severity: "high",
        details: {
          currentOs: os,
          previousOs: recentOtherOsLogins[0].os,
          reason: `Device Switch Anomaly: Rapid consecutive logins across conflicting OS platforms (${os} vs ${recentOtherOsLogins[0].os}) within 15 minutes.`
        }
      });
      lockAccount = true;
    }
  }

  return {
    alertsToCreate,
    lockAccount
  };
}
