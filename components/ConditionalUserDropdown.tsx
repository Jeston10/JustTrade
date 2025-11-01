'use client';

import { usePathname } from "next/navigation";
import UserDropdown from "@/components/UserDropdown";

const ConditionalUserDropdown = ({ user, initialStocks }: { user: User, initialStocks: StockWithWatchlistStatus[] }) => {
    const pathname = usePathname();
    
    // Completely remove UserDropdown on stocks pages and search page
    // These pages use sidebar navigation only
    if (!pathname) {
        return <UserDropdown user={user} initialStocks={initialStocks} />;
    }
    
    // Remove UserDropdown completely on stock pages
    if (pathname.startsWith('/stocks/') || 
        pathname.startsWith('/stock/') || 
        pathname === '/search') {
        return null; // Completely removed from DOM
    }
    
    return <UserDropdown user={user} initialStocks={initialStocks} />;
}

export default ConditionalUserDropdown;

