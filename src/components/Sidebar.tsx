import React, { useState } from 'react';
import { 
  MessageSquare, 
  CircleDashed, 
  Phone, 
  Laptop, 
  Plus, 
  Search, 
  Sliders, 
  CheckCheck, 
  Check, 
  Pin, 
  VolumeX, 
  Camera, 
  LogOut, 
  MoreVertical,
  Image as ImageIcon,
  User as UserIcon,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Video,
  Mic
} from 'lucide-react';
import { Contact, Message, StatusStory, CallLog, UserProfile } from '../types';

interface SidebarProps {
  currentUser: UserProfile;
  contacts: Contact[];
  messages: Record<string, Message[]>;
  statuses: StatusStory[];
  calls: CallLog[];
  activeChatId: string | null;
  onSelectChat: (contactId: string) => void;
  onOpenProfile: () => void;
  onOpenLinkedDevices: () => void;
  onOpenStatusModal: (statusIndex?: number) => void;
  onOpenNewChat: () => void;
  onOpenWallpaper: () => void;
  onLogout: () => void;
  onStartCall: (contact: Contact, type: 'audio' | 'video') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  contacts,
  messages,
  statuses,
  calls,
  activeChatId,
  onSelectChat,
  onOpenProfile,
  onOpenLinkedDevices,
  onOpenStatusModal,
  onOpenNewChat,
  onOpenWallpaper,
  onLogout,
  onStartCall,
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'status' | 'calls'>('chats');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'groups'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // Unread stories count
  const unreadStatusesCount = statuses.filter((s) => !s.isViewed).length;

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.about.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (chatFilter === 'unread') return (c.unreadCount || 0) > 0;
    if (chatFilter === 'groups') return Boolean(c.isGroup);
    return true;
  });

  // Sort contacts: pinned first, then by last message timestamp
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const getLastMessage = (contactId: string): Message | null => {
    const chatMsgs = messages[contactId];
    if (!chatMsgs || chatMsgs.length === 0) return null;
    return chatMsgs[chatMsgs.length - 1];
  };

  return (
    <div className="w-full md:w-96 lg:w-[420px] h-full bg-[#111b21] flex flex-col border-r border-[#222e35] select-none">
      {/* Top Main Navigation Header */}
      <div className="h-16 px-4 bg-[#202c33] border-b border-[#222e35] flex items-center justify-between z-10 shadow-xs">
        {/* Left: User Profile Avatar with DP tooltip */}
        <button
          id="sidebar-profile-btn"
          onClick={onOpenProfile}
          className="relative group p-0.5 rounded-full hover:ring-2 hover:ring-[#00a884] transition-all cursor-pointer"
          title="Profile &amp; Settings (Change DP, Name, About)"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#222e35] bg-[#2a3942]">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-6 h-6 text-[#8696a0] m-auto mt-2" />
            )}
          </div>
        </button>

        {/* Right Tab & Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 text-[#aebac1]">
          {/* Status Stories Button */}
          <button
            id="sidebar-status-tab-btn"
            onClick={() => onOpenStatusModal()}
            className={`p-2 rounded-full hover:bg-[#374248] transition-colors relative cursor-pointer ${
              activeTab === 'status' ? 'text-[#00a884] bg-[#374248]' : 'hover:text-[#e9edef]'
            }`}
            title="Status Updates"
          >
            <CircleDashed className="w-5 h-5" />
            {unreadStatusesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00a884] ring-2 ring-[#202c33]" />
            )}
          </button>

          {/* Linked Devices Button ("add link device") */}
          <button
            id="sidebar-linked-devices-btn"
            onClick={onOpenLinkedDevices}
            className="p-2 rounded-full hover:bg-[#374248] hover:text-[#00a884] transition-colors relative cursor-pointer"
            title="Linked Devices (Link Web / PC)"
          >
            <Laptop className="w-5 h-5" />
          </button>

          {/* Chat Background Wallpaper Button */}
          <button
            id="sidebar-wallpaper-btn"
            onClick={onOpenWallpaper}
            className="p-2 rounded-full hover:bg-[#374248] hover:text-[#00a884] transition-colors cursor-pointer"
            title="Chat Wallpaper Photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* New Chat Button */}
          <button
            id="sidebar-new-chat-btn"
            onClick={onOpenNewChat}
            className="p-2 rounded-full hover:bg-[#374248] hover:text-[#00a884] transition-colors cursor-pointer"
            title="New Chat / Group"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* 3-Dot Options Menu */}
          <div className="relative">
            <button
              id="sidebar-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-[#374248] hover:text-[#e9edef] transition-colors cursor-pointer"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-11 w-48 bg-[#233138] border border-[#374248] rounded-xl shadow-2xl py-2 z-50 text-xs text-[#d1d7db] animate-in fade-in">
                <button
                  onClick={() => {
                    onOpenNewChat();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#182229] transition-colors cursor-pointer"
                >
                  New Group
                </button>
                <button
                  onClick={() => {
                    onOpenProfile();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#182229] transition-colors cursor-pointer"
                >
                  Profile &amp; DP
                </button>
                <button
                  onClick={() => {
                    onOpenLinkedDevices();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#182229] text-[#00a884] transition-colors cursor-pointer"
                >
                  Linked Devices
                </button>
                <button
                  onClick={() => {
                    onOpenWallpaper();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#182229] transition-colors cursor-pointer"
                >
                  Chat Wallpaper
                </button>
                <div className="my-1 border-t border-[#374248]" />
                <button
                  onClick={() => {
                    onLogout();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#182229] text-[#f15c6d] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out Phone</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs (Chats, Status, Calls) */}
      <div className="px-3 pt-2 pb-1 bg-[#111b21] flex items-center gap-1 border-b border-[#222e35]">
        <button
          id="tab-chats-btn"
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'chats'
              ? 'bg-[#202c33] text-[#00a884]'
              : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#202c33]/40'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chats</span>
        </button>

        <button
          id="tab-status-btn"
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'status'
              ? 'bg-[#202c33] text-[#00a884]'
              : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#202c33]/40'
          }`}
        >
          <CircleDashed className="w-3.5 h-3.5" />
          <span>Status</span>
          {unreadStatusesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#00a884]" />
          )}
        </button>

        <button
          id="tab-calls-btn"
          onClick={() => setActiveTab('calls')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'calls'
              ? 'bg-[#202c33] text-[#00a884]'
              : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#202c33]/40'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Calls</span>
        </button>
      </div>

      {/* CHATS TAB CONTENT */}
      {activeTab === 'chats' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="p-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8696a0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-chats-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or start new chat"
                className="w-full bg-[#202c33] text-xs text-[#e9edef] placeholder:text-[#8696a0] rounded-xl pl-10 pr-4 py-2 focus:outline-hidden focus:ring-1 focus:ring-[#00a884] transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mt-2 pt-0.5">
              {(['all', 'unread', 'groups'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChatFilter(filter)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer capitalize ${
                    chatFilter === filter
                      ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40'
                      : 'bg-[#202c33] text-[#8696a0] hover:text-[#e9edef] border border-transparent'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List Scrollable Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#222e35]/40">
            {sortedContacts.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-[#8696a0]">
                No chats found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              sortedContacts.map((contact) => {
                const isSelected = activeChatId === contact.id;
                const lastMsg = getLastMessage(contact.id);

                return (
                  <div
                    key={contact.id}
                    id={`chat-contact-${contact.id}`}
                    onClick={() => onSelectChat(contact.id)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors relative group ${
                      isSelected
                        ? 'bg-[#2a3942]'
                        : 'hover:bg-[#202c33]'
                    }`}
                  >
                    {/* Contact DP Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#222e35] bg-[#2a3942]">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {contact.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00a884] rounded-full border-2 border-[#111b21]" />
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-[#e9edef] truncate">
                          {contact.name}
                        </span>
                        <span className={`text-[11px] ${contact.unreadCount ? 'text-[#00a884] font-medium' : 'text-[#8696a0]'}`}>
                          {lastMsg ? lastMsg.timestamp : '10:00 AM'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-[#8696a0] truncate max-w-[200px] sm:max-w-[220px]">
                          {contact.isTyping ? (
                            <span className="text-[#00a884] font-medium animate-pulse">typing...</span>
                          ) : lastMsg ? (
                            <>
                              {lastMsg.senderId === 'user' && (
                                <span>
                                  {lastMsg.status === 'read' ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] inline" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-[#8696a0] inline" />
                                  )}
                                </span>
                              )}
                              {lastMsg.type === 'image' && <ImageIcon className="w-3.5 h-3.5 inline text-[#00a884]" />}
                              {lastMsg.type === 'voice' && <Mic className="w-3.5 h-3.5 inline text-[#00a884]" />}
                              <span className="truncate">{lastMsg.text || (lastMsg.type === 'voice' ? 'Voice note' : 'Photo')}</span>
                            </>
                          ) : (
                            <span className="truncate">{contact.about}</span>
                          )}
                        </div>

                        {/* Badges: Pinned / Unread */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {contact.pinned && (
                            <Pin className="w-3.5 h-3.5 text-[#8696a0] rotate-45" />
                          )}
                          {Boolean(contact.unreadCount && contact.unreadCount > 0) && (
                            <span className="w-5 h-5 rounded-full bg-[#00a884] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* STATUS TAB CONTENT */}
      {activeTab === 'status' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* My Status */}
          <div
            onClick={() => onOpenStatusModal()}
            className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-[#202c33] cursor-pointer transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#222e35]">
                <img src={currentUser.avatar} alt="My Status" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#00a884] rounded-full text-white flex items-center justify-center shadow-xs">
                <Plus className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#e9edef]">My Status</h3>
              <p className="text-xs text-[#8696a0]">Tap to add status update</p>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8696a0] px-2">
              Recent Updates ({statuses.length})
            </span>
            <div className="space-y-1">
              {statuses.map((story, idx) => (
                <div
                  key={story.id}
                  onClick={() => onOpenStatusModal(idx)}
                  className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-[#202c33] cursor-pointer transition-colors"
                >
                  {/* Status Ring */}
                  <div className={`w-12 h-12 rounded-full p-0.5 border-2 ${story.isViewed ? 'border-[#374248]' : 'border-[#00a884]'}`}>
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#e9edef]">{story.userName}</h4>
                    <p className="text-xs text-[#8696a0]">{story.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CALLS TAB CONTENT */}
      {activeTab === 'calls' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8696a0] px-2 block mb-1">
            Recent Calls
          </span>
          {calls.map((call) => {
            const matchedContact = contacts.find((c) => c.id === call.contactId) || contacts[0];
            return (
              <div
                key={call.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#202c33] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-[#222e35]">
                    <img src={call.contactAvatar} alt={call.contactName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#e9edef]">{call.contactName}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-[#8696a0]">
                      {call.direction === 'incoming' && <PhoneIncoming className="w-3.5 h-3.5 text-[#00a884]" />}
                      {call.direction === 'outgoing' && <PhoneOutgoing className="w-3.5 h-3.5 text-[#00a884]" />}
                      {call.direction === 'missed' && <PhoneMissed className="w-3.5 h-3.5 text-[#f15c6d]" />}
                      <span>{call.timestamp}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onStartCall(matchedContact, call.type)}
                  className="p-2 text-[#00a884] hover:bg-[#00a884]/20 rounded-full transition-colors cursor-pointer"
                  title="Call Back"
                >
                  {call.type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
