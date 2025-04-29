import { SectionHeader } from "@/components/ui/sectionHeader";
import { Badge } from "@/components/ui/badge";
import { SiGithub, SiMinutemailer } from "@icons-pack/react-simple-icons";
import { Button } from "@/components/ui/button";
import { isValidElement, JSX } from "react";
import { FaLinkedin } from "react-icons/fa";
import { ContactForm } from "../contactForm";
import { getAccessToken } from "@/lib/spotify";

interface Socials {
  [x: string]: [string, JSX.Element];
}
const socials: Socials = {
  github: ["https://github.com/topsinoty-ee", <SiGithub />],
  email: [
    "mailto:oluwatobilobatemi05@gmail.com?subject=Reaching out to discuss important things ^_^&body=You can also reach out to say hi :)",
    <SiMinutemailer />,
  ],
  linkedIn: ["https://www.linkedin.com/in/promise-temitope/", <FaLinkedin />],
};

console.log("test");
console.log(getAccessToken());

export const ContactMe = () => (
  <section id="contactMe" className="w-full flex items-start flex-col md:flex-row gap-15 md:gap-20 h-full min-h-max">
    <div className="w-full flex flex-col gap-10">
      <div className="w-full flex flex-col gap-5">
        <Badge variant={"secondary"}>Contact me!</Badge>
        <div>
          <SectionHeader type="secondary">Get in touch</SectionHeader>
          <p className="font-light text-sm md:text-lg text-muted-foreground">I&apos;m almost always online</p>
        </div>
      </div>
      <div className="w-full h-full min-h-max flex flex-wrap gap-2.5">
        {Object.entries(socials).map(([social, [link, Icon]], idx) => (
          <div key={idx}>
            <Button variant={"outline"} asChild>
              <a href={link} title={social} target="_blank" rel="noreferrer noopener" className="flex gap-2">
                <span className="capitalize">{social}</span>
                {isValidElement(Icon) && Icon}
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
    <ContactForm />
  </section>
);
