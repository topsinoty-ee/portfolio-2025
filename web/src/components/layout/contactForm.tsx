"use client";
import { z } from "zod";
import { BetterForm } from "@/components/ui/betterForm.tsx";
import { toast } from "sonner";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export const ContactForm = () => {
  const handleSubmit = async (values: any) => {
    try {
      console.log("Form submitted with values:", values);
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again later.");
      return Promise.reject(error);
    }
  };

  return (
    <BetterForm
      className="flex flex-col gap-5 justify-between h-full max-w-md w-full bg-card p-5 border-card rounded-2xl drop-shadow-accent drop-shadow-sm"
      formSchema={contactFormSchema}
      fields={[
        { name: "name", placeholder: "John Doe", required: true },
        { name: "email", placeholder: "mail@example.com", required: true },
        {
          name: "message",
          placeholder: "Your message here...",
          description: "Just a message or smth small",
          type: "textarea",
          required: true,
        },
      ]}
      defaultValues={{
        name: "",
        email: "",
        message: "",
      }}
      onSubmit={handleSubmit}
      onSuccess={(_, { reset }) => reset()}
    />
  );
};
