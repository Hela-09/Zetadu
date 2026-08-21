import { useEffect, useState } from 'react';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export const useGooglePicker = (oauthToken: string | null, onPick: (file: any) => void) => {
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('picker', {
          callback: () => setPickerApiLoaded(true),
        });
      };
      document.body.appendChild(script);
    };

    if (!window.gapi) {
      loadScript();
    } else if (!window.google?.picker) {
      window.gapi.load('picker', {
        callback: () => setPickerApiLoaded(true),
      });
    } else {
      setPickerApiLoaded(true);
    }
  }, []);

  const openPicker = () => {
    if (!pickerApiLoaded || !oauthToken || !window.google?.picker) {
      console.warn("Picker API not loaded or OAuth token missing");
      return;
    }

    const pickerOrigin =
      window.location.ancestorOrigins &&
      window.location.ancestorOrigins.length > 0
        ? window.location.ancestorOrigins[
            window.location.ancestorOrigins.length - 1
          ]
        : window.location.origin;

    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .setOAuthToken(oauthToken)
      .setCallback((data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
          onPick(data.docs[0]);
        }
      })
      .setOrigin(pickerOrigin)
      .build();
    
    picker.setVisible(true);
  };

  return { openPicker, isReady: pickerApiLoaded && !!oauthToken };
};
