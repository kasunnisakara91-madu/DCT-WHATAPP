import React, { useState } from 'react';
import { 
  X, 
  Laptop, 
  Smartphone, 
  Monitor, 
  Plus, 
  QrCode, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  KeyRound, 
  ChevronRight,
  Globe,
  Loader2
} from 'lucide-react';
import { LinkedDevice } from '../types';

interface LinkedDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: LinkedDevice[];
  onAddDevice: (device: LinkedDevice) => void;
  onRemoveDevice: (deviceId: string) => void;
}

export const LinkedDevicesModal: React.FC<LinkedDevicesModalProps> = ({
  isOpen,
  onClose,
  devices,
  onAddDevice,
  onRemoveDevice,
}) => {
  const [linkingStep, setLinkingStep] = useState<'list' | 'qr_scan' | 'code_link'>('list');
  const [pairingCode, setPairingCode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [newDeviceName, setNewDeviceName] = useState<string>('Google Chrome (Desktop)');
  const [selectedDevice, setSelectedDevice] = useState<LinkedDevice | null>(null);

  if (!isOpen) return null;

  const generateRandomPairingCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      if (i === 4) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleStartQRScan = () => {
    setLinkingStep('qr_scan');
    setIsProcessing(true);
    // Simulate camera scanning QR code on WhatsApp Web
    setTimeout(() => {
      setIsProcessing(false);
    }, 1200);
  };

  const handleStartCodeLink = () => {
    setPairingCode(generateRandomPairingCode());
    setLinkingStep('code_link');
  };

  const handleConfirmLink = (type: 'qr' | 'code') => {
    setIsProcessing(true);
    setTimeout(() => {
      const isMac = Math.random() > 0.5;
      const device: LinkedDevice = {
        id: `dev-${Date.now()}`,
        name: type === 'qr' 
          ? (isMac ? 'WhatsApp Web (macOS)' : 'Google Chrome (Windows 11)') 
          : newDeviceName,
        os: isMac ? 'macOS' : 'Windows',
        browser: 'Chrome',
        lastActive: 'Active right now',
        ipAddress: `192.168.1.${Math.floor(Math.random() * 200 + 10)}`,
        location: 'Colombo, Sri Lanka',
        isCurrent: false,
      };
      onAddDevice(device);
      setIsProcessing(false);
      setLinkingStep('list');
    }, 1500);
  };

  const getDeviceIcon = (os: string) => {
    switch (os.toLowerCase()) {
      case 'windows':
      case 'macos':
      case 'linux':
        return <Laptop className="w-5 h-5 text-[#00a884]" />;
      case 'android':
      case 'ios':
        return <Smartphone className="w-5 h-5 text-[#00a884]" />;
      default:
        return <Monitor className="w-5 h-5 text-[#00a884]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#111b21] text-[#e9edef] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#222e35] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#202c33] border-b border-[#222e35]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00a884]/20 flex items-center justify-center text-[#00a884]">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#e9edef]">Linked Devices</h2>
              <p className="text-xs text-[#8696a0]">Use Chat App DCT on Web, Desktop, and other devices</p>
            </div>
          </div>
          <button
            id="close-linked-devices-btn"
            onClick={onClose}
            className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {linkingStep === 'list' && (
            <>
              {/* Graphic Banner */}
              <div className="flex flex-col items-center justify-center text-center p-6 bg-[#202c33]/40 rounded-2xl border border-[#222e35]">
                <div className="w-20 h-20 rounded-full bg-[#00a884]/15 flex items-center justify-center mb-3 text-[#00a884] ring-8 ring-[#00a884]/5">
                  <Laptop className="w-10 h-10" />
                </div>
                <h3 className="text-base font-semibold text-[#e9edef] mb-1">
                  Use Chat App DCT on your other devices
                </h3>
                <p className="text-xs text-[#8696a0] max-w-xs mb-5">
                  Link up to 4 devices to your account simultaneously. End-to-end encrypted messaging.
                </p>

                {/* Main Link a Device Button */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                  <button
                    id="link-new-device-qr-btn"
                    onClick={handleStartQRScan}
                    className="flex-1 py-3 px-4 bg-[#00a884] hover:bg-[#02906f] text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Link with QR Code</span>
                  </button>
                  <button
                    id="link-new-device-code-btn"
                    onClick={handleStartCodeLink}
                    className="py-3 px-4 bg-[#202c33] hover:bg-[#374248] text-[#e9edef] font-medium text-sm rounded-xl transition-all border border-[#374248] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-[#00a884]" />
                    <span>Link with Code</span>
                  </button>
                </div>
              </div>

              {/* Security notice */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#00a884]/10 border border-[#00a884]/20 text-[#00a884] text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Your personal messages are end-to-end encrypted across all linked devices.</span>
              </div>

              {/* Devices Status / List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#8696a0] px-1">
                  <span>Device Status ({devices.length})</span>
                  <span>Tap a device to manage</span>
                </div>

                {devices.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#8696a0] bg-[#202c33]/20 rounded-xl border border-dashed border-[#222e35]">
                    No devices currently linked. Click &quot;Link a Device&quot; to connect.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {devices.map((device) => (
                      <div
                        key={device.id}
                        onClick={() => setSelectedDevice(device)}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-[#202c33]/70 hover:bg-[#202c33] border border-[#222e35] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#111b21] flex items-center justify-center group-hover:scale-105 transition-transform">
                            {getDeviceIcon(device.os)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#e9edef] flex items-center gap-2">
                              {device.name}
                              {device.lastActive.includes('Active right now') && (
                                <span className="inline-block w-2 h-2 rounded-full bg-[#00a884] animate-pulse" />
                              )}
                            </div>
                            <div className="text-xs text-[#8696a0] flex items-center gap-2">
                              <span>Last active: {device.lastActive}</span>
                              {device.location && <span>• {device.location}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-[#8696a0] group-hover:text-[#e9edef] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* QR Scanner / Desktop Web Link Simulator */}
          {linkingStep === 'qr_scan' && (
            <div className="space-y-5 text-center">
              <div className="p-4 bg-[#202c33]/60 rounded-2xl border border-[#222e35] flex flex-col items-center">
                <div className="relative w-64 h-64 bg-[#0b141a] rounded-xl overflow-hidden border-2 border-[#00a884] flex flex-col items-center justify-center p-4 shadow-inner">
                  {/* QR Code Canvas Visual Representation */}
                  <div className="w-48 h-48 bg-white p-3 rounded-lg shadow-md flex flex-col items-center justify-center relative">
                    {/* Simulated Authentic WhatsApp QR Code Pattern */}
                    <div className="w-full h-full bg-[radial-gradient(#111b21_2.5px,transparent_2.5px)] [background-size:10px_10px] relative flex items-center justify-center border-2 border-black">
                      <div className="absolute top-1 left-1 w-8 h-8 border-4 border-black bg-white flex items-center justify-center">
                        <div className="w-3 h-3 bg-black" />
                      </div>
                      <div className="absolute top-1 right-1 w-8 h-8 border-4 border-black bg-white flex items-center justify-center">
                        <div className="w-3 h-3 bg-black" />
                      </div>
                      <div className="absolute bottom-1 left-1 w-8 h-8 border-4 border-black bg-white flex items-center justify-center">
                        <div className="w-3 h-3 bg-black" />
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-md">
                        <Laptop className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Scanning line animation */}
                  <div className="absolute inset-x-4 h-1 bg-[#00a884] shadow-[0_0_12px_#00a884] animate-bounce top-1/2" />
                </div>

                <div className="mt-4 space-y-1">
                  <h4 className="text-sm font-semibold text-[#e9edef]">Scan QR Code to Link</h4>
                  <p className="text-xs text-[#8696a0]">
                    Point your phone to the screen or click below to simulate linking this browser
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLinkingStep('list')}
                  className="flex-1 py-2.5 text-sm text-[#8696a0] hover:text-[#e9edef] hover:bg-[#374248] rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm-qr-link-btn"
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleConfirmLink('qr')}
                  className="flex-1 py-2.5 bg-[#00a884] hover:bg-[#02906f] text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Syncing Chats...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Connect Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Link with 8-character Pairing Code */}
          {linkingStep === 'code_link' && (
            <div className="space-y-5">
              <div className="p-5 bg-[#202c33]/60 rounded-2xl border border-[#222e35] space-y-4">
                <div className="text-center space-y-1">
                  <h4 className="text-sm font-semibold text-[#e9edef]">Enter 8-Character Pairing Code</h4>
                  <p className="text-xs text-[#8696a0]">
                    Open Chat App DCT on your computer, choose &quot;Link with phone number&quot; and enter this code:
                  </p>
                </div>

                {/* Big Display Code */}
                <div className="flex items-center justify-center">
                  <div className="font-mono text-2xl tracking-[0.25em] font-bold text-[#00a884] bg-[#0b141a] px-6 py-3 rounded-xl border border-[#00a884]/40 shadow-inner">
                    {pairingCode}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs text-[#8696a0]">Custom Device Name (Optional)</label>
                  <input
                    type="text"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="w-full bg-[#111b21] border border-[#222e35] focus:border-[#00a884] rounded-xl px-3.5 py-2 text-sm text-[#e9edef] outline-hidden"
                    placeholder="e.g. My MacBook Pro Office"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLinkingStep('list')}
                  className="flex-1 py-2.5 text-sm text-[#8696a0] hover:text-[#e9edef] hover:bg-[#374248] rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm-code-link-btn"
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleConfirmLink('code')}
                  className="flex-1 py-2.5 bg-[#00a884] hover:bg-[#02906f] text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Device Details & Log Out Dialog */}
          {selectedDevice && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-[#202c33] text-[#e9edef] rounded-2xl w-full max-w-sm p-6 space-y-5 border border-[#374248] shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#111b21] flex items-center justify-center text-[#00a884]">
                    {getDeviceIcon(selectedDevice.os)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-[#e9edef]">{selectedDevice.name}</h3>
                    <p className="text-xs text-[#8696a0]">Operating System: {selectedDevice.os}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-[#111b21] p-3.5 rounded-xl border border-[#222e35]">
                  <div className="flex justify-between py-1 border-b border-[#222e35]">
                    <span className="text-[#8696a0]">Status:</span>
                    <span className="text-[#00a884] font-medium">{selectedDevice.lastActive}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#222e35]">
                    <span className="text-[#8696a0]">IP Address:</span>
                    <span className="text-[#e9edef] font-mono">{selectedDevice.ipAddress || '192.168.1.10'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#8696a0]">Location:</span>
                    <span className="text-[#e9edef]">{selectedDevice.location || 'Sri Lanka'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="flex-1 py-2 text-xs font-medium text-[#8696a0] hover:text-[#e9edef] hover:bg-[#374248] rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    id="remove-linked-device-btn"
                    onClick={() => {
                      onRemoveDevice(selectedDevice.id);
                      setSelectedDevice(null);
                    }}
                    className="flex-1 py-2 text-xs font-semibold text-[#f15c6d] hover:bg-[#f15c6d]/10 border border-[#f15c6d]/30 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out Device</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#202c33] border-t border-[#222e35] flex items-center justify-between text-xs text-[#8696a0]">
          <span className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Chat App DCT Multi-Device Sync
          </span>
          <button
            onClick={onClose}
            className="text-[#00a884] hover:underline font-medium cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
