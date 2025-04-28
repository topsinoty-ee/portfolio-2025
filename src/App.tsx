import { Hero } from "./components/layout/pageSections/hero";
import { Navbar } from "./components/layout/navbar";
import { MyProjects } from "./components/layout/pageSections/projects";
import { useFlashlight } from "./components/hooks/flashlight";

export default function App() {
  const { gradientPosition, scrollPosition } = useFlashlight();
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
      <main className="md:pt-15 pt-5 p-10 md:p-20 min-h-screen h-max flex flex-col md:gap-25 gap-10 scroll-smooth">
        <Hero />
        <MyProjects />
      </main>
    </>
  );
}
