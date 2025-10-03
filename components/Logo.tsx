import Link from "next/link";

const Logo = ({ className = "h-8 w-auto cursor-pointer" }: { className?: string }) => {
    return (
        <Link href="/" className={className}>
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-sm">JT</span>
                </div>
                <span className="text-white font-bold text-xl">JustTrade</span>
            </div>
        </Link>
    );
};

export default Logo;
