/**
 * Session Manager - Handles session and visitor tracking like real analytics services
 *
 * Key concepts:
 * - Visitor ID: Persistent identifier stored in localStorage, survives browser restarts
 * - Session ID: Temporary identifier stored in sessionStorage, expires on tab/browser close
 * - Session timeout: Sessions expire after 30 minutes of inactivity
 */

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const VISITOR_ID_KEY = 'tm_visitor_id';
const SESSION_ID_KEY = 'tm_session_id';
const LAST_ACTIVITY_KEY = 'tm_last_activity';

/**
 * Generates a unique ID using timestamp + random string
 * Format: timestamp-randomString (e.g., 1702468497123-a1b2c3d4e5f6)
 */
function generateUniqueId(): string {
  const timestamp = Date.now();
  const randomPart =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`;
}

/**
 * Gets or creates a persistent visitor ID
 * This ID persists across browser sessions and is stored in localStorage
 */
function getVisitorId(): string {
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);

    if (!visitorId) {
      visitorId = `vis_${generateUniqueId()}`;
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }

    return visitorId;
  } catch (error) {
    // Fallback if localStorage is not available
    console.warn(
      'localStorage not available, using temporary visitor ID:',
      error
    );
    return `vis_temp_${generateUniqueId()}`;
  }
}

/**
 * Checks if the current session has expired based on last activity time
 */
function isSessionExpired(): boolean {
  try {
    const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);

    if (!lastActivity) {
      return true;
    }

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
    return timeSinceLastActivity > SESSION_TIMEOUT;
  } catch (error) {
    return true;
  }
}

/**
 * Updates the last activity timestamp to keep the session alive
 */
function updateLastActivity(): void {
  try {
    sessionStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  } catch (error) {
    console.warn('Failed to update last activity:', error);
  }
}

/**
 * Gets or creates a session ID
 * Sessions expire after 30 minutes of inactivity or when the browser tab is closed
 */
function getSessionId(): string {
  try {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

    // Create new session if:
    // 1. No session exists
    // 2. Session has expired due to inactivity
    if (!sessionId || isSessionExpired()) {
      sessionId = `ses_${generateUniqueId()}`;
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }

    // Update last activity to keep session alive
    updateLastActivity();

    return sessionId;
  } catch (error) {
    // Fallback if sessionStorage is not available
    console.warn(
      'sessionStorage not available, using temporary session ID:',
      error
    );
    return `ses_temp_${generateUniqueId()}`;
  }
}

/**
 * Manually end the current session (useful for logout scenarios)
 */
function endSession(): void {
  try {
    sessionStorage.removeItem(SESSION_ID_KEY);
    sessionStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch (error) {
    console.warn('Failed to end session:', error);
  }
}

/**
 * Get session metadata for debugging/analytics
 */
function getSessionMetadata() {
  try {
    const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);
    const sessionAge = lastActivity
      ? Date.now() - parseInt(lastActivity, 10)
      : 0;

    return {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      sessionAge,
      isExpired: isSessionExpired(),
      timeoutDuration: SESSION_TIMEOUT,
    };
  } catch (error) {
    return {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      error: 'Failed to get metadata',
    };
  }
}

export const sessionManager = {
  getVisitorId,
  getSessionId,
  endSession,
  getSessionMetadata,
  updateLastActivity,
};

export default sessionManager;
