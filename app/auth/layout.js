export const metadata = {
  title: 'Authentication - Zoro Browser Manager',
  description: 'Sign in to your Zoro Browser Manager account',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen gradient-bg">
      {children}
    </div>
  );
}