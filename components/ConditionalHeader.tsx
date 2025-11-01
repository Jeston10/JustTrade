'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

const ConditionalHeader = ({ user }: { user: User }) => {
    const pathname = usePathname();
    
    // Completely remove Header (global navbar) on stocks pages and search page
    // These pages use AppLayout with sidebar navigation only
    if (!pathname) {
        return <Header user={user} />;
    }
    
    // Remove Header completely on stock pages - navigation uses sidebar only
    if (pathname.startsWith('/stocks/') || 
        pathname.startsWith('/stock/') || 
        pathname === '/search') {
        return null; // Completely removed from DOM
    }
    
    return <Header user={user} />;
}

export default ConditionalHeader;

