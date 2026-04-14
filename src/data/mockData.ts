import { Customer, Conversation, Station, ActivityEvent, RevenueDataPoint } from '@/types';

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Alex Rivera', email: 'arivera.gamer@email.com', phone: '+91 98765 43210', totalSpent: 12450, lastVisit: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), level: 'Gold', sessions: 48, joinDate: '2023-06-15', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1IOdbf7NrQ0Kq_2qfbWzA1244GuY3_WLRiZOB-CJkXvXN8J6VslKIlEIvtSe5S9PnhGrJ-tEVKLunoR_mjGpk9ATdUBZX2wj3w9hCh6C7JtkArOlWQi_YycCbTmcVCnLIxuHE0Gz1u4rLfdjUlRCmC7K4k8OMDMPgxUR1ztfmDEE9YT_N_a3Efpb8iuERV7ByAUXOD9zkIJ-W8PZG4YIlzjIv7-7pN7I6gMPrS4VQu02udGa12ttuBrdCDV9uUZ88_ufkIdQXXPMr', isActive: true, avgSession: 2.8 },
  { id: '2', name: 'Priya Sharma', email: 'priya.ps5@webmail.in', phone: '+91 87654 32109', totalSpent: 8200, lastVisit: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), level: 'Silver', sessions: 31, joinDate: '2023-08-22', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKJ0jTOE05pSlIeIJBcY-oLJ1lqH3dTetH63AzOSV6znyS0ODChczBioTlm1bot4ttZVFVrTcagm3BFrDOUceA9kjahuyiEvovgVmaGqxZF3Qegoli4oEO0o3S6BxEVwGZvfKQ3lS_vcDJyYviZM0HwqYyHLEpoB5FAnYjSVeFNwWbiVKqsoM32RUoD5-h-7egALi5EjAnf2_8Q8S4RP1T3jz6IPEzQmqVWRLE0CK4WOZDzG4WcUvLqiNd1AGW5_wRKgTNwfs_1RS-', isActive: false, avgSession: 2.1 },
  { id: '3', name: 'Leo Maxwell', email: 'leo.max@gaming.com', phone: '+91 76543 21098', totalSpent: 3150, lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), level: 'Bronze', sessions: 12, joinDate: '2023-10-05', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgzAPCrzy3-euRCHu0PcXE4QM-kqF6wBgrmn_Exbfq_h9l10nz7XSWx-oWyE4pGBh5tdHiOWwXxQqdyBPLW7Nz0D4zNoQCtykNTiVGbqgwUoQbIWa8VwQfI09j2YY2eLN47LvnDMAqIF8JN0-0wHGjkDTqIfAs0v3EJPL1aFJfOAstB0AP6d_ajtp2aNDi1cqxlOQX-GzDBrOlW7OZ2Ox8NQEP6un80xIoywD-YYyfr6coWO8vYtz0nT1y2F69A4CbiyIGHT0B1-n-', isActive: false, avgSession: 1.5 },
  { id: '4', name: 'Chloe Zhang', email: 'czhang@esports.org', phone: '+91 65432 10987', totalSpent: 22900, lastVisit: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), level: 'Gold', sessions: 72, joinDate: '2023-04-10', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoJRxoE_qTRIR8KPruZdrJ2jkbVpgeqT1t4NZSdoQmXVwv1GyJLGL2QKyJDb-RpICJmQfV5xNiiwiWpIc44wSsCs_e0ea__fmKWlJXzTPfb4RHHy0HmcSRrU1D6-HJyQKJmspHI4BluOEmNKrvJwvsG12Ijqq495azLadPht6ASsQmmPexRB48Oo1GMEvMQQyGsBvz4MhZlqnFtk0I-oJle9bCeuFpq4bVj1NtWyvT3L9XalAy9tuvKrw9YTj5T1TphOeypH8sRw7k', isActive: true, avgSession: 3.5 },
  { id: '5', name: 'Arjun Dev', email: 'arjun.phantom@mail.com', phone: '+91 94321 09876', totalSpent: 14250, lastVisit: new Date(Date.now() - 30 * 60 * 1000).toISOString(), level: 'Platinum', sessions: 95, joinDate: '2023-01-20', avatar: '', isActive: true, avgSession: 4.2 },
  { id: '6', name: 'Rohan Kumar', email: 'rohan.k@techmail.in', phone: '+91 83210 98765', totalSpent: 6800, lastVisit: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), level: 'Silver', sessions: 25, joinDate: '2023-09-14', avatar: '', isActive: true, avgSession: 1.9 },
  { id: '7', name: 'Sarah Miller', email: 'sarah.m@sportsmail.com', phone: '+91 72109 87654', totalSpent: 18600, lastVisit: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), level: 'Gold', sessions: 58, joinDate: '2023-03-28', avatar: '', isActive: false, avgSession: 2.6 },
  { id: '8', name: 'Zayan Khan', email: 'zayan.gamer@mail.com', phone: '+91 61098 76543', totalSpent: 2400, lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), level: 'Bronze', sessions: 9, joinDate: '2023-11-05', avatar: '', isActive: false, avgSession: 1.2 },
  { id: '9', name: 'Nina Patel', email: 'nina.p@gamezone.com', phone: '+91 90987 65432', totalSpent: 9100, lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), level: 'Silver', sessions: 34, joinDate: '2023-07-19', avatar: '', isActive: false, avgSession: 2.3 },
  { id: '10', name: 'Marcus Chen', email: 'mchen@esports.pro', phone: '+91 79876 54321', totalSpent: 15750, lastVisit: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), level: 'Gold', sessions: 61, joinDate: '2023-05-02', avatar: '', isActive: true, avgSession: 3.1 },
  { id: '11', name: 'Aisha Singh', email: 'aisha.s@gamer.in', phone: '+91 68765 43210', totalSpent: 4200, lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), level: 'Bronze', sessions: 16, joinDate: '2023-10-22', avatar: '', isActive: false, avgSession: 1.7 },
  { id: '12', name: 'Vikram Rao', email: 'vikram.rao@promail.in', phone: '+91 57654 32109', totalSpent: 28000, lastVisit: new Date(Date.now() - 45 * 60 * 1000).toISOString(), level: 'Platinum', sessions: 110, joinDate: '2022-12-10', avatar: '', isActive: true, avgSession: 4.8 },
];

