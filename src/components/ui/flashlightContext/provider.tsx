import { ReactNode, useState } from "react";
import { FlashLightContext } from "./context";

export function FlashLightProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  const toggle = () => setEnabled((prev) => !prev);

  return <FlashLightContext.Provider value={{ enabled, toggle }}>{children}</FlashLightContext.Provider>;
}
