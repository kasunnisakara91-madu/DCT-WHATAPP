import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  Video, 
  Search, 
  MoreVertical, 
  Smile, 
  Paperclip, 
  Mic, 
  Send, 
  Image as ImageIcon, 
  Check, 
  CheckCheck, 
  CornerUpLeft, 
  Trash2, 
  Star, 
  X, 
  Sliders, 
  Play, 
  Pause, 
  Square, 
  Info, 
  FileText,
  Camera,
  Heart,
  ThumbsUp,
  Sparkles,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { Contact, Message, UserProfile, WallpaperConfig } from '../types';
import { soundManager } from '../utils/audio';

interface ChatAreaProps {
  contact: Contact | null;
  messages: Message[];
  currentUser: UserProfile;
  onSendMessage: (msg: Partial<Message>) => void;
  onDeleteMessage: (msgId: string) => void;
  onReactMessage: (msgId: string, emoji: string) => void;
  onStartCall: (contact: Contact, type: 'audio' | 'video') => void;
  onOpenWallpaperModal: () => void;
  onBackToSidebar?: () => void;
}

const QUICK_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🙏', '🔥', '🎉', '💯', '✨', '🇱🇰', '🚀'];

export const ChatArea: React.FC<ChatAreaProps> = ({
  contact,
  messages,
  currentUser,
  onSendMessage,
  onDeleteMessage,
  onReactMessage,
  onStartCall,
  onOpenWallpaperModal,
  onBackToSidebar,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState<boolean>(false);
  const [showContactInfo, setShowContactInfo] = useState<boolean>(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [showSearchInChat, setShowSearchInChat] = useState<boolean>(false);
  const [searchInChatQuery, setSearchInChatQuery] = useState<string>('');
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTimer, setRecordTimer] = useState<number>(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, contact?.id]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      soundManager.playRecordStart();
      setRecordTimer(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordTimer((t) => t + 1);
      }, 1000);
    } else {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    }
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, [isRecording]);

  if (!contact) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#222e35] text-[#8696a0] p-8 text-center border-b-6 border-[#00a884]">
        <div className="w-24 h-24 rounded-full bg-[#111b21] flex items-center justify-center text-[#00a884] mb-6 shadow-xl ring-8 ring-[#00a884]/10">
          <ImageIcon className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-light text-[#e9edef] mb-2">Chat App DCT for Web</h2>
        <p className="text-sm text-[#8696a0] max-w-md mb-6 leading-relaxed">
          Send and receive messages with custom wallpapers, voice notes, photos, and group chats. End-to-end encrypted.
        </p>
        <button
          id="default-change-wallpaper-btn"
          onClick={onOpenWallpaperModal}
          className="px-5 py-2.5 bg-[#00a884] hover:bg-[#02906f] text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
          <span>Customize Chat Wallpaper Photo</span>
        </button>
      </div>
    );
  }

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    soundManager.playMessageSent();
    onSendMessage({
      text: inputText.trim(),
      type: 'text',
      replyTo: replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName || 'Contact',
        text: replyingTo.text || 'Media',
        type: replyingTo.type,
      } : undefined,
    });

    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const handleSendVoiceNote = () => {
    if (!isRecording) return;
    setIsRecording(false);
    soundManager.playMessageSent();

    onSendMessage({
      type: 'voice',
      mediaDuration: Math.max(recordTimer, 2),
      text: 'Voice message',
    });
  };

  const handleCancelVoiceNote = () => {
    setIsRecording(false);
    setRecordTimer(0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          soundManager.playMessageSent();
          onSendMessage({
            type: 'image',
            mediaUrl: event.target.result as string,
            text: 'Photo message',
          });
          setShowAttachMenu(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Determine wallpaper style
  const activeWallpaper: WallpaperConfig = contact.customWallpaper || currentUser.wallpaper;

  const filteredMessages = searchInChatQuery.trim()
    ? messages.filter((m) => m.text?.toLowerCase().includes(searchInChatQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative overflow-hidden">
      {/* Top Chat Bar Header */}
      <div className="h-16 px-4 bg-[#202c33] border-b border-[#222e35] flex items-center justify-between z-20 shadow-xs">
        {/* Left: Avatar & Contact Status */}
        <div className="flex items-center gap-3 min-w-0">
          {onBackToSidebar && (
            <button
              onClick={onBackToSidebar}
              className="md:hidden p-1 text-[#8696a0] hover:text-[#e9edef] -ml-1 cursor-pointer"
            >
              <CornerUpLeft className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={() => setShowContactInfo(true)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#222e35] group-hover:scale-105 transition-transform bg-[#2a3942]">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#202c33]" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-[#e9edef] truncate group-hover:text-[#00a884] transition-colors">
                {contact.name}
              </h2>
              <p className="text-xs text-[#8696a0] truncate">
                {contact.isTyping ? (
                  <span className="text-[#00a884] font-medium animate-pulse">typing...</span>
                ) : contact.isGroup ? (
                  <span>{contact.groupMembers?.join(', ')}</span>
                ) : contact.isOnline ? (
                  <span className="text-[#00a884]">online</span>
                ) : (
                  <span>last seen {contact.lastSeen}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 text-[#aebac1]">
          {/* Custom Wallpaper Photo button */}
          <button
            id="chat-change-wallpaper-action-btn"
            onClick={onOpenWallpaperModal}
            className="p-2 hover:bg-[#374248] rounded-full hover:text-[#00a884] transition-colors cursor-pointer"
            title="Change Chat Background Photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Voice Call */}
          <button
            id="start-voice-call-btn"
            onClick={() => onStartCall(contact, 'audio')}
            className="p-2 hover:bg-[#374248] rounded-full hover:text-[#00a884] transition-colors cursor-pointer"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>

          {/* Video Call */}
          <button
            id="start-video-call-btn"
            onClick={() => onStartCall(contact, 'video')}
            className="p-2 hover:bg-[#374248] rounded-full hover:text-[#00a884] transition-colors cursor-pointer"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>

          {/* Search in chat */}
          <button
            id="search-in-chat-toggle-btn"
            onClick={() => setShowSearchInChat(!showSearchInChat)}
            className="p-2 hover:bg-[#374248] rounded-full hover:text-[#e9edef] transition-colors cursor-pointer"
            title="Search in chat"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Options Dropdown Menu */}
          <div className="relative">
            <button
              id="chat-more-options-btn"
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 hover:bg-[#374248] rounded-full hover:text-[#e9edef] transition-colors cursor-pointer"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showOptionsMenu && (
              <div className="absolute right-0 top-11 w-48 bg-[#233138] border border-[#374248] rounded-xl shadow-xl py-2 z-50 text-xs text-[#d1d7db] animate-in fade-in">
                <button
                  onClick={() => {
                    setShowContactInfo(true);
                    setShowOptionsMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#182229] transition-colors cursor-pointer"
                >
                  Contact Info &amp; DP
                </button>
                <button
                  onClick={() => {
                    onOpenWallpaperModal();
                    setShowOptionsMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#182229] transition-colors cursor-pointer text-[#00a884]"
                >
                  Change Background Wallpaper
                </button>
                <button
                  onClick={() => {
                    setShowSearchInChat(true);
                    setShowOptionsMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#182229] transition-colors cursor-pointer"
                >
                  Search in Chat
                </button>
                <button
                  onClick={() => {
                    messages.forEach((m) => onDeleteMessage(m.id));
                    setShowOptionsMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#182229] text-[#f15c6d] transition-colors cursor-pointer"
                >
                  Clear Chat Messages
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* In-Chat Search Bar overlay */}
      {showSearchInChat && (
        <div className="px-4 py-2 bg-[#182229] border-b border-[#222e35] flex items-center gap-3 z-10 animate-in slide-in-from-top-2">
          <Search className="w-4 h-4 text-[#8696a0]" />
          <input
            type="text"
            value={searchInChatQuery}
            onChange={(e) => setSearchInChatQuery(e.target.value)}
            placeholder="Search messages..."
            autoFocus
            className="flex-1 bg-transparent text-xs text-[#e9edef] focus:outline-hidden"
          />
          <button
            onClick={() => {
              setShowSearchInChat(false);
              setSearchInChatQuery('');
            }}
            className="p-1 text-[#8696a0] hover:text-[#e9edef] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Chat Messages Stage with Wallpaper Background */}
      <div className="flex-1 relative overflow-y-auto p-4 sm:p-6 space-y-3">
        {/* Background Wallpaper Photo Layer */}
        {activeWallpaper.type === 'color' ? (
          <div
            className="absolute inset-0 transition-all duration-300 pointer-events-none"
            style={{ backgroundColor: activeWallpaper.value }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300 pointer-events-none"
            style={{
              backgroundImage: `url(${activeWallpaper.value})`,
              opacity: activeWallpaper.opacity,
              filter: activeWallpaper.blur > 0 ? `blur(${activeWallpaper.blur}px)` : undefined,
            }}
          />
        )}

        {/* Date Divider Badge */}
        <div className="relative z-10 flex justify-center my-2">
          <div className="bg-[#182229]/90 backdrop-blur-xs text-[#8696a0] text-[11px] font-medium px-3 py-1 rounded-lg border border-[#222e35] shadow-xs">
            Today
          </div>
        </div>

        {/* Security message pill */}
        <div className="relative z-10 flex justify-center mb-4">
          <div className="bg-[#182229]/90 text-[#ffe2a4] text-[11px] px-4 py-2 rounded-lg border border-[#ffe2a4]/20 shadow-xs max-w-sm text-center">
            🔒 Messages and calls are end-to-end encrypted. No one outside of this chat, not even Chat App DCT, can read or listen to them.
          </div>
        </div>

        {/* Messages List */}
        <div className="relative z-10 space-y-2.5">
          {filteredMessages.map((msg) => {
            const isMe = msg.senderId === 'user';
            return (
              <div
                key={msg.id}
                onMouseEnter={() => setHoveredMessageId(msg.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
                className={`flex flex-col group relative ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`relative max-w-[85%] sm:max-w-[70%] rounded-xl px-3 py-1.5 shadow-md transition-all ${
                    isMe
                      ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-xs'
                      : 'bg-[#202c33] text-[#e9edef] rounded-tl-xs'
                  }`}
                >
                  {/* Replied Message Preview */}
                  {msg.replyTo && (
                    <div className="mb-1 p-1.5 rounded-lg bg-black/25 border-l-3 border-[#00a884] text-xs space-y-0.5">
                      <span className="font-semibold text-[#00a884] block text-[11px]">
                        {msg.replyTo.senderName}
                      </span>
                      <p className="text-[#8696a0] truncate text-[11px]">{msg.replyTo.text}</p>
                    </div>
                  )}

                  {/* Sender Name for Group Chats */}
                  {!isMe && contact.isGroup && msg.senderName && (
                    <span className="text-xs font-semibold text-[#53bdeb] block mb-0.5">
                      {msg.senderName}
                    </span>
                  )}

                  {/* Text Message */}
                  {msg.type === 'text' && (
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed pr-14">
                      {msg.text}
                    </p>
                  )}

                  {/* Image Message */}
                  {msg.type === 'image' && (
                    <div className="space-y-1.5">
                      <div className="rounded-lg overflow-hidden max-h-72 bg-black/40">
                        <img
                          src={msg.mediaUrl}
                          alt="Shared media"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover cursor-pointer hover:scale-102 transition-transform"
                        />
                      </div>
                      {msg.text && (
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed pr-14">
                          {msg.text}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Voice Note Message */}
                  {msg.type === 'voice' && (
                    <div className="flex items-center gap-3 py-1 pr-14 min-w-[200px]">
                      <button
                        onClick={() => {
                          if (playingVoiceId === msg.id) {
                            setPlayingVoiceId(null);
                          } else {
                            setPlayingVoiceId(msg.id);
                            soundManager.playMessageReceived();
                            setTimeout(() => setPlayingVoiceId(null), (msg.mediaDuration || 5) * 1000);
                          }
                        }}
                        className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-md shrink-0 cursor-pointer"
                      >
                        {playingVoiceId === msg.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>

                      {/* Simulated Audio Waveform */}
                      <div className="flex-1 flex items-center gap-0.5 h-6">
                        {[12, 24, 16, 28, 20, 10, 22, 14, 26, 18, 8, 20, 14, 10].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all ${
                              playingVoiceId === msg.id ? 'bg-[#00a884] animate-pulse' : 'bg-[#8696a0]'
                            }`}
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>

                      <span className="text-[11px] text-[#8696a0] font-mono">
                        0:{(msg.mediaDuration || 10).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}

                  {/* Timestamp & Status Ticks */}
                  <div className="absolute right-2 bottom-1 flex items-center gap-1 text-[10px] text-[#8696a0] select-none">
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <span>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-[#8696a0]" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-[#8696a0]" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reactions Pill Display */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex gap-1 -mt-1.5 z-10">
                    {msg.reactions.map((r, i) => (
                      <span
                        key={i}
                        className="bg-[#202c33] border border-[#374248] rounded-full px-1.5 py-0.5 text-xs shadow-md"
                      >
                        {r.emoji}
                      </span>
                    ))}
                  </div>
                )}

                {/* Hover Quick Action Buttons */}
                {hoveredMessageId === msg.id && (
                  <div
                    className={`absolute top-0 flex items-center gap-1 p-1 bg-[#182229] border border-[#222e35] rounded-xl shadow-lg z-20 animate-in fade-in ${
                      isMe ? 'right-full mr-2' : 'left-full ml-2'
                    }`}
                  >
                    {/* Emoji Reaction Picker Bar */}
                    <div className="flex items-center gap-0.5 border-r border-[#222e35] pr-1 mr-1">
                      {['❤️', '👍', '😂', '🔥'].map((emo) => (
                        <button
                          key={emo}
                          onClick={() => onReactMessage(msg.id, emo)}
                          className="hover:scale-125 transition-transform p-0.5 text-xs cursor-pointer"
                        >
                          {emo}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="p-1 hover:text-[#00a884] text-[#8696a0] transition-colors cursor-pointer"
                      title="Reply"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="p-1 hover:text-red-400 text-[#8696a0] transition-colors cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Replying Banner */}
      {replyingTo && (
        <div className="bg-[#202c33] px-4 py-2 border-t border-[#222e35] flex items-center justify-between z-20 animate-in slide-in-from-bottom-2">
          <div className="border-l-3 border-[#00a884] pl-3 text-xs">
            <span className="font-semibold text-[#00a884] block">
              Replying to {replyingTo.senderName || 'Contact'}
            </span>
            <p className="text-[#8696a0] truncate">{replyingTo.text || 'Media'}</p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 text-[#8696a0] hover:text-[#e9edef] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="bg-[#202c33] px-4 py-3 border-t border-[#222e35] flex items-center gap-2 sm:gap-3 z-20">
        {isRecording ? (
          /* Voice Recording Mode Bar */
          <div className="flex-1 flex items-center justify-between bg-[#111b21] rounded-2xl px-4 py-2.5 border border-red-500/40">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs text-red-400 font-medium">Recording Voice Note...</span>
              <span className="font-mono text-xs text-[#e9edef]">
                0:{(recordTimer).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="cancel-voice-record-btn"
                onClick={handleCancelVoiceNote}
                className="p-1.5 text-[#8696a0] hover:text-red-400 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                id="send-voice-record-btn"
                onClick={handleSendVoiceNote}
                className="p-2 bg-[#00a884] hover:bg-[#02906f] text-white rounded-full transition-transform hover:scale-105 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Standard Text & Media Message Input */
          <>
            {/* Emoji Toggle */}
            <div className="relative">
              <button
                id="emoji-picker-toggle-btn"
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Quick Emojis Flyout */}
              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 bg-[#233138] border border-[#374248] p-3 rounded-2xl shadow-2xl z-50 flex flex-wrap gap-2 w-64 animate-in fade-in">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setInputText((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-lg p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Attachment Button & Menu */}
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                id="attach-menu-toggle-btn"
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {showAttachMenu && (
                <div className="absolute bottom-12 left-0 bg-[#233138] border border-[#374248] p-3 rounded-2xl shadow-2xl z-50 space-y-2 w-48 animate-in fade-in">
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#182229] text-xs text-[#e9edef] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#bf59cf] flex items-center justify-center text-white">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span>Photos &amp; Videos</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenWallpaperModal();
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#182229] text-xs text-[#e9edef] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <span>Chat Wallpaper</span>
                  </button>
                </div>
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendText} className="flex-1 flex items-center">
              <input
                id="chat-message-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-[#2a3942] text-sm text-[#e9edef] placeholder:text-[#8696a0] rounded-xl px-4 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#00a884] transition-all"
              />
            </form>

            {/* Voice Record / Send Button */}
            {inputText.trim() ? (
              <button
                id="send-message-btn"
                onClick={handleSendText}
                className="p-2.5 bg-[#00a884] hover:bg-[#02906f] text-white rounded-full transition-transform hover:scale-105 shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="start-voice-record-btn"
                onClick={() => setIsRecording(true)}
                className="p-2.5 text-[#8696a0] hover:text-[#00a884] hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
                title="Record voice note"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Right Drawer: Contact Info & Chat Details */}
      {showContactInfo && (
        <div className="absolute inset-y-0 right-0 w-full sm:w-80 bg-[#111b21] z-40 border-l border-[#222e35] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="h-16 px-4 bg-[#202c33] border-b border-[#222e35] flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#e9edef]">Contact Info</h3>
            <button
              onClick={() => setShowContactInfo(false)}
              className="p-1.5 text-[#8696a0] hover:text-[#e9edef] rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Contact Large DP */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#202c33] shadow-xl bg-[#2a3942]">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#e9edef]">{contact.name}</h4>
                {contact.phone && <p className="text-xs text-[#8696a0] font-mono">{contact.phone}</p>}
              </div>
            </div>

            {/* About line */}
            <div className="bg-[#202c33] p-4 rounded-2xl border border-[#222e35] space-y-1">
              <span className="text-xs font-semibold text-[#00a884] uppercase tracking-wider">About</span>
              <p className="text-sm text-[#d1d7db]">{contact.about}</p>
            </div>

            {/* Custom Chat Wallpaper Button */}
            <div className="bg-[#202c33] p-4 rounded-2xl border border-[#222e35] space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-[#e9edef]">
                <ImageIcon className="w-4 h-4 text-[#00a884]" />
                <span>Chat Wallpaper</span>
              </div>
              <p className="text-xs text-[#8696a0]">
                Set a specific background wallpaper photo for {contact.name}.
              </p>
              <button
                onClick={() => {
                  onOpenWallpaperModal();
                  setShowContactInfo(false);
                }}
                className="w-full py-2 bg-[#00a884]/20 hover:bg-[#00a884]/30 text-[#00a884] font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Change Wallpaper Photo
              </button>
            </div>

            {/* Media & Links */}
            <div className="bg-[#202c33] p-4 rounded-2xl border border-[#222e35] space-y-2">
              <span className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider">
                Media, Links and Docs
              </span>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {messages
                  .filter((m) => m.type === 'image')
                  .slice(0, 3)
                  .map((m) => (
                    <div key={m.id} className="h-16 rounded-lg overflow-hidden bg-black/40">
                      <img src={m.mediaUrl} alt="media" className="w-full h-full object-cover" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
