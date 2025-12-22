import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every page.
 * The contents of this function will be rendered in the <head> of the HTML.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* ✅ FIX 1: viewport-fit=cover forces content to fill the notch area */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />

        {/* ✅ FIX 2: Force Fullscreen (Removes Safari bars) */}
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* ✅ FIX 3: Translucent Status Bar (Content flows UNDER the battery/time) */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Link the favicon just in case */}
        <link rel="icon" type="image/png" href="/favicon.png" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}