import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '117478053179-pd37crdm1hmhsti1qoim2hdsr26fsr1t.apps.googleusercontent.com',
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });
};
