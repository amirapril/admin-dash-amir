/**
 * ─────────────────────────────────────────────────────────────
 *  DUMMY DATA
 *  Every array below is a stand-in for data that would normally
 *  come from your REST API. Keep the object shape identical to
 *  what your API returns, then swap `services/api.js` to go live.
 * ─────────────────────────────────────────────────────────────
 */

export const users = [
  { id: 1, name: 'Sara Ahmadi', email: 'sara.ahmadi@example.com', role: 'Admin', status: 'Active', phone: '0912 111 2233', joined: '2024-02-11' },
  { id: 2, name: 'Amir Hosseini', email: 'amir.hosseini@example.com', role: 'Editor', status: 'Active', phone: '0912 444 5566', joined: '2024-03-04' },
  { id: 3, name: 'Niloufar Karimi', email: 'niloufar.k@example.com', role: 'Author', status: 'Pending', phone: '0935 777 8899', joined: '2024-05-19' },
  { id: 4, name: 'Mohammad Rezaei', email: 'm.rezaei@example.com', role: 'Viewer', status: 'Inactive', phone: '0919 222 3344', joined: '2024-06-01' },
  { id: 5, name: 'Zahra Moradi', email: 'zahra.moradi@example.com', role: 'Editor', status: 'Active', phone: '0903 555 6677', joined: '2024-07-15' },
  { id: 6, name: 'Reza Sadeghi', email: 'reza.sadeghi@example.com', role: 'Author', status: 'Active', phone: '0912 888 9900', joined: '2024-08-22' },
  { id: 7, name: 'Fatemeh Zare', email: 'f.zare@example.com', role: 'Viewer', status: 'Pending', phone: '0936 121 3141', joined: '2024-09-08' },
  { id: 8, name: 'Ali Sharifi', email: 'ali.sharifi@example.com', role: 'Admin', status: 'Active', phone: '0912 606 7070', joined: '2024-10-17' },
  { id: 9, name: 'Maryam Bahrami', email: 'm.bahrami@example.com', role: 'Author', status: 'Inactive', phone: '0901 909 8080', joined: '2025-01-05' },
  { id: 10, name: 'Hossein Rahimi', email: 'h.rahimi@example.com', role: 'Editor', status: 'Active', phone: '0912 343 5454', joined: '2025-02-13' },
  { id: 11, name: 'Leila Kazemi', email: 'leila.kazemi@example.com', role: 'Viewer', status: 'Active', phone: '0937 767 8787', joined: '2025-03-28' },
  { id: 12, name: 'Sina Torabi', email: 'sina.torabi@example.com', role: 'Author', status: 'Pending', phone: '0912 191 8282', joined: '2025-04-09' },
  { id: 13, name: 'Anna Petersen', email: 'anna.p@example.com', role: 'Editor', status: 'Active', phone: '+45 20 11 22 33', joined: '2025-05-21' },
  { id: 14, name: 'Omid Fallah', email: 'omid.fallah@example.com', role: 'Viewer', status: 'Inactive', phone: '0912 505 6060', joined: '2025-06-30' },
];

export const orders = [
  { id: 'ORD-1041', customer: 'Sara Ahmadi', product: 'Pro Annual Plan', date: '2025-09-28', amount: 4990000, status: 'Completed' },
  { id: 'ORD-1040', customer: 'Tehran Retail Co.', product: 'Team License (5 seats)', date: '2025-09-27', amount: 8750000, status: 'Pending' },
  { id: 'ORD-1039', customer: 'Amir Hosseini', product: 'Starter Monthly Plan', date: '2025-09-26', amount: 420000, status: 'Completed' },
  { id: 'ORD-1038', customer: 'Persian Web Agency', product: 'Enterprise Onboarding', date: '2025-09-25', amount: 15200000, status: 'Cancelled' },
  { id: 'ORD-1037', customer: 'Zahra Moradi', product: 'Pro Monthly Plan', date: '2025-09-24', amount: 560000, status: 'Completed' },
  { id: 'ORD-1036', customer: 'Kian Store', product: 'API Add-on', date: '2025-09-23', amount: 2300000, status: 'Pending' },
  { id: 'ORD-1035', customer: 'Reza Sadeghi', product: 'Starter Annual Plan', date: '2025-09-22', amount: 3900000, status: 'Completed' },
  { id: 'ORD-1034', customer: 'Aria Digital', product: 'Team License (10 seats)', date: '2025-09-21', amount: 16000000, status: 'Completed' },
  { id: 'ORD-1033', customer: 'Fatemeh Zare', product: 'Pro Monthly Plan', date: '2025-09-20', amount: 560000, status: 'Cancelled' },
  { id: 'ORD-1032', customer: 'Novin Studio', product: 'Enterprise Plan', date: '2025-09-19', amount: 24500000, status: 'Pending' },
  { id: 'ORD-1031', customer: 'Ali Sharifi', product: 'Starter Monthly Plan', date: '2025-09-18', amount: 420000, status: 'Completed' },
  { id: 'ORD-1030', customer: 'Caspian Group', product: 'Team License (5 seats)', date: '2025-09-17', amount: 8750000, status: 'Completed' },
  { id: 'ORD-1029', customer: 'Maryam Bahrami', product: 'Pro Annual Plan', date: '2025-09-16', amount: 4990000, status: 'Pending' },
  { id: 'ORD-1028', customer: 'Sharif Tech', product: 'Enterprise Onboarding', date: '2025-09-15', amount: 15200000, status: 'Completed' },
  { id: 'ORD-1027', customer: 'Hossein Rahimi', product: 'Pro Monthly Plan', date: '2025-09-14', amount: 560000, status: 'Cancelled' },
  { id: 'ORD-1026', customer: 'Leila Kazemi', product: 'Starter Annual Plan', date: '2025-09-13', amount: 3900000, status: 'Completed' },
];

/** 12-month revenue for the dashboard line chart (in millions of Toman) */
export const monthlySales = [
  { month: 'Oct', sales: 32, users: 120 },
  { month: 'Nov', sales: 41, users: 165 },
  { month: 'Dec', sales: 38, users: 190 },
  { month: 'Jan', sales: 55, users: 240 },
  { month: 'Feb', sales: 49, users: 275 },
  { month: 'Mar', sales: 63, users: 330 },
  { month: 'Apr', sales: 58, users: 372 },
  { month: 'May', sales: 71, users: 410 },
  { month: 'Jun', sales: 66, users: 455 },
  { month: 'Jul', sales: 82, users: 502 },
  { month: 'Aug', sales: 77, users: 548 },
  { month: 'Sep', sales: 94, users: 613 },
];

/** Feed shown in the "Recent activity" widget */
export const recentActivity = [
  { id: 1, icon: 'person-plus-fill', color: 'primary', text: 'New user registered', detail: 'Sina Torabi created an account', time: '12 min ago' },
  { id: 2, icon: 'bag-check-fill', color: 'success', text: 'Order completed', detail: 'ORD-1041 · 4,990,000 Toman', time: '48 min ago' },
  { id: 3, icon: 'chat-left-text-fill', color: 'info', text: 'New support ticket', detail: '#482 — Billing question', time: '2 hours ago' },
  { id: 4, icon: 'shield-lock-fill', color: 'warning', text: 'Role updated', detail: 'Ali Sharifi is now an Admin', time: '5 hours ago' },
  { id: 5, icon: 'x-octagon-fill', color: 'danger', text: 'Order cancelled', detail: 'ORD-1039 · refund requested', time: 'Yesterday' },
];