export const mockConversations: Conversation[] = [
  {
    id: '1', customerId: '5', customerName: 'Arjun "Phantom" Dev',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSsutpNwlByvJml3LhUzr9mqnv1-Hp2YuhPC2PhN-le-AeXM6eABOjliC-phIyaQc6oaeGGBg64MwE-1acdMcqptglFETKPRzYxBjAn2LScHTtfIfn7d_oWDjJ4veqjVM-9I8_slbAg6zqNSxjAbyANpVqQIOyi9fqttsYDazUU97A-2SRfBgJl3Ex2nKLs-MFSAriKYWANVduVVqLDgXxy80bwxgzQ27IVYmuu1JupLbVWuHDvIlWdyT_kQmc1e9brva8db2d1GNW',
    lastMessage: "Yo, is PC-12 available for the next 4 hours?", lastMessageTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    unread: true, online: true, category: 'vip',
    messages: [
      { id: 'm1', content: "Hey, quick question. Are there any discounts for booking 4+ hours on the RTX 4090 stations today?", sentAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), isFromCustomer: true, read: true },
      { id: 'm2', content: "Hey Arjun! Yes, we have a \"Squad Pack\" — 20% off for 4+ hours on premium stations. I've pre-booked PC 12, 13, and 14 for you. See you soon!", sentAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), isFromCustomer: false, read: true },
      { id: 'm3', content: "Yo, is PC-12 available for the next 4 hours? I'm coming with three others. Can we get the corner spot?", sentAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), isFromCustomer: true, read: false },
    ],
  },
  {
    id: '2', customerId: '7', customerName: 'Sarah Miller',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQsUMXxX3speaxVIJbhCqgRAWLYHYolQGI-qKRoyZ3nW1BWyWYtDlYaX8rf0gLDLW_vpVvv86BiMBNA22yktHPzANlXZIMkqJQLjIoxLrpsx8RSl1UfZRmSue5Oe_WTWZInEEZ2eUqhkkyBtI1aCiUizU9HqCdZGQpqWRMFuUReJsZ9ryqxk7pzcYbbBgBNpHQbeG-R1mjNxIwddeuO-9YqZ9-hHZOCgjuit7qs6o8fNYG39az-GuNRh7DhvPV-5pNXgjujFQJPwk7',
    lastMessage: "Great, thanks for the membership upgrade! See you Friday.", lastMessageTime: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    unread: false, online: false, category: 'general',
    messages: [
      { id: 'm4', content: "Hi! Can you upgrade my membership to Gold tier? I've been a regular for 6 months now.", sentAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(), isFromCustomer: true, read: true },
      { id: 'm5', content: "Hi Sarah! Absolutely, I've upgraded your account to Gold effective immediately. You'll get priority booking and 15% off all sessions!", sentAt: new Date(Date.now() - 18.5 * 60 * 60 * 1000).toISOString(), isFromCustomer: false, read: true },
      { id: 'm6', content: "Great, thanks for the membership upgrade! See you Friday.", sentAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), isFromCustomer: true, read: true },
    ],
  },
  {
    id: '3', customerId: '6', customerName: 'Rohan Kumar',
    customerAvatar: '',
    lastMessage: "Sent the screenshot of the payment.", lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: true, online: true, category: 'support',
    messages: [
      { id: 'm7', content: "Hey I paid for 3 hours but my session got cut at 2 hours. Can you check?", sentAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(), isFromCustomer: true, read: true },
      { id: 'm8', content: "Hi Rohan! I'm sorry about that. Please send us the payment screenshot and we'll sort it out immediately.", sentAt: new Date(Date.now() - 2.2 * 60 * 60 * 1000).toISOString(), isFromCustomer: false, read: true },
      { id: 'm9', content: "Sent the screenshot of the payment.", sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isFromCustomer: true, read: true },
    ],
  },
  {
    id: '4', customerId: '12', customerName: 'Vikram Rao',
    customerAvatar: '',
    lastMessage: "I'll take the private booth for the weekend tournament.", lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    unread: false, online: true, category: 'vip',
    messages: [
      { id: 'm10', content: "Do you have private booths available for the weekend? Want to host a 6-person squad.", sentAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), isFromCustomer: true, read: true },
      { id: 'm11', content: "Absolutely Vikram! We have 2 private booths — Zone C has 6 RTX 4090 stations together. I can reserve it exclusively for your squad.", sentAt: new Date(Date.now() - 3.2 * 60 * 60 * 1000).toISOString(), isFromCustomer: false, read: true },
      { id: 'm12', content: "I'll take the private booth for the weekend tournament.", sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), isFromCustomer: true, read: true },
    ],
  },
  {
    id: 'bot', customerId: 'bot', customerName: 'Promo Bot',
    lastMessage: "Broadcast: Happy Hours starting now!", lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    unread: false, online: true, category: 'general',
    messages: [
      { id: 'mb1', content: "Broadcast: Happy Hours starting now! 30% off all sessions from 2PM-6PM.", sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), isFromCustomer: false, read: true },
    ],
  },
];

