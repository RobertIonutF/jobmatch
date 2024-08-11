import { ThemeProvider } from "@/providers/theme-provider";
import { NavbarWrapper } from "@/components/navbar/navbar-wrapper";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

export const revalidate = 30;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobMatch - Găsește jobul perfect",
  description: "Platformă de recrutare bazată pe inteligență artificială",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ro" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavbarWrapper />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}