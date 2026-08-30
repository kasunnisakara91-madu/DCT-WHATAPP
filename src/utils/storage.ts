import { Contact, Message, StatusStory, CallLog, UserProfile, WallpaperConfig, LinkedDevice } from '../types';

export const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

export const WALLPAPER_PRESETS: { id: string; name: string; url: string; previewColor: string }[] = [
  {
    id: 'whatsapp-doodle-light',
    name: 'Classic Light Doodle',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    previewColor: '#e5ddd5',
  },
  {
    id: 'whatsapp-doodle-dark',
    name: 'Dark Midnight Doodle',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80',
    previewColor: '#0b141a',
  },
  {
    id: 'nature-emerald',
    name: 'Emerald Forest',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
    previewColor: '#064e3b',
  },
  {
    id: 'sunset-glow',
    name: 'Golden Sunset',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    previewColor: '#fdba74',
  },
  {
    id: 'neon-city',
    name: 'Cyber Cityscape',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&auto=format&fit=crop&q=80',
    previewColor: '#312e81',
  },
  {
    id: 'minimal-abstract',
    name: 'Minimalist Sand',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
    previewColor: '#fef3c7',
  }
];

export const SOLID_COLORS = [
  '#efeae2',
  '#0b141a',
  '#1e293b',
  '#14532d',
  '#1e1b4b',
  '#4a044e',
  '#312e81',
  '#f8fafc',
  '#fef2f2',
  '#f0fdf4',
];

