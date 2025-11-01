'use client';

import { usePathname } from "next/navigation";

const ConditionalContainer = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    
    // Don't wrap in container on stocks pages (they use AppLayout which has its own layout)
    if (pathname?.startsWith('/stocks/') || pathname?.startsWith('/stock/') || pathname === '/search') {
        return <>{children}</>;
    }
    
    return <div className="container py-10">{children}</div>;
}

export default ConditionalContainer;

