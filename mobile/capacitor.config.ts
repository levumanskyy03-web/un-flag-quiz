import type { CapacitorConfig } from '@capacitor/cli';

const devUrl = process.env.CAP_SERVER_URL?.trim();
let devHost: string | null = null;
if (devUrl) {
  try {
    devHost = new URL(devUrl).host;
  } catch {}
}

const config: CapacitorConfig = {
  appId: 'online.geoguiz.app',
  appName: 'Country Passport',
  webDir: 'www',
  backgroundColor: '#020617',
  server: {
    url: devUrl || 'https://www.geoguiz.online',
    cleartext: !!devUrl?.startsWith('http://'),
    allowNavigation: [
      'www.geoguiz.online',
      'geoguiz.online',
      ...(devHost ? [devHost] : []),
    ],
    errorPath: 'index.html',
  },
  plugins: {
    SplashScreen: {
      backgroundColor: '#020617',
      launchAutoHide: true,
      launchShowDuration: 0,
    },
    StatusBar: {
      // DARK = light icons on the dark app background.
      style: 'DARK',
      backgroundColor: '#020617',
      overlaysWebView: false,
    },
    SystemBars: {
      style: 'DARK',
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
    LocalNotifications: {
      presentationOptions: ['badge', 'sound', 'banner', 'list'],
      iconColor: '#1a6fd4',
    },
  },
};

export default config;
