import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/api.js';

/**
 * DataContext — single source of truth for users & orders.
 * Pages read from here and call the mutations below, so adding a
 * user in the form instantly updates the table (no prop drilling).
 *
 * TODO: swap the api.* calls for real HTTP requests — the interface
 * of this context does not need to change.
 */
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial load (useEffect + async fetch pattern)
  useEffect(() => {
    (async () => {
      try {
        const [u, o] = await Promise.all([api.getUsers(), api.getOrders()]);
        setUsers(u);
        setOrders(o);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addUser = async (payload) => {
    const created = await api.createUser(payload);
    setUsers((prev) => [created, ...prev]);
    return created;
  };

  const editUser = async (id, payload) => {
    const updated = await api.updateUser(id, payload);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  };

  const removeUser = async (id) => {
    await api.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const changeOrderStatus = async (id, status) => {
    const updated = await api.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  return (
    <DataContext.Provider
      value={{ users, orders, loading, addUser, editUser, removeUser, changeOrderStatus }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
