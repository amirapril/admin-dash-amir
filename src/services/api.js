import { users as seedUsers, orders as seedOrders } from '../data/dummyData.js';

/**
 * ─────────────────────────────────────────────────────────────
 *  API SERVICE LAYER
 *  Every function simulates a network request with a short delay.
 *  To connect a real backend, only change the bodies of these
 *  functions — the rest of the app stays untouched.
 *
 *  Example:
 *    export const getUsers = async () => {
 *      const res = await fetch(`${BASE_URL}/users`, {
 *        headers: { Authorization: `Bearer ${token}` },
 *      });
 *      if (!res.ok) throw new Error('Failed to load users');
 *      return res.json();
 *    };
 * ─────────────────────────────────────────────────────────────
 */

const BASE_URL = 'https://api.example.com'; // ← your real API base URL
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let localUsers = [...seedUsers];
let localOrders = [...seedOrders];

/** GET /users */
export const getUsers = async () => {
  await delay();
  return [...localUsers];
};

/** POST /users */
export const createUser = async (payload) => {
  await delay();
  const newUser = { id: Date.now(), ...payload };
  localUsers = [newUser, ...localUsers];
  return newUser;
};

/** PUT /users/:id */
export const updateUser = async (id, payload) => {
  await delay();
  localUsers = localUsers.map((u) => (u.id === id ? { ...u, ...payload } : u));
  return localUsers.find((u) => u.id === id);
};

/** DELETE /users/:id */
export const deleteUser = async (id) => {
  await delay();
  localUsers = localUsers.filter((u) => u.id !== id);
  return { success: true };
};

/** GET /orders */
export const getOrders = async () => {
  await delay();
  return [...localOrders];
};

/** PATCH /orders/:id/status */
export const updateOrderStatus = async (id, status) => {
  await delay(200);
  localOrders = localOrders.map((o) => (o.id === id ? { ...o, status } : o));
  return localOrders.find((o) => o.id === id);
};
