import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Check, Sliders, Palette, Sparkles } from 'lucide-react';
import { WallpaperConfig } from '../types';
import { WALLPAPER_PRESETS, SOLID_COLORS } from '../utils/storage';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWallpaper: WallpaperConfig;
  onSaveWallpaper: (wallpaper: WallpaperConfig) => void;
  title?: string;
  isChatSpecific?: boolean;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  isOpen,
  onClose,
  currentWallpaper,
  onSaveWallpaper,
  title = 'Chat Background Wallpaper',
  isChatSpecific = false,
}) => {
  const [selectedType, setSelectedType] = useState<WallpaperConfig['type']>(currentWallpaper.type || 'doodle');
  const [value, setValue] = useState<string>(currentWallpaper.value || WALLPAPER_PRESETS[0].url);
  const [opacity, setOpacity] = useState<number>(currentWallpaper.opacity ?? 0.25);
  const [blur, setBlur] = useState<number>(currentWallpaper.blur ?? 0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setValue(event.target.result as string);
          setSelectedType('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSaveWallpaper({
      type: selectedType,
      value,
      opacity,
      blur,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#111b21] text-[#e9edef] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#222e35] flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#202c33] border-b border-[#222e35]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00a884]/20 flex items-center justify-center text-[#00a884]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#e9edef]">{title}</h2>
              <p className="text-xs text-[#8696a0]">
                {isChatSpecific ? 'Set a custom background photo for this chat' : 'Set your default WhatsApp chat background wallpaper'}
              </p>
            </div>
          </div>
          <button
            id="close-wallpaper-modal-btn"
            onClick={onClose}
            className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-[#8696a0] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00a884]" /> Live Wallpaper Preview
              </label>
              <span className="text-xs text-[#8696a0]">Doodle opacity: {Math.round(opacity * 100)}%</span>
            </div>

            <div className="relative h-44 rounded-xl overflow-hidden border border-[#222e35] shadow-inner bg-[#0b141a] flex flex-col justify-end p-4">
              {/* Background Layer */}
              {selectedType === 'color' ? (
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{ backgroundColor: value }}
                />
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                  style={{
                    backgroundImage: `url(${value})`,
                    opacity: opacity,
                    filter: blur > 0 ? `blur(${blur}px)` : undefined,
                  }}
                />
              )}

              {/* Sample Chat Messages overlay */}
              <div className="relative z-10 space-y-2.5 max-w-sm pointer-events-none">
                <div className="bg-[#202c33] text-[#e9edef] px-3 py-1.5 rounded-lg rounded-tl-xs text-xs shadow-md inline-block">
                  Hey! Do you like this background photo? 📸
                  <span className="text-[10px] text-[#8696a0] ml-2">10:45 AM</span>
                </div>
                <div className="bg-[#005c4b] text-[#e9edef] px-3 py-1.5 rounded-lg rounded-tr-xs text-xs shadow-md block ml-auto w-fit">
                  Looks awesome! Very clean WhatsApp style ✨
                  <span className="text-[10px] text-[#00a884] ml-2">✓✓ 10:46 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Custom Photo Option */}
          <div className="space-y-3">
            <label className="text-xs font-medium uppercase tracking-wider text-[#8696a0]">
              Upload Custom Photo / Background
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              id="upload-custom-wallpaper-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-dashed border-[#00a884]/40 hover:border-[#00a884] bg-[#00a884]/5 hover:bg-[#00a884]/10 text-[#00a884] font-medium text-sm transition-all cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              <span>Choose Photo from Device / Gallery</span>
            </button>
          </div>

          {/* Presets Gallery */}
          <div className="space-y-3">
            <label className="text-xs font-medium uppercase tracking-wider text-[#8696a0] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> High Definition Presets
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {WALLPAPER_PRESETS.map((preset) => {
                const isSelected = selectedType !== 'color' && value === preset.url;
                return (
                  <button
                    key={preset.id}
                    id={`wallpaper-preset-${preset.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedType(preset.id.includes('doodle') ? 'doodle' : 'preset');
                      setValue(preset.url);
                    }}
                    className={`group relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected ? 'border-[#00a884] scale-95 ring-2 ring-[#00a884]/40' : 'border-transparent hover:border-[#374248]'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 px-1 py-0.5 text-[9px] text-center text-white truncate">
                      {preset.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Solid Colors */}
          <div className="space-y-3">
            <label className="text-xs font-medium uppercase tracking-wider text-[#8696a0] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Solid Colors
            </label>
            <div className="flex flex-wrap gap-2.5">
              {SOLID_COLORS.map((color) => {
                const isSelected = selectedType === 'color' && value === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedType('color');
                      setValue(color);
                    }}
                    style={{ backgroundColor: color }}
                    className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                      isSelected ? 'border-[#00a884] scale-110 shadow-lg ring-2 ring-[#00a884]/50' : 'border-[#374248] hover:scale-105'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-[#00a884] stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fine Tuning Controls (Opacity & Blur) */}
          {selectedType !== 'color' && (
            <div className="bg-[#202c33]/50 p-4 rounded-xl space-y-4 border border-[#222e35]">
              <div className="flex items-center gap-2 text-xs font-medium text-[#8696a0] uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5" /> Adjust Wallpaper Settings
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#d1d7db]">
                  <span>Wallpaper Brightness / Opacity</span>
                  <span className="font-mono text-[#00a884]">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  id="wallpaper-opacity-range"
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-[#00a884] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#d1d7db]">
                  <span>Wallpaper Soft Blur</span>
                  <span className="font-mono text-[#00a884]">{blur}px</span>
                </div>
                <input
                  id="wallpaper-blur-range"
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  value={blur}
                  onChange={(e) => setBlur(parseInt(e.target.value))}
                  className="w-full accent-[#00a884] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#202c33] border-t border-[#222e35]">
          <button
            id="cancel-wallpaper-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm text-[#8696a0] hover:text-[#e9edef] hover:bg-[#374248] rounded-xl font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="save-wallpaper-btn"
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-[#00a884] hover:bg-[#02906f] text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Apply Wallpaper
          </button>
        </div>
      </div>
    </div>
  );
};
