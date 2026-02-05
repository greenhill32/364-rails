import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '364 Ways to Say No',
  slug: '364-ways-to-say-no',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#4a1942',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.greenhill32.364waystosayno',
    backgroundColor: '#4a1942',
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundColor: '#4a1942',
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-build-properties',
    'expo-secure-store',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    revenueCatApiKey: process.env.REVENUECAT_API_KEY,
    router: {},
    eas: {
      projectId: '7108035b-a464-42e4-a2ab-2fd2a77b0fd0',
    },
  },
});