export const INITIAL_USER: UserProfile = {
  id: 'user_me',
  name: 'Damith Madusanka',
  phone: '77 123 4567',
  countryCode: '+94',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  about: 'Hey there! I am using Chat App DCT 🚀',
  createdAt: '2026-08-30T10:00:00Z',
  theme: 'dark',
  wallpaper: {
    type: 'doodle',
    value: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80',
    opacity: 0.25,
    blur: 0,
  },
  soundEnabled: true,
  onlineStatusVisibility: 'everyone',
  readReceipts: true,
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Kasun Perera',
    phone: '+94 71 987 6543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    about: 'Busy coding new tech 💻 | DCT Team',
    isOnline: true,
    lastSeen: 'online',
    unreadCount: 2,
    pinned: true,
  },
  {
    id: 'c2',
    name: 'Dinuka Senanayake',
    phone: '+94 77 456 7890',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    about: 'Living my best life ✨ Traveling 🏝️',
    isOnline: false,
    lastSeen: 'today at 10:24 AM',
    unreadCount: 0,
    pinned: true,
  },
  {
    id: 'c3',
    name: 'DCT Tech Group 🇱🇰',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    about: 'Official DCT Developers & Friends Group',
    isOnline: true,
    lastSeen: 'active now',
    isGroup: true,
    membersCount: 8,
    groupMembers: ['Damith', 'Kasun', 'Dinuka', 'Amila', 'Nadeesha', 'Chathura', 'Sahan', 'Praveen'],
    unreadCount: 5,
    pinned: false,
  },
  {
    id: 'c4',
    name: 'Amila Jayawardena',
    phone: '+94 70 332 1199',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    about: 'At the gym 🏋️‍♂️ Call if urgent',
    isOnline: false,
    lastSeen: 'yesterday at 8:15 PM',
    unreadCount: 0,
    pinned: false,
  },
  {
    id: 'c5',
    name: 'Nadeesha Silva',
    phone: '+94 76 889 0012',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    about: 'Music is life 🎵🎧 Piano & Guitar',
    isOnline: true,
    lastSeen: 'online',
    unreadCount: 0,
    pinned: false,
  },
  {
    id: 'c6',
    name: 'DCT AI Assistant 🤖',
    phone: '+94 77 000 1111',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    about: 'I am your smart AI bot on Chat App DCT! Ask me anything.',
    isOnline: true,
    lastSeen: 'Always online',
    unreadCount: 1,
    pinned: false,
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1-1',
      chatId: 'c1',
      senderId: 'c1',
      senderName: 'Kasun Perera',
      text: 'Machan, app eka hadalada iwara? DP ekai Name ekai maru karanna puluwanda?',
      type: 'text',
      timestamp: '10:15 AM',
      status: 'read',
      reactions: [{ emoji: '👍', by: 'user' }],
    },
    {
      id: 'm1-2',
      chatId: 'c1',
      senderId: 'user',
      text: 'Ow machan! WhatsApp wage serama thiyenawa. DP change, About change, chat wallpaper ekata photo danna puluwan!',
      type: 'text',
      timestamp: '10:16 AM',
      status: 'read',
      reactions: [{ emoji: '🔥', by: 'c1' }],
    },
    {
      id: 'm1-3',
      chatId: 'c1',
      senderId: 'c1',
      senderName: 'Kasun Perera',
      text: 'Ado supiri! Background photo ekakuth danna puluwanda? Mata screenshot ekak ewapan balanna.',
      type: 'text',
      timestamp: '10:18 AM',
      status: 'read',
      reactions: [],
    },
    {
      id: 'm1-4',
      chatId: 'c1',
      senderId: 'c1',
      senderName: 'Kasun Perera',
      type: 'voice',
      mediaDuration: 14,
      timestamp: '10:20 AM',
      status: 'delivered',
      reactions: [],
    }
  ],
  c2: [
    {
      id: 'm2-1',
      chatId: 'c2',
      senderId: 'c2',
      senderName: 'Dinuka Senanayake',
      text: 'Hey! Look at this beach view from Mirissa 🌊🌴',
      type: 'text',
      timestamp: '09:45 AM',
      status: 'read',
      reactions: [{ emoji: '❤️', by: 'user' }],
    },
    {
      id: 'm2-2',
      chatId: 'c2',
      senderId: 'c2',
      senderName: 'Dinuka Senanayake',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      text: 'Sunset view today! Beautiful evening 🌅',
      timestamp: '09:46 AM',
      status: 'read',
      reactions: [{ emoji: '😍', by: 'user' }],
    },
    {
      id: 'm2-3',
      chatId: 'c2',
      senderId: 'user',
      text: 'Wow looks incredible Dinuka! Enjoy your trip!',
      type: 'text',
      timestamp: '09:50 AM',
      status: 'read',
      reactions: [],
    }
  ],
  c3: [
    {
      id: 'm3-1',
      chatId: 'c3',
      senderId: 'Kasun',
      senderName: 'Kasun Perera',
      text: 'Welcome everyone to Chat App DCT! 🚀🇱🇰',
      type: 'text',
      timestamp: 'Yesterday',
      status: 'read',
      reactions: [{ emoji: '🎉', by: 'user' }],
    },
    {
      id: 'm3-2',
      chatId: 'c3',
      senderId: 'Dinuka',
      senderName: 'Dinuka Senanayake',
      text: 'Super fast & clean WhatsApp layout! Loving the custom wallpaper feature.',
      type: 'text',
      timestamp: '08:30 AM',
      status: 'read',
      reactions: [{ emoji: '💯', by: 'user' }],
    },
    {
      id: 'm3-3',
      chatId: 'c3',
      senderId: 'Amila',
      senderName: 'Amila Jayawardena',
      text: 'Are we doing audio/video call testing today at 6 PM?',
      type: 'text',
      timestamp: '09:12 AM',
      status: 'read',
      reactions: [],
    }
  ],
  c6: [
    {
      id: 'm6-1',
      chatId: 'c6',
      senderId: 'c6',
      senderName: 'DCT AI Assistant 🤖',
      text: 'Ayubowan! Welcome to Chat App DCT! 👋\n\nYou can send messages, voice notes, photos, change your DP & Name in Profile, or set a custom background wallpaper in Settings. How can I help you today?',
      type: 'text',
      timestamp: '10:00 AM',
      status: 'read',
      reactions: [{ emoji: '❤️', by: 'user' }],
    }
  ]
};

