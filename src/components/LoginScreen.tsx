import React, { useState, useRef } from 'react';
import { 
  Phone, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  Camera, 
  Upload, 
  User as UserIcon,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Info,
  Laptop
} from 'lucide-react';
import { UserProfile } from '../types';
import { DEFAULT_AVATARS } from '../utils/storage';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  currentUser: UserProfile;
}

const COUNTRY_CODES = [
  { code: '+94', name: 'Sri Lanka 🇱🇰', flag: '🇱🇰' },
  { code: '+1', name: 'United States 🇺🇸', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom 🇬🇧', flag: '🇬🇧' },
  { code: '+91', name: 'India 🇮🇳', flag: '🇮🇳' },
  { code: '+971', name: 'United Arab Emirates 🇦🇪', flag: '🇦🇪' },
  { code: '+61', name: 'Australia 🇦🇺', flag: '🇦🇺' },
  { code: '+81', name: 'Japan 🇯🇵', flag: '🇯🇵' },
  { code: '+49', name: 'Germany 🇩🇪', flag: '🇩🇪' },
  { code: '+65', name: 'Singapore 🇸🇬', flag: '🇸🇬' },
  { code: '+60', name: 'Malaysia 🇲🇾', flag: '🇲🇾' },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  currentUser,
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [countryCode, setCountryCode] = useState<string>(currentUser.countryCode || '+94');
  const [phone, setPhone] = useState<string>(currentUser.phone || '77 123 4567');
  const [otp, setOtp] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [name, setName] = useState<string>(currentUser.name || 'Damith Madusanka');
  const [about, setAbout] = useState<string>(currentUser.about || 'Hey there! I am using Chat App DCT 🚀');
  const [avatar, setAvatar] = useState<string>(currentUser.avatar || DEFAULT_AVATARS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.replace(/\D/g, '').length < 6) {
      setError('Please enter a valid phone number (e.g. 77 123 4567)');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('profile');
    }, 600);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      phone: phone.trim(),
      countryCode: countryCode,
      name: name.trim(),
      about: about.trim(),
      avatar: avatar,
    };

    onLoginSuccess(updatedUser);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b141a] text-[#e9edef] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* WhatsApp-style top green banner bar */}
      <div className="absolute top-0 inset-x-0 h-48 bg-[#00a884] -z-0" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-md bg-[#111b21] rounded-2xl shadow-2xl border border-[#222e35] overflow-hidden">
        {/* Header Branding */}
        <div className="px-8 pt-8 pb-6 text-center space-y-2 border-b border-[#202c33] bg-[#202c33]/40">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00a884] text-white shadow-lg mb-1 ring-8 ring-[#00a884]/20">
            <MessageSquare className="w-9 h-9 fill-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e9edef]">
            Chat App <span className="text-[#00a884]">DCT</span>
          </h1>
          <p className="text-xs text-[#8696a0]">
            Simple. Reliable. Private Messaging with Custom Wallpapers &amp; DP
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Phone Number */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-base font-semibold text-[#e9edef] flex items-center justify-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#00a884]" /> Enter your phone number
                </h2>
                <p className="text-xs text-[#8696a0]">
                  Chat App DCT will verify your account with a one-time SMS code.
                </p>
              </div>

              <div className="space-y-3">
                {/* Country selector */}
                <div>
                  <label className="text-xs text-[#8696a0] font-medium block mb-1">Country / Region</label>
                  <select
                    id="login-country-select"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full bg-[#202c33] text-[#e9edef] border border-[#222e35] focus:border-[#00a884] rounded-xl px-3.5 py-2.5 text-sm cursor-pointer outline-hidden transition-colors"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#111b21]">
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="text-xs text-[#8696a0] font-medium block mb-1">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#202c33] border border-[#222e35] text-[#00a884] font-semibold text-sm px-3.5 py-2.5 rounded-xl select-none">
                      {countryCode}
                    </span>
                    <input
                      id="login-phone-input"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="77 123 4567"
                      autoFocus
                      className="flex-1 bg-[#202c33] border border-[#222e35] focus:border-[#00a884] rounded-xl px-3.5 py-2.5 text-sm text-[#e9edef] outline-hidden transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                id="phone-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#00a884] hover:bg-[#02906f] text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Sending code...</span>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#8696a0]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00a884]" />
                <span>Carrier SMS charges may apply. End-to-end encrypted.</span>
              </div>
            </form>
          )}

          {/* STEP 2: 6-Digit OTP */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in fade-in">
              <div className="text-center space-y-1">
                <h2 className="text-base font-semibold text-[#e9edef]">Verifying your number</h2>
                <p className="text-xs text-[#8696a0]">
                  Enter the 6-digit code sent to <span className="text-[#00a884] font-medium">{countryCode} {phone}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-[#00a884] hover:underline font-medium cursor-pointer pt-1"
                >
                  Wrong number? Edit phone
                </button>
              </div>

              {/* 6 Digit Boxes */}
              <div className="flex justify-center gap-2 sm:gap-3 py-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && idx > 0) {
                        const prev = document.getElementById(`otp-input-${idx - 1}`);
                        prev?.focus();
                      }
                    }}
                    className="w-11 h-12 text-center text-lg font-bold bg-[#202c33] text-[#00a884] border-2 border-[#222e35] focus:border-[#00a884] rounded-xl outline-hidden font-mono shadow-xs transition-all"
                  />
                ))}
              </div>

              <div className="text-center">
                <span className="text-xs text-[#8696a0]">Demo Code already filled (123456)</span>
              </div>

              <button
                id="otp-verify-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#00a884] hover:bg-[#02906f] text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify &amp; Continue</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: Setup Profile Info (DP, Name, About) */}
          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6 animate-in fade-in">
              <div className="text-center space-y-1">
                <h2 className="text-base font-semibold text-[#e9edef]">Profile Info</h2>
                <p className="text-xs text-[#8696a0]">
                  Please provide your name and an optional profile picture (DP).
                </p>
              </div>

              {/* DP Selection */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#202c33] shadow-lg bg-[#2a3942] flex items-center justify-center">
                    {avatar ? (
                      <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-14 h-14 text-[#8696a0]" />
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    id="setup-avatar-upload-btn"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    title="Upload DP"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Preset Avatars Quick Row */}
                <div className="flex gap-2 mt-3 overflow-x-auto max-w-xs py-1">
                  {DEFAULT_AVATARS.slice(0, 5).map((av, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatar === av ? 'border-[#00a884] scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & About */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#8696a0] font-medium block mb-1">Your Name (Visible to contacts)</label>
                  <input
                    id="setup-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Damith Madusanka"
                    maxLength={25}
                    required
                    className="w-full bg-[#202c33] border border-[#222e35] focus:border-[#00a884] rounded-xl px-3.5 py-2.5 text-sm text-[#e9edef] outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8696a0] font-medium block mb-1">About / Status</label>
                  <input
                    id="setup-about-input"
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="e.g. Available, Busy, At work..."
                    maxLength={100}
                    className="w-full bg-[#202c33] border border-[#222e35] focus:border-[#00a884] rounded-xl px-3.5 py-2.5 text-sm text-[#e9edef] outline-hidden transition-colors"
                  />
                </div>
              </div>

              <button
                id="finish-setup-login-btn"
                type="submit"
                className="w-full py-3 bg-[#00a884] hover:bg-[#02906f] text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Messaging</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-[#202c33]/50 border-t border-[#222e35] text-center text-xs text-[#8696a0]">
          Chat App DCT • Full Multi-Device &amp; Wallpaper Experience
        </div>
      </div>
    </div>
  );
};
