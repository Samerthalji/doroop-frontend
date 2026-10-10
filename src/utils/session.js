// Everything the app stores in localStorage that belongs to the signed-in user.
const SESSION_KEYS = ['token', 'refresh', 'savedJobs'];

export const clearSession = () => {
  try {
    SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // localStorage can be unavailable (private mode / blocked); nothing to clear.
  }
};
