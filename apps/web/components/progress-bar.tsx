'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// NProgress configuration
NProgress.configure({ 
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08
});

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Finish nprogress on route change
    NProgress.done();
    
    // Cleanup/Start on next click if handled by a link
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return null;
}
