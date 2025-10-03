'use client';

import React, { useState } from 'react';
import { Shield, Key, Bell, Eye, EyeOff, Save, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface AccountSettingsProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const AccountSettings = ({ user }: AccountSettingsProps) => {
    const [settings, setSettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        dataSharing: false,
        marketingEmails: false
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleInputChange = (field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handlePasswordChange = async () => {
        if (settings.newPassword !== settings.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (settings.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Password updated successfully');
            setSettings(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            toast.error('Failed to update password');
        }
    };

    const handleSettingsSave = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Settings updated successfully');
        } catch (error) {
            toast.error('Failed to update settings');
        }
    };

    const handleDataExport = async () => {
        try {
            // Simulate data export
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Data export started. You will receive an email when ready.');
        } catch (error) {
            toast.error('Failed to start data export');
        }
    };

    const handleAccountDeletion = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            // Simulate account deletion
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Account deletion initiated. You will receive a confirmation email.');
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    return (
        <div className="space-y-4">
            {/* Security Settings */}
            <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Settings
                </h3>
                <div className="space-y-3">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
                        <div>
                            <div className="font-medium text-white text-sm">Two-Factor Authentication</div>
                            <div className="text-xs text-gray-400">Add an extra layer of security</div>
                        </div>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={settings.twoFactorEnabled}
                                onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors ${
                                settings.twoFactorEnabled ? 'bg-yellow-400' : 'bg-gray-600'
                            }`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                    settings.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0.5'
                                } mt-0.5`} />
                            </div>
                        </div>
                    </div>

                    {/* Password Change */}
                    <div className="space-y-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={settings.currentPassword}
                                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                    className="w-full px-3 py-2 pr-10 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={settings.newPassword}
                                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                    className="w-full px-3 py-2 pr-10 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={settings.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className="w-full px-3 py-2 pr-10 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handlePasswordChange}
                            className="w-full py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-semibold rounded hover:from-blue-500 hover:to-cyan-600 transition-all text-sm"
                        >
                            <Key className="w-3 h-3 inline mr-1" />
                            Update Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Preferences
                </h3>
                <div className="space-y-2">
                    {[
                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                        { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive updates via SMS' },
                        { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser notifications' },
                        { key: 'dataSharing', label: 'Data Sharing', description: 'Share anonymous data for improvements' },
                        { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional content' }
                    ].map((notification) => (
                        <div key={notification.key} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                            <div>
                                <div className="font-medium text-white text-sm">{notification.label}</div>
                                <div className="text-xs text-gray-400">{notification.description}</div>
                            </div>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={settings[notification.key as keyof typeof settings] as boolean}
                                    onChange={(e) => handleInputChange(notification.key, e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-10 h-5 rounded-full transition-colors ${
                                    settings[notification.key as keyof typeof settings] ? 'bg-yellow-400' : 'bg-gray-600'
                                }`}>
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                        settings[notification.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0.5'
                                    } mt-0.5`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Data Management */}
            <div>
                <h3 className="text-sm font-semibold text-white mb-3">Data Management</h3>
                <div className="space-y-2">
                    <button
                        onClick={handleDataExport}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-gray-800/50 border border-gray-700 rounded text-white hover:bg-gray-700/50 transition-colors text-sm"
                    >
                        <Download className="w-3 h-3" />
                        Export My Data
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div>
                <h3 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h3>
                <button
                    onClick={handleAccountDeletion}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                >
                    <Trash2 className="w-3 h-3" />
                    Delete Account
                </button>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSettingsSave}
                className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
                <Save className="w-3 h-3 inline mr-1" />
                Save All Settings
            </button>
        </div>
    );
};

export default AccountSettings;
