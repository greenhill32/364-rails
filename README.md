# 364: Ways to Say No

A React Native Expo app with RevenueCat in-app purchases integration. Find creative ways to politely decline, with an exclusive golden day easter egg.

## 🎯 Features

- **Calendar View**: Browse through 365 days with contextual excuses
- **Golden Day**: Secret exclusive content on your chosen lucky day
- **IAP Integration**: RevenueCat-powered subscription management
- **Free Trial**: 3 free taps before paywall
- **Purchase Restore**: Easily restore previous purchases
- **Responsive Design**: Beautiful plum and gold theme

## 📋 Tech Stack

- **Framework**: React Native + Expo
- **Routing**: Expo Router
- **Monetization**: RevenueCat SDK
- **State Management**: React Context API
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- RevenueCat account with configured app

### Installation

```bash
# Clone the repository
git clone https://github.com/greenhill32/364-rails.git
cd 364-rails

# Install dependencies
npm install

# Configure RevenueCat
# Update the API key in contexts/EntitlementContext.tsx
# Purchases.configure({ apiKey: 'YOUR_REVENUECAT_API_KEY' })
```

### Development

```bash
# Start Expo development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Run on web
npx expo start --web
```

## 📁 Project Structure

```
364-rails/
├── app/
│   ├── _layout.tsx           # Root layout with EntitlementProvider
│   ├── index.tsx             # Home screen
│   ├── calendar.tsx          # Calendar view with excuses
│   ├── about.tsx             # About page
│   └── pick-golden-day.tsx   # Lucky day selection
├── components/
│   ├── LockModal.tsx         # Purchase paywall modal
│   ├── SettingsModal.tsx     # Settings & restore purchases
│   ├── QuoteModal.tsx        # Excuse display modal
│   └── AmoreModal.tsx        # Golden day special modal
├── contexts/
│   └── EntitlementContext.tsx # RevenueCat integration
├── constants/
│   ├── colors.ts             # Theme colors
│   └── theme.ts              # Theme configuration
└── package.json              # Dependencies
```

## 🔐 Phase 2: RevenueCat Integration

This release includes full RevenueCat monetization:

### EntitlementContext
- `isPro`: Boolean indicating Pro status
- `remainingTaps`: Number of free taps left
- `purchase()`: Triggers purchase flow
- `restore()`: Restores previous purchases
- `isLoading`: Loading state during operations

### Components
- **LockModal**: Shows paywall when free taps expire, triggers purchase
- **SettingsModal**: Includes "Restore Purchases" button wired to RevenueCat
- **Calendar**: Checks `isPro` status before showing content

## 🎨 Colors & Theme

```typescript
Colors: {
  background: '#4a1942',     // Deep plum
  gold: '#d4af37',           // Gold accent
  cream: '#f5f1e8',          // Cream text
  border: '#6b2f5f'          // Purple border
}
```

## 🔄 RevenueCat Setup

1. Create RevenueCat account at https://revenuecat.com
2. Create iOS and Android apps
3. Configure products:
   - Product ID: `pro`
   - Price: $2.99
   - Type: Non-consumable
4. Add your RevenueCat API key to `EntitlementContext.tsx`

## 📦 IAP Products

- **Pro**: $2.99 lifetime one-time purchase
  - Unlimited access to all 365 excuses
  - No ads
  - No expiration

## 🧪 Testing

```bash
# Run tests (when available)
npm test

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 🐛 Known Issues

- Tap counter decrements on app reload (Phase 3: Add AsyncStorage)
- Golden day state not persisted (Phase 3: Add AsyncStorage)
- No offline mode (Phase 4: Add local caching)

## 📋 Roadmap

- **Phase 3**: AsyncStorage integration for persistent state
- **Phase 4**: Offline caching and sync
- **Phase 5**: Analytics and crash reporting
- **Phase 6**: Navigation to change lucky day
- **Phase 7**: Share and social features

## 📄 License

MIT License - feel free to use this project

## 👤 Author

Created with ❤️ by [greenhill32](https://github.com/greenhill32)

## 🤝 Contributing

Pull requests welcome! Please follow the existing code style.

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/greenhill32/364-rails/issues
- RevenueCat Docs: https://docs.revenuecat.com

---

**Latest Release**: Phase 2 - RevenueCat Integration Complete ✅
