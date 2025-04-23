// components/core/FooterNav.tsx
'use client';

import { Code2, LucideHome, Mail, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { TabName } from "./tabs";

// Map footer navigation items to corresponding tab files
const navigationMapping: Record<string, TabName> = {
    home: 'home.html',
    "about me": 'aboutMe.tsx',
    projects: 'projects.tsx',
    contact: 'contact.html'
};

export const FooterNav = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleNavigation = useCallback((label: string) => (e: React.MouseEvent) => {
        e.preventDefault();

        // Get corresponding tab file name
        const tabName = navigationMapping[label.toLowerCase()];
        if (!tabName) return;

        // Update URL with tab parameter
        const params = new URLSearchParams(searchParams);
        params.set('tab', tabName);
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    // Get current active tab
    const activeTab = searchParams.get('tab') || '';

    // Determine which navigation item is active based on current tab
    const getIsActive = (label: string) => {
        const correspondingTab = navigationMapping[label.toLowerCase()];
        return activeTab === correspondingTab;
    };

    return (
        <footer className="w-full fixed bottom-0 h-16 z-50 border border-border bg-background/95 backdrop-blur sm:hidden">
            <nav
                className="flex h-full items-center justify-around px-4"
                role="navigation"
                aria-label="Mobile navigation"
            >
                {Object.entries({
                    home: LucideHome,
                    "about me": User,
                    projects: Code2,
                    contact: Mail,
                }).map(([label, Icon]) => (
                    <Link
                        key={label}
                        href={`#${label.toLowerCase().replaceAll(" ", "-")}`}
                        onClick={handleNavigation(label)}
                        className={`flex flex-1 flex-col items-center justify-center gap-1 p-2.5 transition-colors 
                            ${getIsActive(label) ? 'text-primary' : 'hover:text-primary active:text-primary'} 
                            focus-visible:outline-ring`}
                        aria-label={`Navigate to ${label} section`}
                        aria-current={getIsActive(label) ? 'page' : undefined}
                    >
                        <Icon className="size-5"/>
                        <span className="sr-only sm:not-sr-only sm:text-xs text-white">
                            {label}
                        </span>
                    </Link>
                ))}
            </nav>
        </footer>
    );
}