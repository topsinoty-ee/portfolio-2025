import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import { useFlashlight } from "./hooks/flashlight";
import { IndexPage } from "@/pages/index.tsx";
import { LoginPage } from "./pages/login.tsx";
import { Route, Switch, useLocation } from "wouter";
import { ProjectsPage } from "@/pages/projects";
import { ProjectPage } from "@/pages/projects/detail.tsx";
import { EditProjectPage } from "@/pages/projects/edit.tsx";
import { useEffect } from "react";

export default function App() {
  const { gradientPosition, scrollPosition } = useFlashlight();

  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          backgroundImage: gradientPosition(),
          opacity: Math.max(0, 1 - scrollPosition / ((window.visualViewport?.height || 500) * 2)),
        }}
      />
      <Navbar />
      <main className="md:pt-10 pt-5 relative bg-background p-10 md:p-20 min-h-screen h-max flex flex-col md:gap-25 gap-10 scroll-smooth">
        <Switch>
          <Route path="/" component={IndexPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/projects/:id" component={ProjectPage} />
          <Route path="/projects/edit/:id" component={EditProjectPage} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}
