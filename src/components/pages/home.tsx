import { Editor } from "@/components/core/editor";

export const HomeTab = () => {
  const code = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio Magic</title>
  <style>
    :root {
      --gradient: linear-gradient(45deg, #0a0a0a, #1a1a2e, #3d3d5b);
      --shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      --black: #0a0a0a;
      --text: #2d3436;
      --background: rgba(255, 255, 255, 0.8);
      --white: #f8f9fa;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      text-decoration: none;
    }

    body {
      font-family: 'Segoe UI', system-ui;
      background: var(--background);
      color: var(--text);
      line-height: 1.6;
    }

    .hero {
      padding: 3rem;
      background: var(--gradient);
      color: var(--white);
      text-align: center;
      box-shadow: var(--shadow);
      animation: popFade 1s ease-in-out;
    }

    .hero > * {
      margin: 0.5rem 0;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .card {
      background: var(--white);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: var(--shadow);
      transition: transform 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .social-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .socials {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: flex-end;
      padding: 1rem 0;
    }

    .socials .card {
      padding: 0.8rem 1.2rem;
      border-radius: 0.5rem;
      font-weight: 500;
    }

    form {
      display: grid;
      gap: 1.25rem;
    }

    input,
    textarea {
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      width: 100%;
      font-family: inherit;
    }

    .btn {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 50px;
      background: var(--gradient);
      color: var(--white);
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
    }

    .btn:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }

    footer {
      background: var(--black);
      color: var(--background);
      text-align: center;
      padding: 2rem;
    }

    .center {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .instructions {
      background: #696969;
      color: var(--background);
    }

    .badge {
      background: var(--gradient);
      color: var(--white);
      padding: 0.4rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      box-shadow: var(--shadow);
    }

    .tech-stack{
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .socials {
        flex-wrap: wrap;
        justify-content: flex-end;
      }
    }

    @keyframes popFade {
      0% {
        transform: scale(0.95);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  </style>
</head>
<body>
  <header class="hero">
    <h1>hey :]</h1>
    <p>I'm Promise</p>
    <small>Welcome to my portfolio</small>
  </header>

  <em class="instructions center">
    Use the sidebar or the tabs to navigate
  </em>

  <main class="card-grid">
    <div class="social-box">
      <h3>Contact me:</h3>
      <div class="socials">
        <a class="card" href="tel:+37254450982">(+372) 5445 0982</a>
        <a class="card" href="mailto:oluwatobilobatemi05@gmail.com">Mail &#x1f4e7;</a>
        <a class="card" href="https://github.com/topsinoty-ee">Github &#x1f431;</a>
      </div>
    </div>

    <article class="card">
      <h2>Latest Project &#x1f6a7;</h2>
      <p>
        <a href="https://flave.ee" target="_blank">Flave</a>, a recipe search engine
      </p>
    </article>

    <article class="card">
      <h2>I like making libraries</h2>
      <p>...you might find some lurking around 👀</p>
    </article>

    <article class="card tech-stack">
      <h2>My tech stack</h2>
      <ul style="display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none;">
        <li class="badge">React</li>
        <li class="badge">TypeScript</li>
        <li class="badge">TailwindCSS</li>
        <li class="badge">Bootstrap</li>
        <li class="badge">Next.js</li>
        <li class="badge">Angular</li>
        <li class="badge">Node.js</li>
      </ul>
    </article>

    <section class="card" style="display: flex; gap: 1.25rem; flex-direction: column">
      <h2>📬 Get in Touch</h2>
      <form>
        <input type="text" placeholder="Your name" />
        <textarea rows="4" placeholder="Message"></textarea>
        <button type="submit" class="btn">Send Message</button>
      </form>
    </section>
  </main>

  <footer>
    <p>@Topsinoty-ee 2025. Experimental take 🧪</p>
  </footer>
</body>
</html>`;

  const displayCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio Magic</title>
  <style>
    /**
     * Mystery style rules ¯\_(ツ)_/¯
    */
  </style>
</head>
<body>
  <header class="hero">
    <h1>hey :]</h1>
    <p>I'm Promise</p>
    <small>Welcome to my portfolio</small>
  </header>

  <em class="instructions center">
    Use the sidebar or the tabs to navigate
  </em>

  <main class="card-grid">
    <div class="social-box">
      <h3>Contact me:</h3>
      <div class="socials">
        <a class="card" href="tel:+37254450982">(+372) 5445 0982</a>
        <a class="card" href="mailto:oluwatobilobatemi05@gmail.com">Mail &#x1f4e7;</a>
        <a class="card" href="https://github.com/topsinoty-ee">Github &#x1f431;</a>
      </div>
    </div>

    <article class="card">
      <h2>Latest Project &#x1f6a7;</h2>
      <p>
        <a href="https://flave.ee" target="_blank">Flave</a>, a recipe search engine
      </p>
    </article>

    <article class="card">
      <h2>I like making libraries</h2>
      <p>...you might find some lurking around 👀</p>
    </article>

    <article class="card tech-stack">
      <h2>My tech stack</h2>
      <ul style="display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none;">
        <li class="badge">React</li>
        <li class="badge">TypeScript</li>
        <li class="badge">TailwindCSS</li>
        <li class="badge">Bootstrap</li>
        <li class="badge">Next.js</li>
        <li class="badge">Angular</li>
        <li class="badge">Node.js</li>
      </ul>
    </article>

    <section class="card" style="display: flex; gap: 1.25rem; flex-direction: column">
      <h2>📬 Get in Touch</h2>
      <form>
        <input type="text" placeholder="Your name" />
        <textarea rows="4" placeholder="Message"></textarea>
        <button type="submit" class="btn">Send Message</button>
      </form>
    </section>
  </main>

  <footer>
    <p>@Topsinoty-ee 2025. Experimental take 🧪</p>
  </footer>
</body>
</html>`;

  return (
    <section className={"w-full h-full overflow-scroll sm:overflow-hidden flex flex-col md:flex-row gap-5"}>
      <Editor
        language="html"
        className="h-max min-h-screen sm:min-h-auto order-2 sm:order-1"
        copyCode={code}
        code={displayCode}
      />
      <iframe
        className="w-full h-full min-h-full sm:min-h-auto border order-1 sm:order-2 rounded bg-white"
        srcDoc={code}
        title="Live HTML Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </section>
  );
};

HomeTab.displayName = "home.html";
