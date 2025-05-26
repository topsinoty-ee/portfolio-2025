import { Button } from "../ui/button";
import { NowPlaying } from "../ui/nowPlaying";

const data = {
  currentAffairs: [
    "Building Wefy (standardization)",
    "Working on Flave (group project)",
    "Playing w/ SvelteKit & Java",
  ],
  stackBias: ["React + TypeScript + TailwindCSS", "Next.js App Router", "pnpm + shadcn/ui + custom tooling"],
  timeline: {
    availability: "Available: After Exams",
    contact: {
      email: "oluwatobilobatemi05",
      phone: "(+372) 5445 0982",
    },
  },
};

export const DataCard = () => {
  const copyProfileToClipboard = () => {
    navigator.clipboard.writeText(
      `🧠 Promise - Frontend Dev + Tooling Architect\n` +
        `🌍 Tallinn, Estonia | Remote-ready\n\n` +
        `💻 React (TS) • Next.js 15 • TailwindCSS\n` +
        `📫 ${data.timeline.contact.email} | github: @topsinoty-ee | topsinoty.vercel.app`,
    );
  };

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden font-jets font-light">
      <div className="flex items-center justify-between w-full border-b border-accent/50 h-10">
        <div className="flex items-center gap-2 px-4">
          {["destructive", "secondary", "primary"].map((color) => (
            <div key={color} className={`size-3 rounded-full bg-${color}`} />
          ))}
        </div>
        <Button
          variant="ghost"
          onClick={copyProfileToClipboard}
          className="hover:bg-muted/20 rounded-none rounded-tr-2xl text-xs px-4"
        >
          📋 Copy My Details
        </Button>
      </div>

      <div className="flex flex-col gap-2 grow text-sm">
        <div className="bg-muted/10 p-4  flex flex-col gap-1">
          <span className="text-primary font-medium">🚧 Current Affairs</span>
          {data.currentAffairs.map((item, idx) => (
            <span key={idx}>- {item}</span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="bg-muted/10 p-4 sm:rounded-l-lg flex flex-col gap-1">
            <span className="text-primary font-medium">🛠️ Stack Bias</span>
            {data.stackBias.map((item, idx) => (
              <span key={idx}>- {item}</span>
            ))}
          </div>

          <div className="bg-muted/10 p-4 sm:rounded-r-lg flex flex-col gap-1">
            <span className="text-primary font-medium">📅 Timeline</span>
            <span>{data.timeline.availability}</span>
            <div className="mt-1 flex flex-col gap-0.5 *:[&_a:hover]:text-secondary">
              <span className="text-primary font-medium">📫 Contact</span>
              <a href={`mailto:${data.timeline.contact.email}@gmail.com`} className="text-accent">
                {data.timeline.contact.email}
              </a>
              <a href={`tel:${data.timeline.contact.phone.replace(/\s/g, "")}`} className="text-accent">
                {data.timeline.contact.phone}
              </a>
            </div>
          </div>
        </div>

        <NowPlaying />
      </div>
    </div>
  );
};
