// Tiny event-based toast helper (no extra dependency).
// Usage: toast.success('Saved'), toast.error('Something went wrong')
const listeners = new Set();
let nextId = 0;

const emit = (type, message) => {
  const item = { id: ++nextId, type, message: String(message ?? '') };
  listeners.forEach((listener) => listener(item));
};

export const toast = {
  success: (message) => emit('success', message),
  error: (message) => emit('error', message),
  info: (message) => emit('info', message),
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
