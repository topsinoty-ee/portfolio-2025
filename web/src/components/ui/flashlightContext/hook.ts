import { useContext } from "react";
import { FlashLightContext } from "./context";

export function useFlashLightContext() {
  const context = useContext(FlashLightContext);
  if (!context) {
    throw new Error("useFlashLightContext must be used within a FlashLightProvider");
  }
  return context;
}
