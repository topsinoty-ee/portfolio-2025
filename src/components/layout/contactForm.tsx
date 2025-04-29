"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";
import { SectionHeader } from "../ui/sectionHeader";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
};

const fields: {
  name: keyof ContactFormValues;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel" | "textarea";
}[] = [
  { name: "name", label: "Full Name", placeholder: "John Doe" },
  { name: "email", label: "Email", placeholder: "john@example.com", type: "email" },
  { name: "message", label: "Message", placeholder: "Your message here...", type: "textarea" },
];

export const ContactForm = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(values);
      toast.success("Form submitted successfully!", {
        description: "We'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      toast.error("Something went wrong.", {
        description: `Please try again later. ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 justify-between h-full max-w-md w-full bg-card p-5 border-card rounded-2xl drop-shadow-accent drop-shadow-sm"
        >
          <SectionHeader type="info">Send me a message</SectionHeader>
          <div className="flex flex-col gap-3">
            {fields.map(({ name, label, placeholder, type = "text" }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormControl title={label}>
                      {type === "textarea" ? (
                        <Textarea placeholder={placeholder} {...field} />
                      ) : (
                        <Input placeholder={placeholder} type={type} {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <Button type="submit" className="w-full md:mt-5" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting..." : "Send Message"}
          </Button>
        </form>
      </Form>
      <Toaster />
    </>
  );
};