export const mockStations: Station[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 1, name: `PC-${(i + 1).toString().padStart(2, '0')}`, type: 'RTX 4090' as const,
    status: i < 15 ? 'occupied' : i < 17 ? 'reserved' : i < 19 ? 'available' : 'maintenance' as 'occupied' | 'reserved' | 'available' | 'maintenance',
    zone: 'A' as const
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 21, name: `PS5-${(i + 1).toString().padStart(2, '0')}`, type: 'PS5 Pro' as const,
    status: i < 9 ? 'occupied' : i < 11 ? 'available' : i < 13 ? 'reserved' : 'maintenance' as 'occupied' | 'available' | 'reserved' | 'maintenance',
    zone: 'B' as const
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 36, name: `SIM-${(i + 1).toString().padStart(2, '0')}`, type: 'Sim Racing' as const,
    status: i < 3 ? 'occupied' : i < 6 ? 'available' : 'maintenance' as 'occupied' | 'available' | 'maintenance',
    zone: 'C' as const
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: i + 46, name: `VR-${(i + 1).toString().padStart(2, '0')}`, type: 'VR' as const,
    status: i < 3 ? 'occupied' : 'available' as 'occupied' | 'available',
    zone: 'C' as const
  })),
];

export const mockRecentActivity: ActivityEvent[] = [
  { id: 'a1', type: 'session_start', title: 'Rohan Mehta', description: 'Started session on PC #12', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), customerName: 'Rohan Mehta', customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4avCPJJvMlCAot0QYKp6WtqpFa_o5hF-m6yZXk7-2r4llVWundOXu17-5GEFuKpW-hhsWgolrZQ6HP6hsMjxpRw7_4Xdjkgo2G4JUU7TZgQ9icTSMAv-q1qYSPu4v9XZ7RrIKkFFa-75kOYB9jGEq_vZ5d-TXcn_PTsKLDj1L4ue9pqEiiNJr7zQhrzeNZm7CcqSKvS9DhLESWVeMqdgufPJKKt_9zgc70gsYCLaLYmjvZZsED-qu71-_025I_ktJ-v6F3u9SB0Z_' },
  { id: 'a2', type: 'tournament', title: 'Tournament Signup', description: 'Valorant Clash: Mumbai Region', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: 'a3', type: 'purchase', title: 'Sanya Singh', description: 'Purchased "God Tier" snack pack', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), customerName: 'Sanya Singh', customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7qbgc1IXt99g0mmIcN8Cx6abF1lnRwF9oKJ0P79kKlT9X_gQGP7HYbY2p6FJFFtjY73ReAw7cXNFV_8FtCVNE0rRjxJ5UIFr34Tea_SuHxoHf8eWADKWdQv8OnC5yyheMcC7YswqqrRsxgMZhaw81EnmuTb5CprYSBerx2EKrSOuiffnEH9K6JTuQXk_uN538hsRMYjNg-sTUKHHnOxgctzMagpwULO_W5AE8MsV1F2UdiJtBbVqnO8Hjdbywl5cIH5tRRwtv9gk3' },
  { id: 'a4', type: 'alert', title: 'Network Alert', description: 'Latency spike in North Wing Hub', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), severity: 'warning' },
  { id: 'a5', type: 'redemption', title: 'Zayan Khan', description: 'Redeemed 500 Loyalty points', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), customerName: 'Zayan Khan', customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVzJZ2V2gzr--_vLHzNgQqIB1PtFG1VqW86O5KTxkZwbPj1tDL7Mi8Txld94hWDJVu0J-irUtM5ZSsmN_JXEQ8uUEHp_Mit7jNF1USK6ztaoVJxDBZ5TtPqAToDNemz1p-jerSzHJNrJLvDmqS9IMYsIj6vlAC1qdGdsyH-Y156Ine-Z_M72LUeolc3uweDRVMMLci2W6KHjXDlAouPQ4Hej2A-20yYFtZBWqLxKFUmWck6AoNPFFekecDDXTwFguWJBMlxselVjzA' },
];

const genRevenue = (days: number): RevenueDataPoint[] =>
  Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 18000 : 12000;
    const revenue = Math.floor(base + (Math.random() - 0.3) * 5000);
    return { label: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }), revenue, sessions: Math.floor(revenue / 250) };
  });

export const mockDailyRevenue: RevenueDataPoint[] = genRevenue(30);
export const mockWeeklyRevenue: RevenueDataPoint[] = mockDailyRevenue.slice(-7);

export const mockHourlyRevenue: RevenueDataPoint[] = [
  { label: '10 AM', revenue: 4800, sessions: 19 },
  { label: '12 PM', revenue: 6600, sessions: 26 },
  { label: '02 PM', revenue: 8400, sessions: 33 },
  { label: '04 PM', revenue: 14400, sessions: 57 },
  { label: '06 PM', revenue: 12000, sessions: 48 },
  { label: '08 PM', revenue: 15000, sessions: 60 },
  { label: '10 PM', revenue: 10800, sessions: 43 },
  { label: '12 AM', revenue: 3600, sessions: 14 },
];
