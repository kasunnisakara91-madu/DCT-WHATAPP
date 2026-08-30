import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Check, 
  Pencil, 
  Smile, 
  Upload, 
  Trash2, 
  Sparkles,
  Info,
  Phone,
  User as UserIcon,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile } from '../types';
import { DEFAULT_AVATARS } from '../utils/storage';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenWallpaper: () => void;
}

const PRESET_ABOUTS = [
  'Hey there! I am using Chat App DCT 🚀',
  'Available',
  'Busy',
  'At work 💼',
  'In a meeting 📞',
  'At the gym 🏋️‍♂️',
  'Sleeping 😴',
  'Urgent calls only ⚠️',
  'Coding new web applications 💻',
  'Battery about to die 🪫',
];

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onOpenWallpaper,
}) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(user.name);
  const [isEditingAbout, setIsEditingAbout] = useState<boolean>(false);
  const [aboutInput, setAboutInput] = useState<string>(user.about);
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateUser({ name: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  const handleSaveAbout = () => {
    if (aboutInput.trim()) {
      onUpdateUser({ about: aboutInput.trim() });
    }
    setIsEditingAbout(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateUser({ avatar: event.target.result as string });
          setShowAvatarPicker(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-[#111b21] flex flex-col animate-in slide-in-from-left duration-250 border-r border-[#222e35]">
      {/* Header */}
      <div className="h-28 bg-[#202c33] flex items-end px-5 pb-4 text-[#e9edef] gap-6 border-b border-[#222e35]">
        <button
          id="close-profile-drawer-btn"
          onClick={onClose}
          className="p-1 text-[#d1d7db] hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold tracking-wide">Profile &amp; Settings</h2>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* DP (Profile Picture) Section */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative group">
            <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-[#202c33] shadow-xl bg-[#2a3942] flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-20 h-20 text-[#8696a0]" />
              )}
            </div>

            {/* Hover overlay for changing DP */}
            <button
              id="change-dp-overlay-btn"
              onClick={() => setShowAvatarPicker(true)}
              className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer p-4 text-center"
            >
              <Camera className="w-8 h-8 mb-1 text-[#00a884]" />
              <span className="text-xs font-semibold uppercase tracking-wider">Change Profile Photo</span>
            </button>

            {/* Quick Camera Float Button */}
            <button
              id="quick-camera-dp-btn"
              onClick={() => setShowAvatarPicker(true)}
              className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-[#8696a0] mt-3">Tap on the photo to change DP</p>
        </div>

        {/* Avatar Picker / DP Uploader Options */}
        {showAvatarPicker && (
          <div className="p-4 bg-[#202c33] rounded-2xl border border-[#222e35] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00a884] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Choose Profile Picture
              </span>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="text-xs text-[#8696a0] hover:text-[#e9edef] cursor-pointer"
              >
                Done
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                id="upload-dp-from-gallery-btn"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 bg-[#111b21] hover:bg-[#2a3942] rounded-xl border border-[#374248] text-[#e9edef] text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-[#00a884]" />
                <span>Upload from Gallery</span>
              </button>
              <button
                id="remove-current-dp-btn"
                onClick={() => {
                  onUpdateUser({ avatar: '' });
                  setShowAvatarPicker(false);
                }}
                className="py-2.5 px-3 bg-[#111b21] hover:bg-[#2a3942] rounded-xl border border-[#374248] text-[#f15c6d] text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Photo</span>
              </button>
            </div>

            {/* Avatar Presets */}
            <div className="space-y-2">
              <span className="text-xs text-[#8696a0]">Or choose from ready-made avatars:</span>
              <div className="grid grid-cols-4 gap-2.5">
                {DEFAULT_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onUpdateUser({ avatar: av });
                      setShowAvatarPicker(false);
                    }}
                    className="w-14 h-14 rounded-full overflow-hidden border-2 border-transparent hover:border-[#00a884] transition-all hover:scale-105 cursor-pointer mx-auto"
                  >
                    <img
                      src={av}
                      alt="avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Change Name Section */}
        <div className="space-y-2 bg-[#202c33]/50 p-4 rounded-2xl border border-[#222e35]">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#00a884] flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5" /> Your Name
          </label>

          {isEditingName ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 border-b-2 border-[#00a884] pb-1">
                <input
                  id="profile-name-input"
                  type="text"
                  value={nameInput}
                  maxLength={25}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  autoFocus
                  className="w-full bg-transparent text-sm text-[#e9edef] focus:outline-hidden"
                />
                <span className="text-xs text-[#8696a0] font-mono">{25 - nameInput.length}</span>
                <button
                  id="save-profile-name-btn"
                  onClick={handleSaveName}
                  className="p-1 text-[#00a884] hover:text-[#02906f] cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[11px] text-[#8696a0]">
                This is not your username or pin. This name will be visible to your WhatsApp contacts.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <span className="text-base font-medium text-[#e9edef]">{user.name}</span>
              <button
                id="edit-profile-name-btn"
                onClick={() => {
                  setNameInput(user.name);
                  setIsEditingName(true);
                }}
                className="p-1 text-[#8696a0] hover:text-[#00a884] transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Change About / Status Section */}
        <div className="space-y-2 bg-[#202c33]/50 p-4 rounded-2xl border border-[#222e35]">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#00a884] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> About
          </label>

          {isEditingAbout ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b-2 border-[#00a884] pb-1">
                <input
                  id="profile-about-input"
                  type="text"
                  value={aboutInput}
                  maxLength={100}
                  onChange={(e) => setAboutInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveAbout()}
                  autoFocus
                  className="w-full bg-transparent text-sm text-[#e9edef] focus:outline-hidden"
                />
                <button
                  id="save-profile-about-btn"
                  onClick={handleSaveAbout}
                  className="p-1 text-[#00a884] hover:text-[#02906f] cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>

              {/* Presets List */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-[#8696a0]">Select from presets:</span>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                  {PRESET_ABOUTS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAboutInput(preset);
                        onUpdateUser({ about: preset });
                        setIsEditingAbout(false);
                      }}
                      className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-[#111b21] hover:bg-[#2a3942] text-[#d1d7db] hover:text-white transition-colors cursor-pointer truncate"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-[#d1d7db]">{user.about}</span>
              <button
                id="edit-profile-about-btn"
                onClick={() => {
                  setAboutInput(user.about);
                  setIsEditingAbout(true);
                }}
                className="p-1 text-[#8696a0] hover:text-[#00a884] transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Phone Number Info */}
        <div className="space-y-1 bg-[#202c33]/50 p-4 rounded-2xl border border-[#222e35]">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#00a884] flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> Phone Number
          </label>
          <div className="text-sm font-mono text-[#e9edef] pt-1">
            {user.countryCode} {user.phone}
          </div>
          <p className="text-[11px] text-[#8696a0] pt-1">
            Registered with Chat App DCT
          </p>
        </div>

        {/* Quick Wallpaper shortcut */}
        <div className="bg-[#202c33]/50 p-4 rounded-2xl border border-[#222e35] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-[#e9edef]">
              <ImageIcon className="w-4 h-4 text-[#00a884]" />
              <span>Chat Wallpaper</span>
            </div>
            <button
              id="open-wallpaper-from-profile-btn"
              onClick={onOpenWallpaper}
              className="px-3 py-1.5 bg-[#00a884]/20 hover:bg-[#00a884]/30 text-[#00a884] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Change Photo
            </button>
          </div>
          <p className="text-xs text-[#8696a0]">
            Customize the background photo &amp; brightness for all your chats.
          </p>
        </div>
      </div>
    </div>
  );
};
