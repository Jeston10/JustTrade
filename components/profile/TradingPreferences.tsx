'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, Shield, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface TradingPreferencesProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const TradingPreferences = ({ user }: TradingPreferencesProps) => {
    const [preferences, setPreferences] = useState({
        riskTolerance: 'medium',
        investmentGoals: ['growth'] as string[],
        preferredSectors: [] as string[],
        tradingStyle: 'swing',
        maxPositionSize: 10,
        stopLossPercentage: 5,
        takeProfitPercentage: 15,
        tradingHours: 'market',
        notifications: {
            priceAlerts: true,
            newsAlerts: true,
            marketOpen: true,
            marketClose: true,
            weeklyReport: true
        }
    });

    const sectors = [
        'Technology', 'Healthcare', 'Financial', 'Energy', 'Consumer',
        'Industrial', 'Materials', 'Utilities', 'Real Estate', 'Communication'
    ];

    const handlePreferenceChange = (field: string, value: any) => {
        setPreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleInvestmentGoalToggle = (goal: string) => {
        setPreferences(prev => ({
            ...prev,
            investmentGoals: prev.investmentGoals.includes(goal)
                ? prev.investmentGoals.filter(g => g !== goal)
                : [...prev.investmentGoals, goal]
        }));
    };

    const handleSectorToggle = (sector: string) => {
        setPreferences(prev => ({
            ...prev,
            preferredSectors: prev.preferredSectors.includes(sector)
                ? prev.preferredSectors.filter(s => s !== sector)
                : [...prev.preferredSectors, sector]
        }));
    };

    const handleNotificationToggle = (notification: string) => {
        setPreferences(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [notification]: !prev.notifications[notification as keyof typeof prev.notifications]
            }
        }));
    };

    const handleSave = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Trading preferences updated successfully');
        } catch (error) {
            toast.error('Failed to update preferences');
        }
    };

    return (
        <div className="space-y-4">
            {/* Risk Tolerance & Investment Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Target className="w-4 h-4 inline mr-2" />
                        Risk Tolerance
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: 'low', label: 'Low', color: 'text-green-400' },
                            { value: 'medium', label: 'Medium', color: 'text-blue-400' },
                            { value: 'high', label: 'High', color: 'text-red-400' }
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handlePreferenceChange('riskTolerance', option.value)}
                                className={`p-2 rounded text-sm transition-all ${
                                    preferences.riskTolerance === option.value
                                        ? 'bg-yellow-400 text-gray-900 font-medium'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                <span className={option.color}>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <TrendingUp className="w-4 h-4 inline mr-2" />
                        Investment Goals
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { value: 'income', label: 'Income' },
                            { value: 'growth', label: 'Growth' },
                            { value: 'balanced', label: 'Balanced' },
                            { value: 'speculation', label: 'Speculation' }
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleInvestmentGoalToggle(option.value)}
                                className={`p-2 rounded text-sm transition-all ${
                                    preferences.investmentGoals.includes(option.value)
                                        ? 'bg-yellow-400 text-gray-900 font-medium'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preferred Sectors */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Preferred Sectors
                </label>
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                    {sectors.map((sector) => (
                        <button
                            key={sector}
                            onClick={() => handleSectorToggle(sector)}
                            className={`p-2 rounded text-sm transition-all ${
                                preferences.preferredSectors.includes(sector)
                                    ? 'bg-yellow-400 text-gray-900 font-medium'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {sector}
                        </button>
                    ))}
                </div>
            </div>

            {/* Trading Style & Position Sizing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Trading Style
                    </label>
                    <select
                        value={preferences.tradingStyle}
                        onChange={(e) => handlePreferenceChange('tradingStyle', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                    >
                        <option value="day">Day Trading</option>
                        <option value="swing">Swing Trading</option>
                        <option value="position">Position Trading</option>
                        <option value="scalping">Scalping</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Position Size (%)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={preferences.maxPositionSize}
                        onChange={(e) => handlePreferenceChange('maxPositionSize', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Risk Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        Stop Loss (%)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={preferences.stopLossPercentage}
                        onChange={(e) => handlePreferenceChange('stopLossPercentage', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Take Profit (%)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={preferences.takeProfitPercentage}
                        onChange={(e) => handlePreferenceChange('takeProfitPercentage', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Notifications */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Notification Preferences
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {Object.entries(preferences.notifications).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between cursor-pointer p-2 bg-gray-800/30 rounded">
                            <span className="text-sm text-gray-300 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => handleNotificationToggle(key)}
                                    className="sr-only"
                                />
                                <div className={`w-10 h-5 rounded-full transition-colors ${
                                    value ? 'bg-yellow-400' : 'bg-gray-600'
                                }`}>
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                        value ? 'translate-x-5' : 'translate-x-0.5'
                                    } mt-0.5`} />
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
                Save Preferences
            </button>
        </div>
    );
};

export default TradingPreferences;
