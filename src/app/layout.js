import './globals.css';
import Sidebar from '@/components/Sidebar';
import { getSortedPatternsData } from '@/lib/markdown';

export const metadata = {
  title: 'DSA Vault - Templates Revision',
  description: 'Your personal Data Structures and Algorithms templates collection.',
};

export default function RootLayout({ children }) {
  const patterns = getSortedPatternsData();

  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Sidebar patterns={patterns} />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
