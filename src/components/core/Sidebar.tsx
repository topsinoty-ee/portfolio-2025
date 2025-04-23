// components/core/Sidebar.tsx
'use client';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, File } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { files, fileGroups } from './tabs';
import { memo } from 'react';
import {isValidTab} from "@/lib/isValidTab";

// File item component extracted and memoized for better performance
const FileItem = memo(({
                           fileName,
                           icon: FileIcon,
                           isActive,
                           onClick
                       }: {
    fileName: string;
    icon: any;
    isActive: boolean;
    onClick: () => void;
}) => (
    <SidebarMenuItem>
        <SidebarMenuButton
            onClick={onClick}
            className={`gap-2 ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
        >
            <FileIcon size={16} />
            <span>{fileName}</span>
        </SidebarMenuButton>
    </SidebarMenuItem>
));

FileItem.displayName = 'FileItem';

// Group component to reduce duplication
const FileGroup = memo(({
                            title,
                            files,
                            activeTab,
                            onFileClick
                        }: {
    title: string;
    files: typeof fileGroups.code | typeof fileGroups.assets;
    activeTab: string;
    onFileClick: (name: string) => void;
}) => (
    <SidebarGroup>
        <Collapsible defaultOpen>
            <SidebarMenu>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                            <div className="flex items-center gap-2">
                                <File size={16} />
                                <span>{title}</span>
                            </div>
                            <ChevronDown size={16} className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {files.map((file) => (
                                <FileItem
                                    key={file.name}
                                    fileName={file.name}
                                    icon={file.icon}
                                    isActive={activeTab === file.name}
                                    onClick={() => onFileClick(file.name)}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarMenu>
        </Collapsible>
    </SidebarGroup>
));

FileGroup.displayName = 'FileGroup';

export function SidebarContent({ initialTab }: { initialTab: string | null }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get('tab') ?? initialTab ?? '';

    const handleClick = (name: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', name);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <>
            <FileGroup
                title="Portfolio"
                files={fileGroups.code}
                activeTab={activeTab}
                onFileClick={handleClick}
            />
            <FileGroup
                title="Assets"
                files={fileGroups.assets}
                activeTab={activeTab}
                onFileClick={handleClick}
            />
        </>
    );
}