'use client';

import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import TradingCard from '@/components/ui/TradingCard';
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS} from "@/lib/constants";
import {CountrySelectField} from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import {signUpWithEmail} from "@/lib/actions/auth.actions";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import { UserPlus, Target, TrendingUp, BarChart3, Shield, Activity, DollarSign } from "lucide-react";

const SignUp = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'US',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology'
        },
        mode: 'onBlur'
    }, );

    const onSubmit = async (data: SignUpFormData) => {
        const result = await signUpWithEmail(data);
        
        if (result.success) {
            toast.success('Account created successfully!', {
                description: 'Welcome to JustTrade! You can now start tracking your investments.'
            });
            router.push('/');
        } else {
            toast.error('Sign up failed', {
                description: result.error || 'Failed to create an account. Please try again.'
            });
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-8">
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-blue-900/20 z-20"></div>

            {/* Content */}
            <div className="relative z-30 w-full max-w-4xl mx-auto px-4">
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
                    title="Create Your Account"
                    subtitle="Join JustTrade and start your investment journey"
                    variant="compact"
                    icon={<UserPlus className="w-5 h-5 text-green-400" />}
                    status="live"
                    className="backdrop-blur-md bg-gray-900/80 border-gray-700/50 shadow-2xl"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                name="fullName"
                                label="Full Name"
                                placeholder="John Doe"
                                register={register}
                                error={errors.fullName}
                                validation={{ required: 'Full name is required', minLength: 2 }}
                            />

                            <InputField
                                name="email"
                                label="Email"
                                placeholder="contact@justtrade.app"
                                register={register}
                                error={errors.email}
                                validation={{ required: 'Email name is required', pattern: /^\w+@\w+\.\w+$/, message: 'Email address is required' }}
                            />
                        </div>

                        <InputField
                            name="password"
                            label="Password"
                            placeholder="Enter a strong password"
                            type="password"
                            register={register}
                            error={errors.password}
                            validation={{ required: 'Password is required', minLength: 8 }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CountrySelectField
                                name="country"
                                label="Country"
                                control={control}
                                error={errors.country}
                                required
                            />

                            <SelectField
                                name="investmentGoals"
                                label="Investment Goals"
                                placeholder="Select your investment goal"
                                options={INVESTMENT_GOALS}
                                control={control}
                                error={errors.investmentGoals}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectField
                                name="riskTolerance"
                                label="Risk Tolerance"
                                placeholder="Select your risk level"
                                options={RISK_TOLERANCE_OPTIONS}
                                control={control}
                                error={errors.riskTolerance}
                                required
                            />

                            <SelectField
                                name="preferredIndustry"
                                label="Preferred Industry"
                                placeholder="Select your preferred industry"
                                options={PREFERRED_INDUSTRIES}
                                control={control}
                                error={errors.preferredIndustry}
                                required
                            />
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                            {isSubmitting ? 'Creating Account' : 'Start Your Investing Journey'}
                        </Button>

                        <FooterLink text="Already have an account?" linkText="Sign in" href="/sign-in" />
                    </form>
                </TradingCard>

                {/* Features */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
                        <DollarSign className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-300">Profitable</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SignUp;
