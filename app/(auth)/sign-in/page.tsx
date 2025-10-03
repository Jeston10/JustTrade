'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import TradingCard from '@/components/ui/TradingCard';
import {signInWithEmail} from "@/lib/actions/auth.actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import { Shield, TrendingUp, Activity, BarChart3 } from "lucide-react";

const SignIn = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        const result = await signInWithEmail(data);
        
        if (result.success) {
            toast.success('Welcome back!', {
                description: 'You have been successfully signed in.'
            });
            router.push('/');
        } else {
            toast.error('Sign in failed', {
                description: result.error || 'Invalid email or password. Please try again.'
            });
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/TradeVideo.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 z-20"></div>

            {/* Content */}
            <div className="relative z-30 w-full max-w-md mx-auto px-4">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <BarChart3 className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-3xl font-bold text-white">JustTrade</h1>
                    </div>
                    <p className="text-gray-300 text-sm">Professional Trading Platform</p>
                </div>

                {/* Form Card */}
                <TradingCard
                    title="Welcome Back"
                    subtitle="Sign in to access your trading dashboard"
                    variant="compact"
                    icon={<Shield className="w-5 h-5 text-blue-400" />}
                    status="live"
                    className="backdrop-blur-md bg-gray-900/80 border-gray-700/50 shadow-2xl"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <InputField
                            name="email"
                            label="Email"
                            placeholder="contact@justtrade.app"
                            register={register}
                            error={errors.email}
                            validation={{ required: 'Email is required', pattern: /^\w+@\w+\.\w+$/ }}
                        />

                        <InputField
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            register={register}
                            error={errors.password}
                            validation={{ required: 'Password is required', minLength: 8 }}
                        />

                        <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                            {isSubmitting ? 'Signing In' : 'Sign In'}
                        </Button>

                        <FooterLink text="Don't have an account?" linkText="Create an account" href="/sign-up" />
                    </form>
                </TradingCard>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
                        <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-300">Live Data</p>
                    </div>
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
                        <Activity className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-300">Real-time</p>
                    </div>
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
                        <Shield className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-300">Secure</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SignIn;
