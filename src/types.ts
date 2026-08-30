export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  countryCode: string;
  avatar: string;
  about: string;
  createdAt: string;
  theme: 'light' | 'dark' | 'system';
  wallpaper: WallpaperConfig;
  soundEnabled: boolean;
  onlineStatusVisibility: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
}

export interface WallpaperConfig {
  type: 'custom' | 'doodle' | 'color' | 'preset';
  value: string; // image url or base64 or color code
  opacity: number; // 0 to 1
  blur: number; // in px
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  about: string;
  isOnline: boolean;
  lastSeen: string;
  isTyping?: boolean;
  isGroup?: boolean;
  membersCount?: number;
  groupMembers?: string[];
  unreadCount: number;
  pinned?: boolean;
  muted?: boolean;
  customWallpaper?: WallpaperConfig;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Reaction {
  emoji: string;
  by: string; // 'user' or contact id
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string; // 'user' or contact id
  senderName?: string;
  text?: string;
  type: 'text' | 'image' | 'voice' | 'file' | 'location' | 'contact_card';
  mediaUrl?: string;
  mediaDuration?: number; // for audio
  fileName?: string;
  fileSize?: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  contactShared?: {
    name: string;
    phone: string;
    avatar?: string;
  };
  timestamp: string;
  status: MessageStatus;
  reactions: Reaction[];
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
    type: string;
  };
  isStarred?: boolean;
  isDeleted?: boolean;
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'text' | 'image';
  content: string; // text or image url
  backgroundColor?: string; // for text stories
  caption?: string;
  timestamp: string;
  isViewed: boolean;
  viewers?: string[];
}

export interface CallLog {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export interface LinkedDevice {
  id: string;
  name: string; // e.g. "Google Chrome (Windows)", "WhatsApp Web (Mac OS)"
  os: 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS' | 'Web';
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Opera' | 'Other';
  lastActive: string;
  ipAddress?: string;
  location?: string;
  isCurrent?: boolean;
}
