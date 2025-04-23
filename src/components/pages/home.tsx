import { Editor } from "@/components/core/editor";

export const HomeTab = () => {
  const code = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Welcome to My Page</title>

    <!-- Styles -->
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        padding: 2rem;
        background-color: #f9fafb;
        color: #111827;
      }
      header {
        margin-bottom: 2rem;
      }
      nav a {
        margin-right: 1rem;
        text-decoration: none;
        color: #2563eb;
      }
      footer {
        margin-top: 3rem;
        font-size: 0.875rem;
        color: #6b7280;
      }
    </style>
  </head>

  <body>
    <header>
      <h1>Hi, World!</h1>
      <p>This is a small project to display my skills...also my portfolio :p</p>
    </header>

    <!-- Navigation -->
    <nav>
      <a href="#about">About</a>
      <a href="#projects">Projects</a>
      <a href="#contact">Contact</a>
    </nav>

    <!-- Main Content -->
    <main>
      <section id="about">
        <h2>About Me</h2>
        <p>
          I'm a web enthusiast exploring the building blocks of the web: HTML, CSS, and JavaScript!
        </p>
      </section>

      <section id="projects">
        <h2>My Projects</h2>
        <ul>
          <li>🌐 Personal Portfolio</li>
          <li>📱 Responsive Layout Demo</li>
          <li>🎨 Tailwind CSS Playground</li>
        </ul>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <form>
          <label for="name">Name:</label><br />
          <input type="text" id="name" name="name" /><br /><br />

          <label for="message">Message:</label><br />
          <textarea id="message" name="message" rows="4"></textarea><br /><br />

          <button type="submit">Send</button>
        </form>
      </section>
    </main>

    <!-- Footer -->
    <footer>
      <p>&copy; 2025 My First HTML Page</p>
    </footer>
  </body>
</html>`;
  return (
    <section className={"w-full h-full flex gap-5"}>
      <Editor language="html" className="h-max" initialCode={code} />
      <iframe
        className="w-full h-[80vh] border rounded bg-white"
        srcDoc={code}
        title="Live HTML Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </section>
  );
};

HomeTab.displayName = "home.html";
