"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

// Extend the Window interface to include fbq
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const PixelContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!FB_PIXEL_ID || !isLoaded) return;

    // Track PageView on route change
    window.fbq("track", "PageView");
  }, [pathname, searchParams, isLoaded]);

  if (!FB_PIXEL_ID) return null;

  return (
    <Script
      id="fb-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
        `,
      }}
      onLoad={() => setIsLoaded(true)}
    />
  );
};

export const MetaPixel = () => {
  return (
    <Suspense fallback={null}>
      <PixelContent />
    </Suspense>
  );
};
