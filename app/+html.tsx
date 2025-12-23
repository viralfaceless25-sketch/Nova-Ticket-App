import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and configures the root HTML for every page.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* ✅ FIX 1: viewport-fit=cover
            This is the MAGIC command. It tells iOS: "Draw my website underneath the notch." 
            Without this, you get the black/white bar. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1.00001, viewport-fit=cover"
        />

        {/* ✅ FIX 2: PWA Fullscreen Settings */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        
        {/* ✅ FIX 3: Translucent Status Bar
            This makes the status bar text white, but the background transparent
            so your blue header shines through. */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* ✅ FIX 4: Theme Color
            Sets the browser chrome color to match your Blue Header (#4a86e1ff) 
            so there is no flicker of white/black on load. */}
        <meta name="theme-color" content="#4a86e1" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}