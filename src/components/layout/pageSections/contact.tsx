import { SectionHeader } from "@/components/ui/sectionHeader";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "../contactForm";
import { Socials } from "@/components/ui/socials";

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
      <Socials withText />
    </div>
    <ContactForm />
  </section>
);