export const INITIAL_STATUSES: StatusStory[] = [
  {
    id: 's1',
    userId: 'c2',
    userName: 'Dinuka Senanayake',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    caption: 'Beach vibes only 🌊☀️ #Mirissa',
    timestamp: '25 minutes ago',
    isViewed: false,
  },
  {
    id: 's2',
    userId: 'c1',
    userName: 'Kasun Perera',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    content: 'Building new awesome web applications! 🚀 Keep coding!',
    backgroundColor: '#065f46',
    timestamp: '2 hours ago',
    isViewed: false,
  },
  {
    id: 's3',
    userId: 'c5',
    userName: 'Nadeesha Silva',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    caption: 'Acoustic session night 🎸🎶',
    timestamp: '5 hours ago',
    isViewed: true,
  }
];

export const INITIAL_CALLS: CallLog[] = [
  {
    id: 'call-1',
    contactId: 'c1',
    contactName: 'Kasun Perera',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'video',
    direction: 'incoming',
    timestamp: 'Today, 10:10 AM',
    duration: '4m 12s',
  },
  {
    id: 'call-2',
    contactId: 'c2',
    contactName: 'Dinuka Senanayake',
    contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'audio',
    direction: 'outgoing',
    timestamp: 'Yesterday, 8:40 PM',
    duration: '12m 45s',
  },
  {
    id: 'call-3',
    contactId: 'c4',
    contactName: 'Amila Jayawardena',
    contactAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'audio',
    direction: 'missed',
    timestamp: 'August 28, 4:20 PM',
  }
];

export const INITIAL_LINKED_DEVICES: LinkedDevice[] = [
  {
    id: 'dev-1',
    name: 'Google Chrome (Windows 11)',
    os: 'Windows',
    browser: 'Chrome',
    lastActive: 'Today at 10:48 AM',
    ipAddress: '192.248.45.12',
    location: 'Colombo, Sri Lanka',
    isCurrent: false,
  },
  {
    id: 'dev-2',
    name: 'WhatsApp Web (macOS Sonoma)',
    os: 'macOS',
    browser: 'Safari',
    lastActive: 'Yesterday at 9:15 PM',
    ipAddress: '112.134.12.80',
    location: 'Kandy, Sri Lanka',
    isCurrent: false,
  },
];

// Local storage key constants
const STORAGE_KEYS = {
  USER: 'dct_chat_user',
  CONTACTS: 'dct_chat_contacts',
  MESSAGES: 'dct_chat_messages',
  STATUSES: 'dct_chat_statuses',
  CALLS: 'dct_chat_calls',
  LINKED_DEVICES: 'dct_chat_linked_devices',
  IS_LOGGED_IN: 'dct_chat_is_logged_in',
};

export const storage = {
  getUser: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  },
  saveUser: (user: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  },
  getContacts: (): Contact[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return data ? JSON.parse(data) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  },
  saveContacts: (contacts: Contact[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (e) {
      console.error('Failed to save contacts', e);
    }
  },
  getMessages: (): Record<string, Message[]> => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  },
  saveMessages: (messages: Record<string, Message[]>) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages', e);
    }
  },
  getStatuses: (): StatusStory[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATUSES);
      return data ? JSON.parse(data) : INITIAL_STATUSES;
    } catch {
      return INITIAL_STATUSES;
    }
  },
  saveStatuses: (statuses: StatusStory[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(statuses));
    } catch (e) {
      console.error('Failed to save statuses', e);
    }
  },
  getCalls: (): CallLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CALLS);
      return data ? JSON.parse(data) : INITIAL_CALLS;
    } catch {
      return INITIAL_CALLS;
    }
  },
  saveCalls: (calls: CallLog[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(calls));
    } catch (e) {
      console.error('Failed to save calls', e);
    }
  },
  getLinkedDevices: (): LinkedDevice[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LINKED_DEVICES);
      return data ? JSON.parse(data) : INITIAL_LINKED_DEVICES;
    } catch {
      return INITIAL_LINKED_DEVICES;
    }
  },
  saveLinkedDevices: (devices: LinkedDevice[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LINKED_DEVICES, JSON.stringify(devices));
    } catch (e) {
      console.error('Failed to save linked devices', e);
    }
  },
  isLoggedIn: (): boolean => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      return val === null ? true : val === 'true';
    } catch {
      return true;
    }
  },
  setLoggedIn: (val: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, val ? 'true' : 'false');
    } catch {
      // Ignore
    }
  },
};
