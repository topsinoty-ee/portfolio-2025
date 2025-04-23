// app/layout.tsx
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { FooterNav } from '@/components/core/FooterNav';
import { HeaderNav } from '@/components/core/HeaderNav';
import {
    Sidebar,
    SidebarProvider
} from '@/components/ui/sidebar';
import { Tabs } from '@/components/core/tabs';
import { headers } from 'next/headers';
import { SidebarContent } from "@/components/core/Sidebar";
import {isValidTab} from "@/lib/isValidTab";

const jetBrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Devfolio | Promise Temitope',
    description: 'Text-editor inspired portfolio to display my skills',
};

async function getInitialTab() {
    try {
        const headersList = headers();
        const url = new URL((await headersList).get('x-url') ?? '', 'http://localhost');
        const tab = url.searchParams.get('tab');
        // Using the centralized validation function
        return isValidTab(tab) ? tab : null;
    } catch (error) {
        console.error('Error parsing initial tab:', error);
        return null;
    }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const initialTab = await getInitialTab();

    return (
        <html lang="en">
        <body className={`${jetBrainsMono.variable} dark antialiased h-screen bg-background text-foreground transition-colors duration-200 ease-linear`}>
        <HeaderNav />
        <div className="flex w-full h-[calc(100vh-4rem)] bg-background overflow-hidden">
            <SidebarProvider>
                <Sidebar>
                    <SidebarContent initialTab={initialTab} />
                </Sidebar>
            </SidebarProvider>
            <div className="w-full h-full flex flex-col">
                <Tabs initialTab={initialTab} />
                <main className="w-full h-full overflow-auto border bg-muted p-5 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
        <FooterNav />
        </body>
        </html>
    );
}