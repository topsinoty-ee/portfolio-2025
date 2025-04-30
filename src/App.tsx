import { AboutMe, ContactMe, Hero, MyProjects } from "./components/layout/pageSections";
import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import { useFlashlight } from "./hooks/flashlight";

export default function App() {
  const { gradientPosition, scrollPosition } = useFlashlight();
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          backgroundImage: gradientPosition(),
          opacity: Math.max(0, 1 - scrollPosition / (window.visualViewport?.height || 500)),
        }}
      />
      <Navbar />
      <main className="md:pt-15 pt-5 relative bg-background p-10 md:p-20 min-h-screen h-max flex flex-col md:gap-25 gap-10 scroll-smooth">
        <Hero />
        <MyProjects />
        <AboutMe />
        <ContactMe />
      </main>
      <Footer />
    </>
  );
}
