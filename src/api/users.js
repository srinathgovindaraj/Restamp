/**
 * RESTAMP users API — role switching (P0 owner-property-posting fix).
 *
 * Backend contract (read-only, see backend app/routers/users.py):
 * - POST /users/me/role { role: "BUYER" | "OWNER" | "BROKER" } -> { user_id, role }
 * - GET  /users/me/role -> { user_id, role }
 *
 * Uses the existing authenticated client infrastructure (apiPost / apiGetAuth
 * in client.js), so the current Bearer token is preserved. Never touches the
 * token store and never logs the user out.
 */
import { Alert } from "react-native";
import { apiGetAuth, apiPost } from "./client";

/**
 * Update the authenticated user's role on the backend.
 * @param {"BUYER" | "OWNER" | "BROKER"} role
 * @returns {Promise<{user_id: number, role: string}>}
 */
export async function setMyRole(role) {
  return apiPost("/users/me/role", { role });
}

/**
 * Fetch the authenticated user's current backend role.
 * @returns {Promise<{user_id: number, role: string}>}
 */
export async function fetchMyRole() {
  return apiGetAuth("/users/me/role");
}

// Guard against double-tap role switches racing each other.
let _roleSwitchInFlight = false;

/**
 * Ensure the backend role is OWNER before entering any Owner flow.
 *
 * - If auth.user.role is already "OWNER", no network call is made.
 * - Otherwise POSTs /users/me/role { role: "OWNER" } with the existing token.
 * - Best-effort refreshes the AuthContext user (via auth.refreshMe) so the UI
 *   role matches the backend; a refresh failure does NOT fail the switch
 *   because the server-side role was already updated.
 * - Never clears the token and never logs the user out.
 *
 * @param {object} auth - the value returned by useAuth() ({ user, refreshMe })
 * @returns {Promise<{ alreadyOwner: boolean }>}
 */
export async function ensureOwnerRole(auth) {
  if (auth?.user?.role === "OWNER") {
    return { alreadyOwner: true };
  }
  if (_roleSwitchInFlight) {
    // A switch is already running (e.g. double tap); wait for it to finish.
    // Poll briefly rather than firing a second POST.
    const startedAt = Date.now();
    while (_roleSwitchInFlight && Date.now() - startedAt < 10000) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return { alreadyOwner: auth?.user?.role === "OWNER" };
  }
  _roleSwitchInFlight = true;
  try {
    await setMyRole("OWNER");
    if (auth && typeof auth.refreshMe === "function") {
      try {
        await auth.refreshMe();
      } catch {
        // Server role is already OWNER; a stale local profile must not block
        // entry into the Owner flow.
      }
    }
    return { alreadyOwner: false };
  } finally {
    _roleSwitchInFlight = false;
  }
}

function roleSwitchErrorMessage(e) {
  if (!e) return "Could not switch to Owner mode. Please try again.";
  if (e.kind === "offline") {
    return "No connection. Make sure the backend is running and reachable, then try again.";
  }
  if (e.kind === "login" || e.status === 401) {
    return "Your session has expired. Please log in again, then try posting your property.";
  }
  if (e.kind === "denied" || e.status === 403) {
    return "This account is not allowed to become an Owner. Please contact support.";
  }
  if (e.kind === "validation" || e.status === 400 || e.status === 422) {
    return "The server rejected the role change. Please update the app and try again.";
  }
  return "Could not switch to Owner mode. Please try again.";
}

/**
 * Single reusable Owner entry point for ALL buyer->owner transitions:
 * Home "Post your Property", Profile "Switch to Post Property", Menu Owner
 * entries, and the Owner header pill.
 *
 * Flow: ensure backend role is OWNER first (real POST, token preserved),
 * and ONLY then navigate into OwnerNavigator. On failure, stays put and
 * shows a clean error — never logs out, never touches OTP state.
 *
 * @param {object} navigation - React Navigation object
 * @param {object} auth - the value returned by useAuth()
 * @param {"Add" | "Dashboard" | "Properties" | "Leads" | "Profile"} ownerScreen
 * @param {object} ownerParams - params forwarded to the OwnerNavigator screen
 * @returns {Promise<boolean>} true when navigation happened
 */
export async function enterOwnerFlow(navigation, auth, ownerScreen = "Dashboard", ownerParams) {
  try {
    await ensureOwnerRole(auth);
  } catch (e) {
    Alert.alert("Could not open Owner mode", roleSwitchErrorMessage(e));
    return false;
  }
  try {
    navigation.navigate("OwnerNavigator", { screen: ownerScreen, ...(ownerParams ? { params: ownerParams } : {}) });
    return true;
  } catch (e) {
    Alert.alert("Could not open Owner mode", "Navigation failed. Please try again.");
    return false;
  }
}
