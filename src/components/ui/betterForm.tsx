"use client";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { FieldValues, UseFormReturn, Path } from "react-hook-form";

type FieldType = "text" | "email" | "tel" | "textarea";

interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder: string;
  type?: FieldType;
}

interface BetterFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fields: readonly FieldConfig<T>[];
  onSubmit: (values: T) => Promise<void>;
}

export function BetterForm<T extends FieldValues>({ form, fields, onSubmit }: BetterFormProps<T>) {
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md w-full">
          <div className="space-y-4">
            {fields.map(({ name, label, placeholder, type = "text" }) => (
              <FormField
                key={String(name)}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
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

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting..." : "Send Message"}
          </Button>
        </form>
      </Form>
      <Toaster />
    </>
  );
}
