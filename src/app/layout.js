import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { getSortedPatternsData } from "@/lib/markdown";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DSA Vault",
  description: "Your ultimate revision companion for coding interviews.",
};

export default function RootLayout({ children }) {
  const patterns = getSortedPatternsData();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <div className="app-container">
            <Sidebar patterns={patterns} />
            <main className="main-content">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
