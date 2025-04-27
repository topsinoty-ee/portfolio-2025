import { createContext } from "react";

interface FlashLightContextValue {
  enabled: boolean;
  toggle: () => void;
}

export const FlashLightContext = createContext<FlashLightContextValue | undefined>(undefined);
