import AppLayout from "@/components/AppLayout";
import TradingCard from "@/components/ui/TradingCard";
import ProfileForm from "@/components/profile/ProfileForm";
import TradingPreferences from "@/components/profile/TradingPreferences";
import StockMonitoring from "@/components/profile/StockMonitoring";
import AccountSettings from "@/components/profile/AccountSettings";
import LogoutButton from "@/components/profile/LogoutButton";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User, Settings, Target, BarChart3, Shield } from "lucide-react";

const Profile = async () => {
    const session = await auth.api.getSession({ headers: await headers() });

    if(!session?.user) redirect('/sign-in');

    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    }

    return (
        <AppLayout user={user}>
            <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] p-4 lg:p-6">
                {/* Header Section */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                My <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Profile</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-gray-300">Manage your trading preferences and account settings</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                Profile Active
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                Settings Updated
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid - Optimized Layout */}
                <div className="grid grid-cols-1 2xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                    {/* Profile Information - Takes 1 column on large screens */}
                    <TradingCard
                        title="Profile Information"
                        subtitle="Update your personal details and profile picture"
                        variant="data"
                        icon={<User className="w-5 h-5 text-blue-400" />}
                        status="live"
                        className="2xl:col-span-1"
                    >
                        <ProfileForm user={user} />
                    </TradingCard>

                    {/* Trading Preferences - Takes 3 columns on large screens */}
                    <TradingCard
                        title="Trading Preferences"
                        subtitle="Configure your trading style and risk tolerance"
                        variant="data"
                        icon={<Target className="w-5 h-5 text-green-400" />}
                        status="live"
                        className="2xl:col-span-3"
                    >
                        <TradingPreferences user={user} />
                    </TradingCard>
                </div>

                {/* Bottom Section - Full width layout for better space utilization */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                    {/* Left Column - Stock Monitoring and Logout */}
                    <div className="space-y-4 lg:space-y-6">
                        {/* Stock Monitoring */}
                        <TradingCard
                            title="Stock Monitoring"
                            subtitle="Manage your watchlist and monitoring preferences"
                            variant="data"
                            icon={<BarChart3 className="w-5 h-5 text-purple-400" />}
                            status="live"
                            className="h-fit"
                        >
                            <StockMonitoring user={user} />
                        </TradingCard>

                        {/* Logout Button */}
                        <TradingCard
                            title="Account Actions"
                            subtitle="Manage your account session and security"
                            variant="data"
                            icon={<User className="w-5 h-5 text-orange-400" />}
                            status="live"
                            className="h-fit"
                        >
                            <LogoutButton user={user} />
                        </TradingCard>
                    </div>

                    {/* Right Column - Account Settings */}
                    <div>
                        <TradingCard
                            title="Account Settings"
                            subtitle="Security and notification preferences"
                            variant="data"
                            icon={<Shield className="w-5 h-5 text-red-400" />}
                            status="live"
                            className="h-fit"
                        >
                            <AccountSettings user={user} />
                        </TradingCard>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Profile;
