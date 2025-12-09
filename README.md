# Dulms AI 🤖

مساعد ذكي مدعوم بـ Gemini AI مع واجهة مشابهة لـ ChatGPT.

![Dulms AI](https://img.shields.io/badge/Dulms-AI-6366F1?style=for-the-badge)

## ✨ المميزات

- 💬 واجهة محادثة حديثة مشابهة لـ ChatGPT
- 🌙 الوضع الليلي والنهاري
- 📷 إرفاق الصور
- 📝 تعديل الرسائل
- 🔄 إعادة توليد الردود
- 📋 نسخ الرسائل والأكواد
- 🔍 البحث في المحادثات
- ⚙️ إعدادات شاملة
- 📱 تصميم متجاوب (موبايل/تابلت/ديسكتوب)
- 🖥️ دعم Electron لتطبيق Desktop

## 🚀 التشغيل

### 1. تثبيت المتطلبات
```bash
npm install
```

### 2. إعداد API Key
أنشئ ملف `.env.local` وأضف:
```
VITE_GEMINI_API_KEY=your_api_key_here
```
احصل على المفتاح من: https://makersuite.google.com/app/apikey

### 3. تشغيل المشروع
```bash
npm run dev
```

### 4. فتح المتصفح
```
http://localhost:3000
```

## 🖥️ بناء تطبيق Desktop (Electron)

```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

## 📁 هيكل المشروع

```
├── components/
│   ├── DulmsChat.tsx    # المكون الرئيسي
│   └── icons.tsx        # الأيقونات
├── services/
│   └── geminiService.ts # خدمة Gemini API
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload script
├── App.tsx
├── index.tsx
├── index.html
└── vite.config.ts
```

## 🛠️ التقنيات

- React 19
- TypeScript
- TailwindCSS
- Vite
- Gemini AI
- Electron (للـ Desktop)

## 📄 الرخصة

MIT License
