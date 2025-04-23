// Centralized validation function for tab names
import {files, TabName} from "@/components/core/tabs";

export function isValidTab(tabName: string | null): tabName is TabName {
    if (!tabName) return false;
    return files.some(file => file.name === tabName);
}