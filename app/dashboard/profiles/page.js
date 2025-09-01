'use client';

import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import DashboardNavbar from '../../../components/DashboardNavbar';
import { 
  Plus,
  Chrome,
  Firefox,
  Globe,
  Edit3,
  Trash2,
  Play,
  Settings,
  Copy,
  MoreVertical,
  User,
  Shield,
  Clock
} from 'lucide-react';

export default function ProfilesPage() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Mock browser profiles data
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: 'Work Profile',
      browser: 'chrome',
      description: 'For work-related browsing and development',
      status: 'active',
      lastUsed: '2 hours ago',
      bookmarks: 45,
      extensions: 8,
      created: '2024-01-15'
    },
    {
      id: 2,
      name: 'Personal',
      browser: 'firefox',
      description: 'Personal browsing and social media',
      status: 'inactive',
      lastUsed: '1 day ago',
      bookmarks: 23,
      extensions: 5,
      created: '2024-01-10'
    },
    {
      id: 3,
      name: 'Testing Environment',
      browser: 'chrome',
      description: 'Clean environment for testing websites',
      status: 'active',
      lastUsed: '30 minutes ago',
      bookmarks: 5,
      extensions: 2,
      created: '2024-01-20'
    }
  ]);

  const getBrowserIcon = (browser) => {
    switch (browser) {
      case 'chrome':
        return Chrome;
      case 'firefox':
        return Firefox;
      default:
        return Globe;
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const handleLaunchProfile = (profileId) => {
    console.log('Launching profile:', profileId);
    // TODO: Implement profile launch logic
  };

  const handleEditProfile = (profileId) => {
    console.log('Editing profile:', profileId);
    // TODO: Implement edit profile logic
  };

  const handleDeleteProfile = (profileId) => {
    if (confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      setProfiles(profiles.filter(p => p.id !== profileId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <DashboardNavbar />
      
      {/* Page Header */}
      {/* <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browser Profiles</h1>
              <p className="text-gray-600 mt-1">Manage your isolated browser environments</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary mt-4 sm:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Profile
            </button>
          </div>
        </div>
      </div> */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="max-w-md mx-auto">
            <Globe className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser Profile Management</h2>
            <p className="text-gray-500 mb-8">
              Advanced browser profile creation and management features are currently being developed as part of our desktop application integration.
            </p>
            
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
              <h3 className="text-primary-800 font-semibold mb-3">🚀 Coming Soon!</h3>
              <div className="text-left space-y-2 text-primary-700">
                <div className="flex items-center">
                  <Chrome className="w-4 h-4 mr-2" />
                  <span>Multi-browser profile support</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Isolated browsing environments</span>
                </div>
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Custom extensions & bookmarks</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>Profile templates & sharing</span>
                </div>
                <div className="flex items-center">
                  <Play className="w-4 h-4 mr-2" />
                  <span>One-click profile launching</span>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-primary-800 text-sm">
                <strong>Desktop Integration Required:</strong> Profile management will be available through our desktop application for optimal performance and security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}