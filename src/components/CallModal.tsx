import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  SwitchCamera, 
  Maximize2,
  Minimize2,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import { Contact } from '../types';
import { soundManager } from '../utils/audio';

interface CallModalProps {
  isOpen: boolean;
  contact: Contact | null;
  type: 'audio' | 'video';
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  contact,
  type,
  onEndCall,
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(type === 'audio');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      soundManager.stopRinging();
      setCallStatus('ringing');
      setDurationSeconds(0);
      return;
    }

    // Start ringing sound
    soundManager.startRinging();

    // Auto-connect after 3.5s for realistic simulation
    const connectTimer = setTimeout(() => {
      soundManager.stopRinging();
      setCallStatus('connected');
    }, 3500);

    return () => {
      soundManager.stopRinging();
      clearTimeout(connectTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen && callStatus === 'connected') {
      interval = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, callStatus]);

  if (!isOpen || !contact) return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-0 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div 
        className={`relative bg-[#111b21] text-[#e9edef] overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 ${
          isFullscreen 
            ? 'w-screen h-screen' 
            : 'w-full max-w-2xl h-[90vh] sm:h-[650px] sm:rounded-3xl border border-[#222e35]'
        }`}
      >
        {/* Background Visual for Video Call */}
        {type === 'video' && !isVideoOff ? (
          <div className="absolute inset-0 z-0">
            {/* Simulated Live Video feed of Contact */}
            <img
              src={contact.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'}
              alt={contact.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-90 contrast-105 animate-pulse duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />

            {/* Picture-in-Picture Self Camera */}
            <div className="absolute top-16 right-5 w-28 sm:w-36 h-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-white/40 shadow-2xl bg-black/80">
              <div className="w-full h-full bg-linear-to-br from-[#005c4b] to-[#111b21] flex flex-col items-center justify-center text-center p-2">
                <span className="text-[10px] text-[#00a884] font-medium uppercase tracking-wider mb-1">Your Camera</span>
                <UserIcon className="w-8 h-8 text-white/60" />
              </div>
            </div>
          </div>
        ) : (
          /* Audio Call Visual Background */
          <div className="absolute inset-0 bg-gradient-to-b from-[#1f2c34] to-[#111b21] z-0 flex flex-col items-center justify-center p-6">
            <div className="relative mb-6">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#00a884]/40 shadow-2xl bg-[#2a3942] relative z-10 ring-8 ring-[#00a884]/10">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              {callStatus === 'ringing' && (
                <div className="absolute -inset-4 rounded-full border-2 border-[#00a884] animate-ping opacity-30" />
              )}
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="relative z-10 px-6 pt-6 flex items-start justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white/90">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00a884]" />
            <span>End-to-end encrypted</span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white transition-colors cursor-pointer"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Caller Info Middle */}
        <div className="relative z-10 px-6 text-center space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
            {contact.name}
          </h2>
          <p className="text-sm font-medium text-[#d1d7db] drop-shadow-sm flex items-center justify-center gap-2">
            {callStatus === 'ringing' ? (
              <span className="text-[#00a884] animate-pulse">Ringing...</span>
            ) : (
              <span className="font-mono text-emerald-300 font-semibold">{formatDuration(durationSeconds)}</span>
            )}
          </p>
          <span className="text-xs text-white/60 uppercase tracking-wider block">
            {type === 'video' ? 'WhatsApp Video Call' : 'WhatsApp Voice Call'}
          </span>
        </div>

        {/* Call Action Bar Controls */}
        <div className="relative z-10 p-6 pb-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-center gap-4 sm:gap-6">
          {/* Mute Button */}
          <button
            id="toggle-call-mute-btn"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-13 h-13 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isMuted 
                ? 'bg-red-500 text-white ring-4 ring-red-500/30' 
                : 'bg-[#202c33]/90 hover:bg-[#374248] text-white border border-white/10'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Toggle Video Button */}
          {type === 'video' && (
            <button
              id="toggle-call-video-btn"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-13 h-13 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isVideoOff 
                  ? 'bg-red-500 text-white ring-4 ring-red-500/30' 
                  : 'bg-[#202c33]/90 hover:bg-[#374248] text-white border border-white/10'
              }`}
              title={isVideoOff ? 'Turn video on' : 'Turn video off'}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
          )}

          {/* Switch Camera */}
          {type === 'video' && !isVideoOff && (
            <button
              id="switch-camera-btn"
              onClick={() => {}}
              className="w-13 h-13 rounded-full bg-[#202c33]/90 hover:bg-[#374248] text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
              title="Switch camera"
            >
              <SwitchCamera className="w-6 h-6" />
            </button>
          )}

          {/* Speaker Button */}
          <button
            id="toggle-speaker-btn"
            className="w-13 h-13 rounded-full bg-[#202c33]/90 hover:bg-[#374248] text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
            title="Speaker volume"
          >
            <Volume2 className="w-6 h-6" />
          </button>

          {/* END CALL BUTTON (Red) */}
          <button
            id="end-active-call-btn"
            onClick={onEndCall}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer ring-8 ring-red-600/20"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
