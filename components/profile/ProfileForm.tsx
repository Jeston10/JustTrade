'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, User, Mail, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileFormProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const ProfileForm = ({ user }: ProfileFormProps) => {
    const [profileData, setProfileData] = useState({
        name: user.name || '',
        email: user.email || '',
        bio: '',
        location: '',
        tradingExperience: '',
        profilePicture: null as File | null,
        profilePictureUrl: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setIsUploading(true);
        
        try {
            // Simulate file upload
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData(prev => ({
                    ...prev,
                    profilePicture: file,
                    profilePictureUrl: e.target?.result as string
                }));
                toast.success('Profile picture uploaded successfully');
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error('Failed to upload profile picture');
        } finally {
            setIsUploading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="text-center">
                <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-gray-700 bg-gray-800 flex items-center justify-center">
                        {profileData.profilePictureUrl ? (
                            <img
                                src={profileData.profilePictureUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    <button
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <div className="w-3 h-3 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Camera className="w-3 h-3 text-gray-900" />
                        )}
                    </button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <p className="text-xs text-gray-400 mt-1">Click to upload</p>
            </div>

            {/* Form Fields - Compact Layout */}
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                            placeholder="Enter your full name"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                        Location
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                            placeholder="City, Country"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                        Trading Experience
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        <select
                            value={profileData.tradingExperience}
                            onChange={(e) => handleInputChange('tradingExperience', e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                        >
                            <option value="">Select experience level</option>
                            <option value="beginner">Beginner (0-1 years)</option>
                            <option value="intermediate">Intermediate (1-5 years)</option>
                            <option value="advanced">Advanced (5-10 years)</option>
                            <option value="expert">Expert (10+ years)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                        Bio & Trading Goals
                    </label>
                    <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all resize-none text-sm"
                        placeholder="Tell us about your trading goals..."
                    />
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
                Save Profile
            </button>
        </div>
    );
};

export default ProfileForm;
