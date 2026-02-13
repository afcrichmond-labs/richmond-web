import { AUTH_CONFIG } from "../config";

interface RefreshState {
  attempts: number;
  windowStart: number;
}

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60_000;

let refreshState: RefreshState = { attempts: 0, windowStart: Date.now() };

export async function refreshAuthToken(refreshToken: string): Promise<string | null> {
  const now = Date.now();

  // Reset window if expired
  if (now - refreshState.windowStart > WINDOW_MS) {
    refreshState = { attempts: 0, windowStart: now };
  }

  // Circuit breaker: too many attempts
  if (refreshState.attempts >= MAX_ATTEMPTS) {
    console.error("[Auth] Circuit breaker open: too many refresh attempts");
    clearTokens();
    redirectToLogin("session_expired");
    return null;
  }

  refreshState.attempts++;

  try {
    const response = await fetch(`${AUTH_CONFIG.apiUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.status}`);
    }

    const { access_token, refresh_token: newRefreshToken } = await response.json();
    storeTokens(access_token, newRefreshToken);
    refreshState.attempts = 0;
    return access_token;
  } catch (error) {
    console.error("[Auth] Token refresh failed:", error);
    if (refreshState.attempts >= MAX_ATTEMPTS) {
      clearTokens();
      redirectToLogin("session_expired");
    }
    return null;
  }
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

function storeTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function redirectToLogin(reason: string) {
  window.location.href = `/login?reason=${reason}`;
}
