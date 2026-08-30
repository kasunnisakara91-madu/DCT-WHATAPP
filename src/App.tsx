/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserProfile, 
  Contact, 
  Message, 
  StatusStory, 
  CallLog, 
  LinkedDevice, 
  WallpaperConfig 
} from './types';
import { storage } from './utils/storage';
import { soundManager } from './utils/audio';

import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ProfileDrawer } from './components/ProfileDrawer';
import { LinkedDevicesModal } from './components/LinkedDevicesModal';
import { WallpaperModal } from './components/WallpaperModal';
import { StatusViewModal } from './components/StatusViewModal';
import { CallModal } from './components/CallModal';
import { NewChatModal } from './components/NewChatModal';

export default function App() {
  // Main states
  const [user, setUser] = useState<UserProfile>(() => storage.getUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => storage.isLoggedIn());
  const [contacts, setContacts] = useState<Contact[]>(() => storage.getContacts());
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => storage.getMessages());
  const [statuses, setStatuses] = useState<StatusStory[]>(() => storage.getStatuses());
  const [calls, setCalls] = useState<CallLog[]>(() => storage.getCalls());
  const [linkedDevices, setLinkedDevices] = useState<LinkedDevice[]>(() => storage.getLinkedDevices());
  
  // Active chat state
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const savedContacts = storage.getContacts();
    return savedContacts.length > 0 ? savedContacts[0].id : null;
  });

  // Modal states
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isLinkedDevicesOpen, setIsLinkedDevicesOpen] = useState<boolean>(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [statusInitialIndex, setStatusInitialIndex] = useState<number>(0);
  const [isNewChatOpen, setIsNewChatOpen] = useState<boolean>(false);
  const [activeCall, setActiveCall] = useState<{ contact: Contact; type: 'audio' | 'video' } | null>(null);

  // Sync state to local storage
  useEffect(() => {
    storage.saveUser(user);
  }, [user]);

  useEffect(() => {
    storage.saveContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    storage.saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    storage.saveStatuses(statuses);
  }, [statuses]);

  useEffect(() => {
    storage.saveCalls(calls);
  }, [calls]);

  useEffect(() => {
    storage.saveLinkedDevices(linkedDevices);
  }, [linkedDevices]);

  useEffect(() => {
    storage.setLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSelectChat = (contactId: string) => {
    setActiveChatId(contactId);
    // Mark messages as read & reset unread count
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, unreadCount: 0 } : c))
    );
    setMessages((prev) => {
      const chatMsgs = prev[contactId] || [];
      const updatedMsgs = chatMsgs.map((m) =>
        m.senderId !== 'user' && m.status !== 'read' ? { ...m, status: 'read' as const } : m
      );
      return { ...prev, [contactId]: updatedMsgs };
    });
  };

  // Automated simulated AI/Contact reply generator
  const triggerAutoReply = useCallback((contactId: string, userText: string) => {
    const matchedContact = contacts.find((c) => c.id === contactId);
    if (!matchedContact) return;

    // Show typing indicator
    setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, isTyping: true } : c))
      );
    }, 600);

    // Send reply after delay
    setTimeout(() => {
      let replyText = 'Thanks for your message! Looking forward to it 👍';
      const textLower = userText.toLowerCase();

      if (contactId === 'c6') {
        // DCT AI Assistant Bot
        if (textLower.includes('dp') || textLower.includes('photo') || textLower.includes('photo')) {
          replyText = 'Profile DP එක වෙනස් කරන්න උඩ වම් පැත්තේ තියෙන Profile icon එක ඔබන්න! එතනින් කැමති photo එකක් upload කරන්න හෝ avatar එකක් තෝරන්න පුළුවන්. 📸✨';
        } else if (textLower.includes('wallpaper') || textLower.includes('background')) {
          replyText = 'Chat Wallpaper වෙනස් කරන්න උඩ තියෙන Image/Wallpaper icon එක click කරන්න. එතනින් Gallery එකෙන් photo එකක් දාලා opacity & blur adjust කරන්න පුළුවන්! 🖼️';
        } else if (textLower.includes('link') || textLower.includes('device')) {
          replyText = 'Linked Devices මඟින් ඔබේ PC එකට හෝ Web browser එකට Chat App DCT connect කරගන්න පුළුවන්. QR Code එකෙන් හෝ 8-character pairing code එකෙන් link කරන්න! 💻📱';
        } else {
          replyText = `Ayubowan! Chat App DCT වෙතින් ඔබට පිළිතුරු: "${userText}" කියන message එක ලැබුණා. ඔබට අවශ්‍ය Profile DP change, About change, Wallpaper change, සහ Link Device පහසුකම් මෙහි ඇත! 🚀🇱🇰`;
        }
      } else if (contactId === 'c1') {
        // Kasun Perera
        if (textLower.includes('wallpaper') || textLower.includes('photo')) {
          replyText = 'Ado background photo feature eka supiri! Mama dark mode ekath ekka wallpaper ekak dagaththa. Ela machan!';
        } else if (textLower.includes('dp') || textLower.includes('name')) {
          replyText = 'DP ekai Name ekai maru una eka penawa machan! Patta look eka 🔥';
        } else {
          replyText = 'Ela ela machan! DCT app eka niyamata wada. Call ekak gamuda passe?';
        }
      } else if (contactId === 'c2') {
        replyText = 'Sunset photos are looking great! Let me know when you are free for a video call 🌊🏖️';
      }

      const replyMsg: Message = {
        id: `msg-${Date.now()}`,
        chatId: contactId,
        senderId: contactId,
        senderName: matchedContact.name,
        text: replyText,
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
        reactions: [],
      };

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), replyMsg],
      }));

      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? { ...c, isTyping: false, lastSeen: 'online' }
            : c
        )
      );

      soundManager.playMessageReceived();
    }, 2200);
  }, [contacts]);

  const handleSendMessage = (msgData: Partial<Message>) => {
    if (!activeChatId) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChatId,
      senderId: 'user',
      senderName: user.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      reactions: [],
      ...msgData,
    } as Message;

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    // Simulate single tick -> double tick -> blue tick
    setTimeout(() => {
      setMessages((prev) => {
        const chatMsgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: chatMsgs.map((m) =>
            m.id === newMsg.id ? { ...m, status: 'delivered' as const } : m
          ),
        };
      });
    }, 800);

    setTimeout(() => {
      setMessages((prev) => {
        const chatMsgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: chatMsgs.map((m) =>
            m.id === newMsg.id ? { ...m, status: 'read' as const } : m
          ),
        };
      });
    }, 1500);

    // Auto-trigger response if text message
    if (newMsg.text && (activeChatId === 'c1' || activeChatId === 'c6' || activeChatId === 'c2')) {
      triggerAutoReply(activeChatId, newMsg.text);
    }
  };

  const handleDeleteMessage = (msgId: string) => {
    if (!activeChatId) return;
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).filter((m) => m.id !== msgId),
    }));
  };

  const handleReactMessage = (msgId: string, emoji: string) => {
    if (!activeChatId) return;
    setMessages((prev) => {
      const chatMsgs = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: chatMsgs.map((m) => {
          if (m.id !== msgId) return m;
          const existingReactions = m.reactions || [];
          const already = existingReactions.find((r) => r.by === 'user');
          let updatedReactions;
          if (already) {
            updatedReactions = existingReactions.map((r) =>
              r.by === 'user' ? { ...r, emoji } : r
            );
          } else {
            updatedReactions = [...existingReactions, { emoji, by: 'user' }];
          }
          return { ...m, reactions: updatedReactions };
        }),
      };
    });
  };

  const handleAddContact = (newContact: Contact) => {
    setContacts((prev) => [newContact, ...prev]);
    setActiveChatId(newContact.id);
  };

  const handleAddLinkedDevice = (device: LinkedDevice) => {
    setLinkedDevices((prev) => [device, ...prev]);
  };

  const handleRemoveLinkedDevice = (deviceId: string) => {
    setLinkedDevices((prev) => prev.filter((d) => d.id !== deviceId));
  };

  const handleAddStatus = (status: StatusStory) => {
    setStatuses((prev) => [status, ...prev]);
  };

  const handleReplyToStatus = (story: StatusStory, text: string) => {
    // Send as message to the story owner
    const contactId = story.userId;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: contactId,
      senderId: 'user',
      senderName: user.name,
      text: `Replied to status: "${text}"`,
      type: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      reactions: [],
    };

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMsg],
    }));
    setActiveChatId(contactId);
  };

  const handleStartCall = (contact: Contact, type: 'audio' | 'video') => {
    setActiveCall({ contact, type });
    // Add to call logs
    const newCall: CallLog = {
      id: `call-${Date.now()}`,
      contactId: contact.id,
      contactName: contact.name,
      contactAvatar: contact.avatar,
      type: type,
      direction: 'outgoing',
      timestamp: 'Just now',
    };
    setCalls((prev) => [newCall, ...prev]);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const handleSaveWallpaper = (wallpaper: WallpaperConfig) => {
    setUser((prev) => ({
      ...prev,
      wallpaper,
    }));
  };

  const activeContact = contacts.find((c) => c.id === activeChatId) || null;
  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  // If not logged in, show WhatsApp Phone Login & Verification Screen
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} currentUser={user} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0c1317] flex items-center justify-center font-sans antialiased text-[#e9edef]">
      {/* WhatsApp Window Frame */}
      <div className="w-full h-full max-w-[1700px] flex overflow-hidden shadow-2xl relative">
        {/* Left Sidebar */}
        <Sidebar
          currentUser={user}
          contacts={contacts}
          messages={messages}
          statuses={statuses}
          calls={calls}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenLinkedDevices={() => setIsLinkedDevicesOpen(true)}
          onOpenStatusModal={(idx = 0) => {
            setStatusInitialIndex(idx);
            setIsStatusModalOpen(true);
          }}
          onOpenNewChat={() => setIsNewChatOpen(true)}
          onOpenWallpaper={() => setIsWallpaperModalOpen(true)}
          onLogout={handleLogout}
          onStartCall={handleStartCall}
        />

        {/* Right Chat Area */}
        <ChatArea
          contact={activeContact}
          messages={activeMessages}
          currentUser={user}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          onReactMessage={handleReactMessage}
          onStartCall={handleStartCall}
          onOpenWallpaperModal={() => setIsWallpaperModalOpen(true)}
          onBackToSidebar={() => setActiveChatId(null)}
        />

        {/* Profile & Settings Drawer */}
        <ProfileDrawer
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          onUpdateUser={handleUpdateUser}
          onOpenWallpaper={() => {
            setIsProfileOpen(false);
            setIsWallpaperModalOpen(true);
          }}
        />

        {/* Linked Devices Modal ("add link device") */}
        <LinkedDevicesModal
          isOpen={isLinkedDevicesOpen}
          onClose={() => setIsLinkedDevicesOpen(false)}
          devices={linkedDevices}
          onAddDevice={handleAddLinkedDevice}
          onRemoveDevice={handleRemoveLinkedDevice}
        />

        {/* Chat Background Wallpaper Customizer Modal */}
        <WallpaperModal
          isOpen={isWallpaperModalOpen}
          onClose={() => setIsWallpaperModalOpen(false)}
          currentWallpaper={user.wallpaper}
          onSaveWallpaper={handleSaveWallpaper}
          title="Chat Background Wallpaper Photo"
        />

        {/* WhatsApp Status Viewer Modal */}
        <StatusViewModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          statuses={statuses}
          user={user}
          initialIndex={statusInitialIndex}
          onAddStatus={handleAddStatus}
          onReplyToStatus={handleReplyToStatus}
        />

        {/* Audio & Video Call Modal */}
        <CallModal
          isOpen={Boolean(activeCall)}
          contact={activeCall?.contact || null}
          type={activeCall?.type || 'audio'}
          onEndCall={handleEndCall}
        />

        {/* New Chat & Contact Modal */}
        <NewChatModal
          isOpen={isNewChatOpen}
          onClose={() => setIsNewChatOpen(false)}
          onAddContact={handleAddContact}
          onSelectExisting={handleSelectChat}
          existingContacts={contacts}
        />
      </div>
    </div>
  );
}
