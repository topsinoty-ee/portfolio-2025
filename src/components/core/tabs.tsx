// components/core/tabs.tsx
'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {Code, File, FileCode2} from 'lucide-react';
import {useMemo} from 'react';
import {isValidTab} from "@/lib/isValidTab";

export type FileType = 'html' | 'tsx' | 'pdf' | 'jpg';
export type FileIcon = typeof Code | typeof FileCode2 | typeof File;

interface PortfolioFile {
    name: string;
    icon: FileIcon;
    group: 'code' | 'assets';
    type: FileType;
}

export const files: readonly PortfolioFile[] = [
    { name: 'home.html', icon: Code, group: 'code', type: 'html' },
    { name: 'aboutMe.tsx', icon: FileCode2, group: 'code', type: 'tsx' },
    { name: 'projects.tsx', icon: FileCode2, group: 'code', type: 'tsx' },
    { name: 'contact.html', icon: Code, group: 'code', type: 'html' },
    { name: 'resume.pdf', icon: File, group: 'assets', type: 'pdf' },
    { name: 'picture.jpg', icon: File, group: 'assets', type: 'jpg' },
] as const;

export type TabName = typeof files[number]['name'];

export const fileGroups = {
    code: files.filter(f => f.group === 'code'),
    assets: files.filter(f => f.group === 'assets'),
};

export function Tabs({ initialTab }: { initialTab: string | null }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') ?? initialTab ?? '';

    // Using the shared validation logic
    const isValid = isValidTab(activeTab);

    // Memoize the current group to prevent recalculations
    const currentGroup = useMemo(() => {
        return files.find(file => file.name === activeTab)?.group || 'code';
    }, [activeTab]);

    // Memoize filtered files based on current group
    const groupFiles = useMemo(() => {
        return fileGroups[currentGroup];
    }, [currentGroup]);

    const handleTabClick = (tabName: TabName) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', tabName);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="w-full flex flex-col border-b">
            <div className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium uppercase tracking-wider">
                {currentGroup === 'code' ? 'Portfolio' : 'Assets'}
            </div>
            <div className="flex overflow-x-auto">
                {groupFiles.map(file => (
                    <button
                        key={file.name}
                        onClick={() => handleTabClick(file.name)}
                        className={`flex items-center gap-2 px-4 py-2 border-r transition-colors whitespace-nowrap 
                        ${activeTab === file.name
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'}`}
                    >
                        <file.icon className="size-4" />
                        <span>{file.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}