import { Globe } from 'lucide-react';

export default function Footer() {
  return (
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
  );
}