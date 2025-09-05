'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Trash2,
  Save,
  Eye,
  EyeOff,
  CreditCard,
  Crown,
  Check
} from 'lucide-react';
import DashboardNavbar from '../../../components/DashboardNavbar';

export default function SettingsPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');

  // Handle URL parameters to auto-open specific tabs
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'security', 'subscription', 'preferences', 'danger'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // Handle payment success - force refresh subscription data
    const success = searchParams.get('success');
    if (success === 'true') {
      // Add a small delay to allow Stripe webhooks to process
      setTimeout(() => {
        loadSubscriptionData(true); // Force refresh
      }, 2000);
    }
  }, [searchParams]);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    browserNotifications: false,
    twoFactorAuth: false,
  });

  // Subscription state
  const [subscription, setSubscription] = useState({
    planType: 'free',
    status: 'active',
    profileCount: 7,
    profileLimit: 10,
    currentPeriodEnd: null,
    isLoading: false
  });

  // Load subscription data from backend
  const loadSubscriptionData = async (forceRefresh = false) => {
    try {
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const url = forceRefresh 
        ? `${apiUrl}/api/user/subscription?refresh=true`
        : `${apiUrl}/api/user/subscription`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(prev => ({
          ...prev,
          planType: data.planType,
          status: data.status,
          profileLimit: data.profileLimit,
          currentPeriodEnd: data.currentPeriodEnd
        }));
        
        if (forceRefresh) {
          console.log('✅ Subscription data refreshed:', data.planType);
        }
      }
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    }
  };

  useEffect(() => {
    loadSubscriptionData();
  }, [token]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log('Saving profile');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // TODO: Implement password change API call
    console.log('Changing password');
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    // TODO: Implement preferences update API call
    console.log('Saving preferences');
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion API call
      console.log('Deleting account');
    }
  };

  // Subscription handlers
  const handleUpgradeToPro = async () => {
    setSubscription(prev => ({ ...prev, isLoading: true }));
    try {
      // TODO: Call backend API to create Stripe checkout session
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/user/subscription/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        alert('Failed to start upgrade: ' + data.error);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade process');
    } finally {
      setSubscription(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleManageBilling = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/user/subscription/portal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        window.location.href = data.url;
      } else {
        alert('Failed to open billing portal: ' + data.error);
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      alert('Failed to open billing portal');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <DashboardNavbar />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and security settings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Responsive Tabs */}
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-sm sm:text-base font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  <span className="hidden xs:inline sm:inline">{tab.label}</span>
                  <span className="xs:hidden sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button type="submit" className="btn-primary w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base px-3 py-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10 text-base px-3 py-2"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button type="submit" className="btn-primary w-full sm:w-auto">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Subscription Management</h3>
                
                {/* Current Plan */}
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {subscription.planType === 'pro' ? (
                          <Crown className="w-6 h-6 text-yellow-500 mr-3" />
                        ) : (
                          <CreditCard className="w-6 h-6 text-blue-500 mr-3" />
                        )}
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {subscription.planType === 'pro' ? 'Browser Manager Pro' : 'Free Plan'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {subscription.planType === 'pro' ? 'Unlimited profiles and premium features' : `${subscription.profileCount}/${subscription.profileLimit} profiles used`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {subscription.planType === 'pro' ? '$20' : '$0'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {subscription.planType === 'pro' ? 'per month' : 'forever'}
                        </p>
                      </div>
                    </div>

                    {subscription.planType === 'pro' && subscription.currentPeriodEnd && (
                      <p className="text-sm text-gray-600 mb-4">
                        Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    )}

                    {/* Usage Progress Bar for Free Plan */}
                    {subscription.planType === 'free' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Profile Usage</span>
                          <span>{subscription.profileCount}/{subscription.profileLimit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              subscription.profileCount >= subscription.profileLimit 
                                ? 'bg-red-500' 
                                : subscription.profileCount >= subscription.profileLimit * 0.8 
                                  ? 'bg-yellow-500' 
                                  : 'bg-blue-500'
                            }`}
                            style={{ width: `${(subscription.profileCount / subscription.profileLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {subscription.planType === 'free' ? (
                        <button
                          onClick={handleUpgradeToPro}
                          disabled={subscription.isLoading}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {subscription.isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Starting Upgrade...
                            </>
                          ) : (
                            <>
                              <Crown className="w-4 h-4 mr-2" />
                              Upgrade to Pro - $20/month
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={handleManageBilling}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Manage Billing
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Plan Comparison */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Free Plan */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Free Plan</h4>
                      <p className="text-3xl font-bold text-gray-900 mt-2">$0</p>
                      <p className="text-sm text-gray-500">Forever free</p>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        10 browser profiles
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        Basic profile management
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        Community support
                      </li>
                    </ul>
                  </div>

                  {/* Pro Plan */}
                  <div className="border-2 border-blue-500 rounded-lg p-6 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Pro Plan</h4>
                      <p className="text-3xl font-bold text-gray-900 mt-2">$20</p>
                      <p className="text-sm text-gray-500">Per month</p>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <strong>Unlimited</strong> browser profiles
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        Advanced browser engines
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        Priority support
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        Profile sync & backup
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        7-day free trial
                      </li>
                    </ul>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-8">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Frequently Asked Questions</h4>
                  <div className="space-y-4">
                    <details className="bg-gray-50 rounded-lg p-4">
                      <summary className="font-medium text-gray-900 cursor-pointer">
                        Can I cancel anytime?
                      </summary>
                      <p className="text-sm text-gray-600 mt-2">
                        Yes, you can cancel your subscription at any time. You'll continue to have Pro access until the end of your billing period.
                      </p>
                    </details>
                    <details className="bg-gray-50 rounded-lg p-4">
                      <summary className="font-medium text-gray-900 cursor-pointer">
                        What happens to my profiles if I downgrade?
                      </summary>
                      <p className="text-sm text-gray-600 mt-2">
                        Your profiles remain intact, but you'll be limited to 10 active profiles. You can choose which ones to keep active.
                      </p>
                    </details>
                    <details className="bg-gray-50 rounded-lg p-4">
                      <summary className="font-medium text-gray-900 cursor-pointer">
                        Is there a free trial?
                      </summary>
                      <p className="text-sm text-gray-600 mt-2">
                        Yes! Pro plan includes a 7-day free trial. No charges until the trial period ends.
                      </p>
                    </details>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
                <form onSubmit={handleSavePreferences} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <p className="text-sm text-gray-500">Receive email updates about your account</p>
                      </div>
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        checked={preferences.emailNotifications}
                        onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="browserNotifications" className="text-sm font-medium text-gray-700">
                          Browser Notifications
                        </label>
                        <p className="text-sm text-gray-500">Show notifications in your browser</p>
                      </div>
                      <input
                        type="checkbox"
                        id="browserNotifications"
                        checked={preferences.browserNotifications}
                        onChange={(e) => setPreferences({ ...preferences, browserNotifications: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="twoFactorAuth" className="text-sm font-medium text-gray-700">
                          Two-Factor Authentication
                        </label>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <input
                        type="checkbox"
                        id="twoFactorAuth"
                        checked={preferences.twoFactorAuth}
                        onChange={(e) => setPreferences({ ...preferences, twoFactorAuth: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button type="submit" className="btn-primary w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div>
                <h3 className="text-lg font-medium text-red-600 mb-6">Danger Zone</h3>
                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <h4 className="text-md font-medium text-red-800 mb-2">Delete Account</h4>
                  <p className="text-sm text-red-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}