# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**364 Ways to Say No** — A React Native/Expo app that provides a daily excuse for 364 days, with one secret "golden day" (Amore) per year. Monetized via RevenueCat in-app purchase ($2.99 one-time). Free users get 3 taps before hitting a paywall.

## Commands

```bash
npx expo start              # Start dev server
npx expo start --ios        # Run on iOS simulator
npx expo start --android    # Run on Android emulator
npx expo start --web        # Run in browser
npm run lint                # ESLint check
npx tsc --noEmit            # Type check (no test suite exists yet)
```

## Architecture

### Routing (Expo Router — file-based)

The app uses a single Stack navigator defined in `app/_layout.tsx`. The main user flow is linear:

`index.tsx` (splash, auto-navigates after 2s) → `about.tsx` → `pick-golden-day.tsx` → `calendar.tsx` (main screen)

A `(tabs)` group exists but is currently unused/demo scaffolding.

### State Management

- **Global state**: React Context only — `EntitlementContext` in `contexts/EntitlementContext.tsx` manages all IAP state (`isPro`, `remainingTaps`, `purchase()`, `restore()`).
- **Screen state**: Local `useState` in components. No persistence layer yet (AsyncStorage planned for Phase 3).
- **No Redux/Zustand** — everything runs through Context API.

### RevenueCat Integration

All IAP logic is centralized in `EntitlementContext`. The provider wraps the entire app from `app/_layout.tsx`. Product ID is `'pro'`, entitlement key is `'pro'`. When pro, `remainingTaps` is set to `Infinity`.

### Path Aliases (babel.config.js)

`@` → project root, `@/components`, `@/constants`, `@/hooks` — use these in imports.

## Design System

Art Deco theme defined in `constants/colors.ts`:
- Background: `#4a1942` (deep plum)
- Accent: `#d4af37` (gold)
- Text: `#f5f1e8` (cream)
- Typography: Didot font, italic headers, 4-6px letter spacing on titles

## Component Patterns

### Modals

All modals (`LockModal`, `QuoteModal`, `AmoreModal`, `SettingsModal`) follow the same pattern: receive `visible` + callback props, use `<Modal transparent animationType="fade">` with an overlay wrapper. Async operations use local `isLoading` state and call into `useEntitlement()`.

### Screens

Screens use `useSafeAreaInsets()` for layout, `<StatusBar style="light" />`, and render modals at the bottom of the JSX tree.

## Known Limitations

- Tap counter resets on app reload (no persistence)
- Golden day is hardcoded to January 31st in `calendar.tsx`
- No offline mode or caching
- No automated tests
