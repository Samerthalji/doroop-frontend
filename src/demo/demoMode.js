import { clearSession } from '../utils/session';

// Demo mode serves every API call from sample data stored in the browser
// (see demoAdapter.js). Nothing is sent to the real backend.
export const isDemoMode = () => {
  try {
    return localStorage.getItem('demo') === '1';
  } catch {
    return false;
  }
};

export const enterDemo = () => {
  clearSession();
  try {
    localStorage.setItem('demo', '1');
    // Fake tokens only satisfy the route guard; they are never validated anywhere.
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('refresh', 'demo-refresh');
  } catch {
    // storage blocked: demo cannot start
    return;
  }
  window.location.assign('/home');
};

export const exitDemo = () => {
  clearSession(); // also removes the demo flag and the demo database
  window.location.replace('/');
};
