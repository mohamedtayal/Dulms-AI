import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { Message } from '../types';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';

// ============ ICONS ============
const Icons = {
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  Copy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  Chat: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Regenerate: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  ThumbUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>,
  ThumbDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>,
  Share: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
  Globe: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  Key: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  Archive: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Stop: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>,
  Mic: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>,
};

// ============ TYPES ============
interface ExtendedMessage extends Message { image?: string; id: string; }
interface ChatHistory { id: string; title: string; messages: ExtendedMessage[]; createdAt: Date; }
interface Settings { theme: 'dark' | 'light' | 'system'; language: 'ar' | 'en'; fontSize: 'small' | 'medium' | 'large'; sendWithEnter: boolean; showTimestamps: boolean; soundEnabled: boolean; }

// ============ THEMES ============
const themes = {
  dark: { sidebar: '#202123', chat: '#343541', assistant: '#444654', border: '#4D4D4F', hover: '#2A2B32', text: '#FFFFFF', textSecondary: '#8E8EA0', input: '#40414F', accent: '#6366F1' },
  light: { sidebar: '#F7F7F8', chat: '#FFFFFF', assistant: '#F7F7F8', border: '#E5E5E5', hover: '#ECECF1', text: '#0F172A', textSecondary: '#6B7280', input: '#FFFFFF', accent: '#6366F1' }
};


// ============ COMPONENTS ============
const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    {[0, 150, 300].map(delay => <div key={delay} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />)}
  </div>
);

const CodeBlock: React.FC<{ code: string; language?: string; isDark: boolean }> = ({ code, language, isDark }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="relative my-3 rounded-lg overflow-hidden" style={{ background: isDark ? '#1e1e1e' : '#f6f8fa' }}>
      <div className="flex justify-between px-4 py-2 text-xs" style={{ background: isDark ? '#2d2d2d' : '#e8e8e8' }}>
        <span>{language || 'code'}</span>
        <button onClick={copy} className="flex items-center gap-1 hover:opacity-80">{copied ? <><Icons.Check /> تم</> : <><Icons.Copy /> نسخ</>}</button>
      </div>
      <pre className="p-4 overflow-x-auto"><code style={{ color: isDark ? '#e5e7eb' : '#1f2937' }}>{code}</code></pre>
    </div>
  );
};

const MessageContent: React.FC<{ text: string; isDark: boolean }> = ({ text, isDark }) => {
  const parts: any[] = []; let lastIdx = 0;
  const regex = /```(\w+)?\n([\s\S]*?)```/g; let m;
  while ((m = regex.exec(text))) { if (m.index > lastIdx) parts.push({ t: 'text', c: text.slice(lastIdx, m.index) }); parts.push({ t: 'code', l: m[1], c: m[2] }); lastIdx = m.index + m[0].length; }
  if (lastIdx < text.length) parts.push({ t: 'text', c: text.slice(lastIdx) }); if (!parts.length) parts.push({ t: 'text', c: text });
  return <div>{parts.map((p, i) => p.t === 'code' ? <CodeBlock key={i} code={p.c} language={p.l} isDark={isDark} /> : <div key={i} className="whitespace-pre-wrap leading-7">{p.c}</div>)}</div>;
};

