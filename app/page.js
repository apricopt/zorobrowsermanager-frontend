'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { 
  Globe, 
  Shield, 
  Settings, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Star,
  PlayCircle
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth/register');
    }
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center text-white">
          <div className="w-8 h-8 mx-auto mb-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Zoro Browser Manager</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleSignIn}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={handleGetStarted}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 animate-fade-in">
              Professional Browser 
              <span className="block text-secondary-200">Profile Management</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in animation-delay-200">
              Manage multiple browser profiles with ease. Streamline your workflow, enhance privacy, and boost productivity with isolated browsing environments.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-400">
              <button 
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform"
              >
                Start Managing Profiles
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 text-lg px-8 py-4">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Zoro Browser Manager?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for professionals who need organized, secure browsing experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Multiple Profiles</h3>
              <p className="text-gray-600">
                Create and manage unlimited browser profiles for different projects, clients, or personal use.
              </p>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enhanced Privacy</h3>
              <p className="text-gray-600">
                Keep your browsing data completely isolated between profiles for maximum privacy and security.
              </p>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Settings className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Management</h3>
              <p className="text-gray-600">
                Intuitive dashboard to organize, launch, and configure all your browser profiles in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                Streamline Your Digital Workflow
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Separate Work & Personal</h3>
                    <p className="text-gray-600">Keep your professional and personal browsing completely separate with dedicated profiles.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Client-Specific Profiles</h3>
                    <p className="text-gray-600">Create dedicated profiles for each client with their specific bookmarks and settings.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing & Development</h3>
                    <p className="text-gray-600">Perfect for developers who need clean environments for testing different scenarios.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Trusted by Professionals</h3>
                  <p className="text-gray-600">Join thousands of users who rely on Zoro for their daily browsing needs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Ready to Get Organized?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Start managing your browser profiles like a pro. Create your account and experience the difference.
          </p>
          <button 
            onClick={handleGetStarted}
            className="btn-primary bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-4 hover:scale-105 transition-transform"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Globe className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">Zoro Browser Manager</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Zoro Browser Manager. Professional browser profile management.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}