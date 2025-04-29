import { SiGithub, SiMinutemailer } from "@icons-pack/react-simple-icons";
import { JSX, isValidElement } from "react";
import { FaLinkedin } from "react-icons/fa";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface Socials {
  [x: string]: [string, JSX.Element];
}

export const Socials = ({ withText }: { withText?: boolean }) => {
  const socials: Socials = {
    github: ["https://github.com/topsinoty-ee", <SiGithub />],
    email: [
      "mailto:oluwatobilobatemi05@gmail.com?subject=Reaching out to discuss important things ^_^&body=You can also reach out to say hi :)",
      <SiMinutemailer />,
    ],
    linkedIn: ["https://www.linkedin.com/in/promise-temitope/", <FaLinkedin />],
  };

  return (
    <div className="w-full h-full min-h-max flex flex-wrap gap-2.5">
      {Object.entries(socials).map(([social, [link, Icon]], idx) => (
        <div key={idx}>
          <Button variant={"outline"} asChild>
            <a href={link} title={social} target="_blank" rel="noreferrer noopener" className="flex gap-2">
              <span className={cn("capitalize", { hidden: !withText })}>{social}</span>
              {isValidElement(Icon) && Icon}
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
};
