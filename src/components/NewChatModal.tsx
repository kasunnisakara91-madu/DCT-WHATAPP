import React, { useState, useRef } from 'react';
import { 
  X, 
  UserPlus, 
  Users, 
  Search, 
  Phone, 
  User, 
  Camera, 
  Check,
  Sparkles
} from 'lucide-react';
import { Contact } from '../types';
import { DEFAULT_AVATARS } from '../utils/storage';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: Contact) => void;
  onSelectExisting: (contactId: string) => void;
  existingContacts: Contact[];
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onAddContact,
  onSelectExisting,
  existingContacts,
}) => {
  const [mode, setMode] = useState<'list' | 'new_contact' | 'new_group'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // New Contact fields
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+94');
  const [about, setAbout] = useState<string>('Hey there! I am using Chat App DCT 🚀');
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATARS[1]);

  // New Group fields
  const [groupName, setGroupName] = useState<string>('');
  const [groupAbout, setGroupAbout] = useState<string>('DCT Group Chat');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: name.trim(),
      phone: `${countryCode} ${phone.trim()}`,
      avatar: avatar || DEFAULT_AVATARS[0],
      about: about.trim() || 'Available',
      isOnline: true,
      lastSeen: 'online',
      unreadCount: 0,
    };

    onAddContact(newContact);
    onClose();
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const members = selectedMemberIds.map(
      (id) => existingContacts.find((c) => c.id === id)?.name || ''
    ).filter(Boolean);

    const newGroup: Contact = {
      id: `group-${Date.now()}`,
      name: groupName.trim(),
      phone: '',
      avatar: avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      about: groupAbout.trim(),
      isOnline: true,
      lastSeen: 'active group',
      isGroup: true,
      membersCount: members.length + 1,
      groupMembers: ['You', ...members],
      unreadCount: 0,
    };

    onAddContact(newGroup);
    onClose();
  };

  const filteredExisting = existingContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#111b21] text-[#e9edef] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-[#222e35] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#202c33] border-b border-[#222e35]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00a884]/20 flex items-center justify-center text-[#00a884]">
              {mode === 'new_group' ? <Users className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#e9edef]">
                {mode === 'list' && 'New Chat'}
                {mode === 'new_contact' && 'Add New Contact'}
                {mode === 'new_group' && 'New Group'}
              </h2>
              <p className="text-xs text-[#8696a0]">
                {mode === 'list' && 'Start a chat with a contact or number'}
                {mode === 'new_contact' && 'Add details to save contact'}
                {mode === 'new_group' && 'Create group & add participants'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {mode === 'list' && (
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="create-new-contact-action-btn"
                  onClick={() => setMode('new_contact')}
                  className="p-3.5 bg-[#202c33] hover:bg-[#2a3942] rounded-xl border border-[#374248] flex items-center gap-3 text-left transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#e9edef]">New Contact</div>
                    <div className="text-xs text-[#8696a0]">Add phone number</div>
                  </div>
                </button>

                <button
                  id="create-new-group-action-btn"
                  onClick={() => setMode('new_group')}
                  className="p-3.5 bg-[#202c33] hover:bg-[#2a3942] rounded-xl border border-[#374248] flex items-center gap-3 text-left transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#e9edef]">New Group</div>
                    <div className="text-xs text-[#8696a0]">Chat with friends</div>
                  </div>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#8696a0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts on Chat App DCT..."
                  className="w-full bg-[#202c33] border border-[#222e35] focus:border-[#00a884] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#e9edef] outline-hidden"
                />
              </div>

              {/* Contacts List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8696a0]">
                  Contacts on DCT ({filteredExisting.length})
                </span>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {filteredExisting.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onSelectExisting(c.id);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#202c33] cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#222e35]">
                        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#e9edef] truncate">{c.name}</div>
                        <div className="text-xs text-[#8696a0] truncate">{c.about}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* New Contact Form */}
          {mode === 'new_contact' && (
            <form onSubmit={handleCreateContact} className="space-y-4">
              {/* DP Selector */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#00a884] mb-2">
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2">
                  {DEFAULT_AVATARS.slice(0, 4).map((av, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer ${
                        avatar === av ? 'border-[#00a884] scale-110' : 'border-transparent'
                      }`}
                    >
                      <img src={av} alt="av" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8696a0] block mb-1">Contact Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sahan Maduwantha"
                  required
                  autoFocus
                  className="w-full bg-[#202c33] border border-[#222e35] focus:border-[#00a884] rounded-xl px-3.5 py-2 text-sm text-[#e9edef] outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs text-[#8696a0] block mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <span className="bg-[#202c33] border border-[#222e35] text-[#00a884] font-semibold text-sm px-3 py-2 rounded-xl">
                    {countryCode}
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="77 889 9001"
                    required
                    className="flex-1 bg-[#202c33] border border-[#222e35] focus:border-[#00a884] rounded-xl px-3.5 py-2 text-sm text-[#e9edef] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8696a0] block mb-1">About / Status</label>
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full bg-[#202c33] border border-[#222e35] focus:border-[#00a884] rounded-xl px-3.5 py-2 text-sm text-[#e9edef] outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="flex-1 py-2 text-sm text-[#8696a0] hover:text-[#e9edef] cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="save-new-contact-submit-btn"
                  type="submit"
                  className="flex-1 py-2 bg-[#00a884] hover:bg-[#02906f] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Contact
                </button>
              </div>
            </form>
          )}

          {/* New Group Form */}
          {mode === 'new_group' && (
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-xs text-[#8696a0] block mb-1">Group Subject / Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. DCT Project Crew 🚀"
                  required
                  autoFocus
                  className="w-full bg-[#202c33] border border-[#222e35] focus:border-[#00a884] rounded-xl px-3.5 py-2 text-sm text-[#e9edef] outline-hidden"
                />
              </div>

              {/* Select Members */}
              <div className="space-y-2">
                <label className="text-xs text-[#8696a0] block">Add Participants ({selectedMemberIds.length})</label>
                <div className="max-h-48 overflow-y-auto space-y-1 bg-[#202c33]/40 p-2 rounded-xl border border-[#222e35]">
                  {existingContacts.map((c) => {
                    const isSelected = selectedMemberIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedMemberIds(selectedMemberIds.filter((id) => id !== c.id));
                          } else {
                            setSelectedMemberIds([...selectedMemberIds, c.id]);
                          }
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#00a884]/20 border border-[#00a884]/40' : 'hover:bg-[#202c33]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                          <span className="text-sm text-[#e9edef]">{c.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#00a884]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="flex-1 py-2 text-sm text-[#8696a0] hover:text-[#e9edef] cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="create-group-submit-btn"
                  type="submit"
                  className="flex-1 py-2 bg-[#00a884] hover:bg-[#02906f] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Users className="w-4 h-4" /> Create Group
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
