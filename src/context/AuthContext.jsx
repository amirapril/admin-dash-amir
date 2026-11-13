import { createContext, useContext, useEffect, useState } from 'react';

/**
 * AuthContext — demo authentication using localStorage.
 *
 * TODO (real backend): replace `login()` internals with a call to your API:
 *   const { token, user } = await api.post('/auth/login', { email, password });
 *   localStorage.setItem('token', token);
 * and validate the token in `useEffect` on page load.
 */

const AuthContext = createContext(null);

const STORAGE_KEY = 'dashboard_auth';

// Demo account used by the seed data below
const DEMO_USER = { id: 1, name: 'Sara Ahmadi', email: 'admin@novin.dev', role: 'Administrator' };

// "Remember me" -> localStorage (survives the browser), otherwise sessionStorage (tab only)
function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(true);

  // Restore session on first mount (simulates "check if token is still valid")
  useEffect(() => {
    const stored = readStoredUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  /**
   * @param {{email: string, password: string, remember: boolean}} credentials
   * @returns {Promise<{ok: boolean, message?: string}>}
   */
  const login = async ({ email, password, remember }) => {
    // ⚠️ DEMO ONLY — never hard-code credentials in a real app.
    // Replace this block with a real API request.
    await new Promise((r) => setTimeout(r, 600));

    const isValid =
      email.trim().toLowerCase() === DEMO_USER.email && password === 'admin123';

    if (!isValid) {
      return { ok: false, message: 'Incorrect email or password. Try the demo account.' };
    }

    const sessionUser = { ...DEMO_USER, remember };
    if (remember) localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));

    setUser(sessionUser);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
