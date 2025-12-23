import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jirahandover.dashboard',
  appName: 'Jira Handover',
  webDir: 'public',

  server: {
    // Production Railway URL - app loads from here
    url: 'https://handover-production.up.railway.app',
    cleartext: false, // Force HTTPS only

    // Allow navigation to these domains
    allowNavigation: [
      'handover-production.up.railway.app',
      '*.up.railway.app',
    ],
  },

  android: {
    // Appearance
    backgroundColor: '#111111', // Matches dark theme

    // Security
    allowMixedContent: false, // No HTTP in HTTPS

    // Development
    webContentsDebuggingEnabled: false, // Set true for debugging

    // Keyboard behavior
    resizeOnFullScreen: true,
  },

  // Splash screen configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // Disable splash (use web app loading)
      backgroundColor: '#111111',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
