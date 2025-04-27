import { useMouseHook } from "./components/hooks/mouse";
import { Hero } from "./components/layout/hero";
import { Navbar } from "./components/layout/navbar";

export default function App() {
  const { gradientPosition, scrollPosition } = useMouseHook();
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          backgroundImage: gradientPosition(),
          opacity: Math.max(0, 1 - scrollPosition / 500),
        }}
      />
      <Navbar />
      <main className="pt-15 p-20 min-h-screen h-max">
        <Hero />
      </main>
    </>
  );
}
