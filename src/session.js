const SESSION_KEY = "finview_session";

export function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession() {
  try {
    const session = sessionStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("Failed to read session:", error);
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated() {
  return Boolean(getSession()?.token);
}

export function getAuthHeaders() {
  const session = getSession();

  return {
    "Content-Type": "application/json",
    ...(session?.token
      ? { Authorization: `Bearer ${session.token}` }
      : {}),
  };
}
