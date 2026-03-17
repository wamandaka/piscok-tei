# Sushi Tei Loyalty App

A web-based loyalty member application for Sushi Tei-like restaurants, built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Loyalty Points System**: Members earn points for every purchase
- **Membership Tiers**: Silver, Gold, and Platinum tiers with increasing benefits
  - Silver: 1x points
  - Gold: 1.5x points + 10% bonus
  - Platinum: 2x points + 20% bonus
- **QR Code Scanner**: Scan receipt QR codes to earn points instantly
- **Rewards Redemption**: Exchange points for vouchers, free items, and exclusive deals
- **PWA Support**: Install as a native app on mobile devices
- **Responsive Design**: Works on all screen sizes
- **Firebase Authentication**: Secure Google Sign-In
- **Firestore Database**: Real-time data synchronization (Spark plan compatible)

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Firebase (Spark/Free plan)
  - Firebase Auth (Google Sign-In)
  - Firestore Database
- **PWA**: vite-plugin-pwa with Workbox

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (already configured)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── config/
│   └── firebase.ts          # Firebase configuration
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── PointsCard.tsx       # Points display card
│   └── QRScanner.tsx        # QR code scanner
├── pages/
│   ├── Home.tsx             # Landing page
│   ├── Login.tsx            # Login page
│   ├── Dashboard.tsx        # Member dashboard
│   ├── Rewards.tsx          # Rewards catalog
│   └── ScanQR.tsx           # QR scanning page
├── services/
│   └── authService.ts       # Firebase auth & points services
├── types/
│   └── index.ts             # TypeScript types
├── App.tsx                  # Main app component
└── main.tsx                 # Entry point
```

## Firebase Setup

The app is configured with the following Firebase project:

- **Project ID**: sushitei-alike
- **Auth**: Google Sign-In enabled
- **Firestore**: Database for members, transactions, and rewards

### Firestore Collections

1. **members**: Member profiles and points
2. **transactions**: Points earning/redemption history
3. **rewards**: Available rewards (can be static or from Firestore)

## PWA Features

- Offline support with service worker
- Install prompt on mobile devices
- App manifest for home screen icon
- Cached assets for faster loading

## Usage

### For Members

1. **Sign Up/Login**: Use Google Sign-In
2. **View Points**: Check your points balance on dashboard
3. **Scan QR**: Scan receipt QR codes to earn points
4. **Redeem Rewards**: Browse and redeem rewards with points

### Demo Mode

- Click "Demo: Add 100 Points" on dashboard to test points system
- Use test QR code `ST-MAIN-DEMO-1234` on scan page

## Firebase Free Plan Limits

This app is designed to work within Firebase Spark (free) plan limits:

- Firestore: 1 GB storage, 50K reads/day, 20K writes/day
- Auth: 10 sign-ins/sec
- Hosting: 10 GB storage, 360 MB/day transfer

## License

MIT
