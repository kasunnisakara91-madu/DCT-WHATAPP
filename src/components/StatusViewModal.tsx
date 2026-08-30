import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Plus, 
  Camera, 
  Type, 
  Palette, 
  Smile, 
  Eye, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { StatusStory, UserProfile } from '../types';

interface StatusViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  statuses: StatusStory[];
  user: UserProfile;
  initialIndex?: number;
  onAddStatus: (status: StatusStory) => void;
  onReplyToStatus?: (story: StatusStory, text: string) => void;
}

const STORY_COLORS = [
  '#065f46',
  '#1e3a8a',
  '#701a75',
  '#991b1b',
  '#854d0e',
  '#1f2937',
  '#0f766e',
];

export const StatusViewModal: React.FC<StatusViewModalProps> = ({
  isOpen,
  onClose,
  statuses,
  user,
  initialIndex = 0,
  onAddStatus,
  onReplyToStatus,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [isCreating, setIsCreating] = useState<'text' | 'image' | null>(null);
  
  // Creation state
  const [newText, setNewText] = useState<string>('');
  const [selectedBgColor, setSelectedBgColor] = useState<string>(STORY_COLORS[0]);
  const [newImage, setNewImage] = useState<string>('');
  const [newCaption, setNewCaption] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  // Story progress timer
  useEffect(() => {
    if (!isOpen || isCreating || isPaused || statuses.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < statuses.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isCreating, isPaused, currentIndex, statuses.length, onClose]);

  if (!isOpen) return null;

  const currentStory = statuses[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentStory) return;
    if (onReplyToStatus) {
      onReplyToStatus(currentStory, replyText.trim());
    }
    setReplyText('');
    onClose();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImage(event.target.result as string);
          setIsCreating('image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishStory = () => {
    if (isCreating === 'text' && !newText.trim()) return;
    if (isCreating === 'image' && !newImage) return;

    const created: StatusStory = {
      id: `story-${Date.now()}`,
      userId: 'user_me',
      userName: 'My Status',
      userAvatar: user.avatar,
      type: isCreating === 'text' ? 'text' : 'image',
      content: isCreating === 'text' ? newText.trim() : newImage,
      backgroundColor: selectedBgColor,
      caption: newCaption.trim(),
      timestamp: 'Just now',
      isViewed: true,
      viewers: ['Kasun Perera', 'Dinuka Senanayake'],
    };

    onAddStatus(created);
    setIsCreating(null);
    setNewText('');
    setNewImage('');
    setNewCaption('');
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/95 flex items-center justify-center p-0 sm:p-4 backdrop-blur-md animate-in fade-in">
      {/* Create Story Mode */}
      {isCreating ? (
        <div className="w-full max-w-lg h-[90vh] rounded-2xl overflow-hidden flex flex-col relative shadow-2xl border border-[#222e35]">
          {isCreating === 'text' ? (
            <div 
              className="flex-1 flex flex-col items-center justify-center p-8 text-center transition-colors duration-300 relative"
              style={{ backgroundColor: selectedBgColor }}
            >
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Type a status..."
                maxLength={250}
                autoFocus
                className="w-full bg-transparent text-white text-2xl font-semibold placeholder:text-white/60 focus:outline-hidden text-center resize-none max-h-60"
              />

              {/* Color Palettes Picker */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    const nextIdx = (STORY_COLORS.indexOf(selectedBgColor) + 1) % STORY_COLORS.length;
                    setSelectedBgColor(STORY_COLORS[nextIdx]);
                  }}
                  className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
                  title="Change background color"
                >
                  <Palette className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-black flex flex-col items-center justify-center relative overflow-hidden">
              <img
                src={newImage}
                alt="New Status Preview"
                className="w-full h-full object-contain"
              />
              {/* Caption Input */}
              <div className="absolute bottom-4 inset-x-4">
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full bg-black/70 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Creation Action Bar */}
          <div className="bg-[#202c33] p-4 flex items-center justify-between border-t border-[#222e35]">
            <button
              onClick={() => {
                setIsCreating(null);
                setNewText('');
                setNewImage('');
              }}
              className="px-4 py-2 text-sm text-[#8696a0] hover:text-[#e9edef] cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="publish-status-btn"
              onClick={handlePublishStory}
              className="px-6 py-2.5 bg-[#00a884] hover:bg-[#02906f] text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Status</span>
            </button>
          </div>
        </div>
      ) : (
        /* Story Viewer Mode */
        <div 
          className="relative w-full max-w-md h-[95vh] sm:h-[800px] bg-[#111b21] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-[#222e35]"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Status Progress Bars Header */}
          <div className="absolute top-0 inset-x-0 z-20 p-3 pt-4 bg-gradient-to-b from-black/80 to-transparent space-y-3">
            <div className="flex gap-1.5">
              {statuses.map((_, idx) => {
                let barWidth = '0%';
                if (idx < currentIndex) barWidth = '100%';
                else if (idx === currentIndex) barWidth = `${progress}%`;

                return (
                  <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                      style={{ width: barWidth }}
                    />
                  </div>
                );
              })}
            </div>

            {/* User Details & Controls */}
            {currentStory && (
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/40">
                    <img
                      src={currentStory.userAvatar}
                      alt={currentStory.userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight drop-shadow-sm">{currentStory.userName}</h3>
                    <p className="text-[11px] text-white/70">{currentStory.timestamp}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="close-status-modal-btn"
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Story Content Area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-black">
            {currentStory ? (
              currentStory.type === 'text' ? (
                <div
                  className="w-full h-full flex items-center justify-center p-8 text-center"
                  style={{ backgroundColor: currentStory.backgroundColor || '#065f46' }}
                >
                  <p className="text-2xl font-bold text-white leading-relaxed drop-shadow-md">
                    {currentStory.content}
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={currentStory.content}
                    alt="Status media"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {currentStory.caption && (
                    <div className="absolute bottom-20 inset-x-4 bg-black/60 backdrop-blur-sm p-3 rounded-2xl text-center text-white text-sm">
                      {currentStory.caption}
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="text-center p-6 text-white/60">
                <p>No active status stories</p>
              </div>
            )}

            {/* Left & Right Touch/Click zones */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white cursor-pointer disabled:opacity-0"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Reply or Add Story Footer */}
          <div className="relative z-20 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            {currentStory?.userId === 'user_me' ? (
              <div className="flex items-center justify-center gap-2 text-xs text-white/80 py-2">
                <Eye className="w-4 h-4 text-[#00a884]" />
                <span>Viewed by {currentStory.viewers?.length || 2} contacts</span>
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Reply to status..."
                  className="flex-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-hidden focus:border-[#00a884]"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="p-2.5 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick add status buttons */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-white/10 mt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#00a884]" />
                <span>Add Photo</span>
              </button>
              <button
                onClick={() => setIsCreating('text')}
                className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Type className="w-3.5 h-3.5 text-[#00a884]" />
                <span>Add Text Status</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