// Settings Modal
const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void; settings: Settings; setSettings: (s: Settings) => void; theme: any; isDark: boolean }> = 
  ({ isOpen, onClose, settings, setSettings, theme, isDark }) => {
  if (!isOpen) return null;
  const tabs = ['عام', 'المظهر', 'البيانات', 'حول'];
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style={{ background: theme.chat }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border }}>
          <h2 className="text-xl font-semibold">الإعدادات</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:opacity-70"><Icons.X /></button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: theme.border }}>
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === i ? 'border-b-2' : ''}`}
              style={{ borderColor: activeTab === i ? theme.accent : 'transparent', color: activeTab === i ? theme.text : theme.textSecondary }}>{tab}</button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div><p className="font-medium">اللغة</p><p className="text-sm" style={{ color: theme.textSecondary }}>اختر لغة الواجهة</p></div>
                <select value={settings.language} onChange={e => setSettings({ ...settings, language: e.target.value as any })}
                  className="px-4 py-2 rounded-lg border" style={{ background: theme.input, borderColor: theme.border }}>
                  <option value="ar">العربية</option><option value="en">English</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div><p className="font-medium">إرسال بـ Enter</p><p className="text-sm" style={{ color: theme.textSecondary }}>اضغط Enter للإرسال</p></div>
                <button onClick={() => setSettings({ ...settings, sendWithEnter: !settings.sendWithEnter })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.sendWithEnter ? 'bg-accent' : 'bg-gray-600'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.sendWithEnter ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div><p className="font-medium">الأصوات</p><p className="text-sm" style={{ color: theme.textSecondary }}>تشغيل أصوات الإشعارات</p></div>
                <button onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.soundEnabled ? 'bg-accent' : 'bg-gray-600'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div><p className="font-medium">إظهار الوقت</p><p className="text-sm" style={{ color: theme.textSecondary }}>عرض وقت الرسائل</p></div>
                <button onClick={() => setSettings({ ...settings, showTimestamps: !settings.showTimestamps })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.showTimestamps ? 'bg-accent' : 'bg-gray-600'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.showTimestamps ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div className="space-y-6">
              <div><p className="font-medium mb-3">المظهر</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'system'] as const).map(t => (
                    <button key={t} onClick={() => setSettings({ ...settings, theme: t })}
                      className={`p-4 rounded-xl border-2 transition-all ${settings.theme === t ? 'border-accent' : ''}`} style={{ borderColor: settings.theme === t ? theme.accent : theme.border, background: theme.hover }}>
                      {t === 'light' ? <Icons.Sun /> : t === 'dark' ? <Icons.Moon /> : <Icons.Globe />}
                      <p className="mt-2 text-sm">{t === 'light' ? 'فاتح' : t === 'dark' ? 'داكن' : 'تلقائي'}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div><p className="font-medium mb-3">حجم الخط</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['small', 'medium', 'large'] as const).map(s => (
                    <button key={s} onClick={() => setSettings({ ...settings, fontSize: s })}
                      className={`p-4 rounded-xl border-2 transition-all`} style={{ borderColor: settings.fontSize === s ? theme.accent : theme.border, background: theme.hover }}>
                      <span style={{ fontSize: s === 'small' ? 12 : s === 'medium' ? 16 : 20 }}>أ</span>
                      <p className="mt-2 text-sm">{s === 'small' ? 'صغير' : s === 'medium' ? 'متوسط' : 'كبير'}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 2 && (
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-4 rounded-xl border transition-colors hover:opacity-80" style={{ borderColor: theme.border }}>
                <Icons.Download /><div className="text-right"><p className="font-medium">تصدير البيانات</p><p className="text-sm" style={{ color: theme.textSecondary }}>تحميل جميع المحادثات</p></div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl border transition-colors hover:opacity-80" style={{ borderColor: theme.border }}>
                <Icons.Archive /><div className="text-right"><p className="font-medium">أرشفة المحادثات</p><p className="text-sm" style={{ color: theme.textSecondary }}>نقل المحادثات القديمة للأرشيف</p></div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-red-500/50 text-red-500 transition-colors hover:bg-red-500/10">
                <Icons.Trash /><div className="text-right"><p className="font-medium">حذف جميع المحادثات</p><p className="text-sm opacity-70">لا يمكن التراجع عن هذا الإجراء</p></div>
              </button>
            </div>
          )}
          {activeTab === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4"><span className="text-4xl font-bold text-white">D</span></div>
              <h3 className="text-2xl font-bold mb-2">Dulms AI</h3>
              <p style={{ color: theme.textSecondary }}>الإصدار 1.0.0</p>
              <p className="mt-4 text-sm" style={{ color: theme.textSecondary }}>AI Assistant by Mohamed Tayal</p>
              
              {/* Contact Section */}
              <div className="mt-8 p-4 rounded-xl border" style={{ borderColor: theme.border, background: theme.hover }}>
                <p className="font-semibold mb-4">تواصل معنا</p>
                <div className="space-y-3 text-sm">
                  <a href="mailto:mota200615@gmail.com" className="flex items-center justify-center gap-2 text-accent hover:underline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                    mota200615@gmail.com
                  </a>
                  <a href="tel:+201067035421" className="flex items-center justify-center gap-2 text-accent hover:underline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                    +201067035421
                  </a>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <a href="#" className="text-accent hover:underline text-sm">سياسة الخصوصية</a>
                <a href="#" className="text-accent hover:underline text-sm">شروط الاستخدام</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// ============ MAIN COMPONENT ============
const DulmsChat: React.FC = () => {
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<Settings>({ theme: 'dark', language: 'ar', fontSize: 'medium', sendWithEnter: true, showTimestamps: true, soundEnabled: true });
  
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = isDark ? themes.dark : themes.light;
  const fontSize = settings.fontSize === 'small' ? 14 : settings.fontSize === 'large' ? 18 : 16;

  useEffect(() => { chatSession.current = createChatSession(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (inputRef.current) { inputRef.current.style.height = 'auto'; inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px'; } }, [inputValue]);

  const genId = () => Math.random().toString(36).substr(2, 9);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onload = (e) => setSelectedImage(e.target?.result as string); reader.readAsDataURL(file); }
  };

  const handleSend = useCallback(async () => {
    if ((!inputValue.trim() && !selectedImage) || isLoading || !chatSession.current) return;
    const userMsg: ExtendedMessage = { id: genId(), role: 'user', text: inputValue.trim() || 'صورة مرفقة', image: selectedImage || undefined };
    setMessages(prev => [...prev, userMsg]);
    setInputValue(''); setSelectedImage(null); setIsLoading(true);
    
    if (!currentChatId) {
      const newId = genId();
      setCurrentChatId(newId);
      setChatHistory(prev => [{ id: newId, title: userMsg.text.slice(0, 30), messages: [userMsg], createdAt: new Date() }, ...prev]);
    }
    
    try {
      const resp = await sendMessageToGemini(chatSession.current, userMsg.text);
      const botMsg: ExtendedMessage = { id: genId(), role: 'model', text: resp };
      setMessages(prev => [...prev, botMsg]);
      if (currentChatId) setChatHistory(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: [...c.messages, userMsg, botMsg] } : c));
    } catch { setMessages(prev => [...prev, { id: genId(), role: 'model', text: 'عذراً، حدث خطأ. حاول مرة أخرى.' }]); }
    finally { setIsLoading(false); inputRef.current?.focus(); }
  }, [inputValue, isLoading, currentChatId, selectedImage]);

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey && settings.sendWithEnter) { e.preventDefault(); handleSend(); } };
  const newChat = () => { setMessages([]); setCurrentChatId(null); setSelectedImage(null); chatSession.current = createChatSession(); };
  const loadChat = (c: ChatHistory) => { setMessages(c.messages); setCurrentChatId(c.id); };
  const deleteChat = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setChatHistory(prev => prev.filter(c => c.id !== id)); if (currentChatId === id) newChat(); };
  
  const copyMsg = (text: string) => { navigator.clipboard.writeText(text); };
  const editMsg = (msg: ExtendedMessage) => { setEditingMsgId(msg.id); setEditText(msg.text); };
  const saveEdit = (id: string) => { setMessages(prev => prev.map(m => m.id === id ? { ...m, text: editText } : m)); setEditingMsgId(null); };
  const regenerate = async (idx: number) => {
    if (!chatSession.current) return;
    const userMsg = messages.slice(0, idx + 1).filter(m => m.role === 'user').pop();
    if (!userMsg) return;
    setIsLoading(true);
    try {
      const resp = await sendMessageToGemini(chatSession.current, userMsg.text);
      setMessages(prev => [...prev.slice(0, idx), { id: genId(), role: 'model', text: resp }]);
    } catch { } finally { setIsLoading(false); }
  };

  const filteredHistory = chatHistory.filter(c => c.title.includes(searchQuery));
  const formatTime = (d?: Date) => d ? new Date(d).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="flex h-screen w-screen transition-colors duration-300" style={{ background: theme.chat, color: theme.text, fontSize }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} flex flex-col transition-all duration-300 overflow-hidden`} style={{ background: theme.sidebar }}>
        <div className="p-3 space-y-2">
          <button onClick={newChat} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors hover:opacity-80" style={{ borderColor: theme.border }}>
            <Icons.Plus /> محادثة جديدة
          </button>
          <input type="text" placeholder="بحث..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-sm" style={{ background: theme.input, borderColor: theme.border }} />
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
          {filteredHistory.length === 0 ? <p className="text-center py-8 text-sm" style={{ color: theme.textSecondary }}>لا توجد محادثات</p> :
            filteredHistory.map(chat => (
              <div key={chat.id} onClick={() => loadChat(chat)} className="group flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors"
                style={{ background: currentChatId === chat.id ? theme.hover : 'transparent' }}>
                <Icons.Chat />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm">{chat.title}</p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>{formatTime(chat.createdAt)}</p>
                </div>
                <button onClick={e => deleteChat(chat.id, e)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400"><Icons.Trash /></button>
              </div>
            ))}
        </div>
        
        <div className="p-3 border-t space-y-1" style={{ borderColor: theme.border }}>
          <button onClick={() => setSettingsOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:opacity-80" style={{ background: 'transparent' }}>
            <Icons.Settings /> الإعدادات
          </button>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">D</div>
            <span className="text-sm">Dulms AI</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: theme.border }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:opacity-70"><Icons.Menu /></button>
          <h1 className="text-lg font-semibold flex-1">Dulms AI</h1>
          <button onClick={() => setSettings(s => ({ ...s, theme: isDark ? 'light' : 'dark' }))} className="p-2 rounded-lg hover:opacity-70">
            {isDark ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-lg hover:opacity-70"><Icons.Settings /></button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6"><span className="text-4xl font-bold text-white">D</span></div>
              <h2 className="text-2xl font-semibold mb-2">مرحباً بك في Dulms AI</h2>
              <p style={{ color: theme.textSecondary }} className="text-center max-w-md mb-8">مساعدك الذكي للإجابة على الأسئلة وكتابة الأكواد وتحليل الصور</p>
              <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
                {['اشرح الذكاء الاصطناعي', 'اكتب كود Python', 'ترجم نص للإنجليزية', 'حلل صورة'].map((s, i) => (
                  <button key={i} onClick={() => setInputValue(s)} className="p-4 rounded-xl border text-right text-sm transition-all hover:opacity-80" style={{ borderColor: theme.border }}>{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full">
              {messages.map((msg, idx) => (
                <div key={msg.id} className="group px-4 py-6 transition-colors" style={{ background: msg.role === 'model' ? theme.assistant : 'transparent' }}>
                  <div className="max-w-3xl mx-auto flex gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${msg.role === 'user' ? 'bg-blue-600' : 'bg-accent'}`}>
                      {msg.role === 'user' ? 'أ' : 'D'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{msg.role === 'user' ? 'أنت' : 'Dulms AI'}</span>
                        {settings.showTimestamps && <span className="text-xs" style={{ color: theme.textSecondary }}>{formatTime(new Date())}</span>}
                      </div>
                      {msg.image && <img src={msg.image} alt="" className="max-w-xs rounded-lg mb-3 border" style={{ borderColor: theme.border }} />}
                      {editingMsgId === msg.id ? (
                        <div className="space-y-2">
                          <textarea value={editText} onChange={e => setEditText(e.target.value)} className="w-full p-3 rounded-lg border" style={{ background: theme.input, borderColor: theme.border }} rows={3} />
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(msg.id)} className="px-4 py-2 rounded-lg bg-accent text-white text-sm">حفظ</button>
                            <button onClick={() => setEditingMsgId(null)} className="px-4 py-2 rounded-lg border text-sm" style={{ borderColor: theme.border }}>إلغاء</button>
                          </div>
                        </div>
                      ) : <MessageContent text={msg.text} isDark={isDark} />}
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => copyMsg(msg.text)} className="p-1.5 rounded hover:opacity-70" title="نسخ"><Icons.Copy /></button>
                        {msg.role === 'user' && <button onClick={() => editMsg(msg)} className="p-1.5 rounded hover:opacity-70" title="تعديل"><Icons.Edit /></button>}
                        {msg.role === 'model' && <button onClick={() => regenerate(idx)} className="p-1.5 rounded hover:opacity-70" title="إعادة توليد"><Icons.Regenerate /></button>}
                        <button className="p-1.5 rounded hover:opacity-70" title="إعجاب"><Icons.ThumbUp /></button>
                        <button className="p-1.5 rounded hover:opacity-70" title="عدم إعجاب"><Icons.ThumbDown /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="px-4 py-6" style={{ background: theme.assistant }}>
                  <div className="max-w-3xl mx-auto flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">D</div>
                    <div><span className="font-semibold">Dulms AI</span><div className="mt-2"><TypingIndicator /></div></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4" style={{ borderColor: theme.border }}>
          <div className="max-w-3xl mx-auto">
            {selectedImage && (
              <div className="mb-3 relative inline-block">
                <img src={selectedImage} alt="" className="w-20 h-20 object-cover rounded-lg border" style={{ borderColor: theme.border }} />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"><Icons.X /></button>
              </div>
            )}
            <div className="flex items-end gap-2 rounded-xl border p-2" style={{ background: theme.input, borderColor: theme.border }}>
              <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg hover:opacity-70"><Icons.Image /></button>
              <textarea ref={inputRef} value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="أرسل رسالة..." rows={1} className="flex-1 bg-transparent py-2 px-2 focus:outline-none resize-none max-h-[200px]" disabled={isLoading} />
              {isLoading ? (
                <button className="p-2 rounded-lg bg-red-500 text-white"><Icons.Stop /></button>
              ) : (
                <button onClick={handleSend} disabled={!inputValue.trim() && !selectedImage} className="p-2 rounded-lg bg-accent text-white disabled:opacity-50"><Icons.Send /></button>
              )}
            </div>
            <p className="text-center text-xs mt-2" style={{ color: theme.textSecondary }}>Dulms AI قد يخطئ. تحقق من المعلومات المهمة.</p>
          </div>
        </div>
      </main>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} setSettings={setSettings} theme={theme} isDark={isDark} />
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default DulmsChat;
