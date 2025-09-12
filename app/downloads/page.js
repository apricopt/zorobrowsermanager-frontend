'use client';

import { useState, useEffect } from 'react';
import { 
  Download, 
  CheckCircle, 
  Monitor, 
  Smartphone,
  Shield,
  Zap,
  ArrowRight,
  ExternalLink,
  Globe,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { formatFileSize, formatDate } from '../../utils/formatters';

export default function DownloadsPage() {
  const [releaseData, setReleaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReleaseData();
  }, []);

  const fetchReleaseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/releases');
      const data = await response.json();
      setReleaseData(data);
    } catch (err) {
      setError('Failed to fetch release data');
      console.error('Error fetching releases:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDownloadInfo = () => {
    if (!releaseData) return [];
    
    const { assets, version } = releaseData;
    
    return [
      {
        os: 'Windows',
        icon: Monitor,
        version: version,
        size: assets?.windows?.exe ? formatFileSize(assets.windows.exe.size) : 'N/A',
        architecture: ['x64'],
        downloadUrl: assets?.windows?.exe?.browser_download_url || '#',
        requirements: 'Windows 10 or later',
        description: 'Full-featured desktop application for Windows',
        available: !!assets?.windows?.exe
      },
      {
        os: 'macOS',
        icon: Monitor,
        version: version,
        size: assets?.macos?.intel ? formatFileSize(assets.macos.intel.size) : 'N/A',
        architecture: ['Intel', 'Apple Silicon'],
        downloadUrl: assets?.macos?.intel?.browser_download_url || '#',
        downloadUrlApple: assets?.macos?.appleSilicon?.browser_download_url || '#',
        requirements: 'macOS 10.15 or later',
        description: 'Native macOS application with full system integration',
        available: !!assets?.macos?.intel || !!assets?.macos?.appleSilicon
      },
      {
        os: 'Linux',
        icon: Monitor,
        version: version,
        size: assets?.linux?.appimage ? formatFileSize(assets.linux.appimage.size) : 'N/A',
        architecture: ['x64'],
        downloadUrl: assets?.linux?.appimage?.browser_download_url || '#',
        requirements: 'Ubuntu 18.04+ / Similar distributions',
        description: 'AppImage package for Linux distributions',
        available: !!assets?.linux?.appimage
      }
    ];
  };

  const downloads = getDownloadInfo();

  const features = [
    {
      icon: Shield,
      title: 'Secure Installation',
      description: 'All downloads are digitally signed and verified for your security'
    },
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'Get up and running in under 2 minutes with our streamlined installer'
    },
    {
      icon: Globe,
      title: 'Cross-Platform',
      description: 'Available for Windows, macOS, and Linux with feature parity'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <img 
                src="/logo.png" 
                alt="Zoro Browser Manager Logo" 
                className="w-20 h-20 sm:w-24 sm:h-24"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Download Zoro Browser Manager
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Get the desktop application and start managing your browser profiles like a professional. 
              Available for all major operating systems.
            </p>
            <div className="flex items-center justify-center text-white/80 text-sm flex-wrap gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>
                  Latest version: {loading ? (
                    <RefreshCw className="h-3 w-3 animate-spin inline ml-1" />
                  ) : (
                    releaseData?.version || 'Loading...'
                  )}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Free to download</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Secure & verified</span>
              </div>
            </div>
            {releaseData?.publishedAt && (
              <p className="text-white/60 text-sm mt-4">
                Released on {formatDate(releaseData.publishedAt)}
              </p>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
                <button 
                  onClick={fetchReleaseData}
                  className="mt-2 text-red-200 hover:text-white text-sm underline flex items-center justify-center mx-auto"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Download Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="card animate-pulse">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {downloads.map((download, index) => (
                <div key={index} className={`card hover:shadow-lg transition-shadow ${!download.available ? 'opacity-60' : ''}`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {download.os === 'Windows' ? (
                        <img src="/icons8-windows-10-100.png" alt="Windows" className="w-10 h-10" />
                      ) : download.os === 'macOS' ? (
                        <img src="/icons8-mac-logo-250.png" alt="macOS" className="w-10 h-10" />
                      ) : download.os === 'Linux' ? (
                        <img src="/icons8-linux-100.png" alt="Linux" className="w-10 h-10" />
                      ) : (
                        <download.icon className="h-8 w-8 text-primary-600" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{download.os}</h3>
                    <p className="text-gray-600 mb-4">{download.description}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Version: {download.version}</p>
                      <p>Size: {download.size}</p>
                      <p>Requirements: {download.requirements}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Architecture:</h4>
                    <div className="flex flex-wrap gap-2">
                      {download.architecture.map((arch, archIndex) => (
                        <span 
                          key={archIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {arch}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {download.os === 'Windows' && (
                      <>
                        <button 
                          className={`w-full flex items-center justify-center ${
                            download.available ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => download.available && window.open(download.downloadUrl, '_blank')}
                          disabled={!download.available}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {download.available ? 'Download for Windows (x64)' : 'Not Available'}
                        </button>
                      </>
                    )}
                    {download.os === 'macOS' && (
                      <>
                        <button 
                          className={`w-full flex items-center justify-center ${
                            download.downloadUrl !== '#' ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => download.downloadUrl !== '#' && window.open(download.downloadUrl, '_blank')}
                          disabled={download.downloadUrl === '#'}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {download.downloadUrl !== '#' ? 'Download for macOS (Intel)' : 'Not Available'}
                        </button>
                        <button 
                          className={`w-full flex items-center justify-center text-sm ${
                            download.downloadUrlApple !== '#' ? 'btn-secondary' : 'btn-secondary opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => download.downloadUrlApple !== '#' && window.open(download.downloadUrlApple, '_blank')}
                          disabled={download.downloadUrlApple === '#'}
                        >
                          <Download className="h-3 w-3 mr-2" />
                          {download.downloadUrlApple !== '#' ? 'macOS (Apple Silicon)' : 'Not Available'}
                        </button>
                      </>
                    )}
                    {download.os === 'Linux' && (
                      <>
                        <button 
                          className={`w-full flex items-center justify-center ${
                            download.available ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => download.available && window.open(download.downloadUrl, '_blank')}
                          disabled={!download.available}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {download.available ? 'Download AppImage (x64)' : 'Not Available'}
                        </button>
                      </>
                    )}
                    <button 
                      className="w-full btn-secondary text-sm"
                      onClick={() => window.open(releaseData?.htmlUrl || 'https://github.com/apricopt/zorobrowsermanager/releases', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Release Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Download Our Desktop App?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the full power of Zoro Browser Manager with our native desktop application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Installation Instructions */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Installation Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-primary-600" />
                  Windows
                </h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Download the .exe installer</li>
                  <li>2. Run as administrator if prompted</li>
                  <li>3. Follow the installation wizard</li>
                  <li>4. Launch from Start Menu or Desktop</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-primary-600" />
                  macOS
                </h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Download the .dmg file</li>
                  <li>2. Open the downloaded file</li>
                  <li>3. Drag app to Applications folder</li>
                  <li>4. Launch from Applications or Launchpad</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-primary-600" />
                  Linux
                </h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Download AppImage or DEB package</li>
                  <li>2. Make executable: chmod +x</li>
                  <li>3. Run directly or install via package manager</li>
                  <li>4. Launch from applications menu</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Windows</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Windows 10 or later</li>
                <li>• 2GB RAM minimum</li>
                <li>• 200MB free disk space</li>
                <li>• Internet connection required</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">macOS</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• macOS 10.15 or later</li>
                <li>• 2GB RAM minimum</li>
                <li>• 200MB free disk space</li>
                <li>• Internet connection required</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Linux</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ubuntu 18.04+ or similar</li>
                <li>• 2GB RAM minimum</li>
                <li>• 200MB free disk space</li>
                <li>• Internet connection required</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Managing Your Browser Profiles?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Download the app and create your account to get started with professional browser management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/auth/register"
              className="btn-primary bg-white text-primary-600 hover:bg-gray-50"
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link 
              href="/"
              className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}