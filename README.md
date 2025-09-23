# 📱 Subply Mobile App

LIVE : [https://appetize.io/embed/b_6dziaupbs722unavog2gtbm6je]

Subply is a React Native (Expo) application for purchasing **game top-ups** and **digital vouchers**, powered by the [Subply API](https://github.com/vhysxl/subply-api).

---

## 🚀 Features

- 🎮 Game top-up and voucher purchase flow
- 🔐 Authentication (Login & Register)
- 👤 Profile management (edit profile & password)
- 📦 Order tracking with detailed history
- 🛒 Admin panel for managing users, games, and products (inside app)
- 💳 Midtrans-integrated payment flow
- 🔐 Secure backend authentication
- 📱 Built with Expo & Zustand

---

## 🔧 Tech Stack

**Framework** : Expo (React Native)
**State Management** : Zustand
**Styling** : NativeWind
**validation** : Zod

---

## 📂 Project Structure

```bash
app/
├── (auth)/ # Login & Register screens
├── (main)/ # Main app (tabs, orders, checkout, etc.)
│ ├── (tabs)/ # Bottom tab screens (Home, Games, Profile)
│ ├── checkout/ # Payment process screens
│ ├── game/ # Game detail
│ ├── orders/ # Order list & details
│ └── profile/ # Profile & edit pages
├── admin/ # In-app admin dashboard & management
├── components/ # Shared components
│ ├── admin/ # Admin-specific UI components
│ ├── features/ # Domain-specific components
│ └── ui/ # General-purpose UI components
├── global.css # Global styles
├── _layout.tsx # App layout entry
```

---

## 📸 Screenshots (Soon)
soon to be implemented

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npx expo start
```

### 3. Using tunnel

```bash
npx expo start --tunnel
```

# TL;DR 
```The app is functionally complete, but the codebase is still messy and will be cleaned up over time.```
