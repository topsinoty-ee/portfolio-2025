import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  ControllerRenderProps,
  DefaultValues,
  FieldPath,
  FieldPathValue,
  FieldValues,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type FieldType = "text" | "email" | "tel" | "textarea" | "autosuggest" | "select" | "multiselect" | "tags";

interface Option {
  value: string;
  label: string;
}

interface AsyncSuggestionsConfig {
  fetchFn: (query: string) => Promise<Option[]>;
  debounce?: number;
  minChars?: number;
}

interface FieldConfig<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: FieldType;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  options?: Option[] | AsyncSuggestionsConfig;
  className?: string;
  maxTags?: number;
}

interface BetterFormContext<T extends FieldValues> extends UseFormReturn<T> {
  toast: typeof toast;
}

interface BetterFormProps<T extends FieldValues> {
  formSchema: z.ZodSchema<T>;
  fields: readonly FieldConfig<T>[];
  onSubmit: (values: T) => Promise<void>;
  defaultValues?: DefaultValues<T>;
  submitText?: string;
  className?: string;
  onSuccess?: (data: T, context: BetterFormContext<T>) => void;
  onError?: (error: unknown, context: BetterFormContext<T>) => void;
}

export function BetterForm<T extends FieldValues>({
  formSchema,
  fields,
  onSubmit,
  defaultValues,
  submitText = "Submit",
  className = "",
  onSuccess,
  onError,
}: BetterFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const context: BetterFormContext<T> = useMemo(
    () => ({
      ...form,
      toast,
    }),
    [form],
  );

  const handleSubmit = useCallback(
    async (data: T) => {
      try {
        toast.promise(onSubmit(data), {
          loading: "Submitting form...",
          success: "Form submitted successfully!",
          error: "Failed to submit form. Please try again.",
        });
        onSuccess?.(data, context);
      } catch (error) {
        onError?.(error, context);
        throw error;
      }
    },
    [onSubmit, onSuccess, onError, context],
  );

  const renderField = useCallback(
    (fieldConfig: FieldConfig<T>, field: ControllerRenderProps<T, FieldPath<T>>) => {
      const commonProps = {
        disabled: fieldConfig.disabled || false,
        placeholder: fieldConfig.placeholder,
      };

      switch (fieldConfig.type) {
        case "textarea":
          return <Textarea {...commonProps} {...field} />;

        case "autosuggest":
          return <AsyncAutosuggest fieldConfig={fieldConfig} field={field} form={form} />;

        case "select":
          return (
            <Select value={field.value} onValueChange={field.onChange} disabled={commonProps.disabled}>
              <SelectTrigger>
                <SelectValue placeholder={commonProps.placeholder || "Select an option..."} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(fieldConfig.options) &&
                  fieldConfig.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          );

        case "multiselect":
          return <MultiSelectInput fieldConfig={fieldConfig} field={field} form={form} />;

        case "tags":
          return <TagsInput fieldConfig={fieldConfig} field={field} form={form} />;

        default:
          return <Input type={fieldConfig.type || "text"} {...commonProps} {...field} />;
      }
    },
    [form],
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-6", className)}>
          <div className="space-y-4">
            {fields.map((fieldConfig) => (
              <FormField
                key={String(fieldConfig.name)}
                control={form.control}
                name={fieldConfig.name}
                render={({ field }) => (
                  <FormItem className={fieldConfig.className}>
                    <FormLabel>
                      {fieldConfig.label}
                      {fieldConfig.required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>{renderField(fieldConfig, field)}</FormControl>
                    {fieldConfig.description && <FormDescription>{fieldConfig.description}</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
            {form.formState.isSubmitting ? "Submitting..." : submitText}
          </Button>
        </form>
      </Form>
      <Toaster />
    </>
  );
}

interface AsyncAutosuggestProps<T extends FieldValues> {
  fieldConfig: FieldConfig<T>;
  field: ControllerRenderProps<T, FieldPath<T>>;
  form: UseFormReturn<T>;
}

function AsyncAutosuggest<T extends FieldValues>({ fieldConfig, field, form }: AsyncAutosuggestProps<T>) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const asyncConfig = useMemo(() => {
    if (!fieldConfig.options || Array.isArray(fieldConfig.options)) return null;
    return fieldConfig.options;
  }, [fieldConfig.options]);

  useEffect(() => {
    if (!asyncConfig) return;

    const { fetchFn, debounce = 300, minChars = 1 } = asyncConfig;

    if (searchQuery.length < minChars) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchFn(searchQuery);
        setSuggestions(results);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounce);

    return () => clearTimeout(timer);
  }, [searchQuery, asyncConfig]);

  const currentValue = field.value as string;
  const allOptions = Array.isArray(fieldConfig.options) ? fieldConfig.options : suggestions;
  const displayValue = currentValue
    ? allOptions.find((option) => option.value === currentValue)?.label
    : fieldConfig.placeholder || "Select an option...";

  const handleSelect = useCallback(
    (value: string) => {
      form.setValue(fieldConfig.name, value as FieldPathValue<T, FieldPath<T>>);
      setOpen(false);
    },
    [form, fieldConfig.name],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("w-full justify-between", !currentValue && "text-muted-foreground")}
          disabled={fieldConfig.disabled}
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : suggestions.length === 0 ? (
              <CommandEmpty>No options found</CommandEmpty>
            ) : (
              <CommandGroup>
                <ScrollArea className="max-h-48">
                  {suggestions.map((option) => (
                    <CommandItem value={option.value} key={option.value} onSelect={() => handleSelect(option.value)}>
                      <Check
                        className={cn("mr-2 h-4 w-4", option.value === currentValue ? "opacity-100" : "opacity-0")}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface MultiSelectInputProps<T extends FieldValues> {
  fieldConfig: FieldConfig<T>;
  field: ControllerRenderProps<T, FieldPath<T>>;
  form: UseFormReturn<T>;
}

function MultiSelectInput<T extends FieldValues>({ fieldConfig, field, form }: MultiSelectInputProps<T>) {
  const [open, setOpen] = useState(false);
  const selectedValues = (field.value as string[]) || [];
  const options = Array.isArray(fieldConfig.options) ? fieldConfig.options : [];

  const toggleValue = useCallback(
    (value: string) => {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      form.setValue(fieldConfig.name, newValues as FieldPathValue<T, FieldPath<T>>);
    },
    [selectedValues, form, fieldConfig.name],
  );

  const removeValue = useCallback(
    (value: string) => {
      const newValues = selectedValues.filter((v) => v !== value);
      form.setValue(fieldConfig.name, newValues as FieldPathValue<T, FieldPath<T>>);
    },
    [selectedValues, form, fieldConfig.name],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 min-h-[40px] border rounded-md p-2">
        {selectedValues.length > 0 ? (
          selectedValues.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <Badge key={value} variant="secondary" className="flex items-center gap-1">
                {option?.label || value}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeValue(value)} />
              </Badge>
            );
          })
        ) : (
          <span className="text-muted-foreground text-sm">{fieldConfig.placeholder || "Select options..."}</span>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start" disabled={fieldConfig.disabled}>
            <Plus className="mr-2 h-4 w-4" />
            Add options
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="max-h-48">
                {options.map((option) => (
                  <CommandItem key={option.value} onSelect={() => toggleValue(option.value)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.value) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface TagsInputProps<T extends FieldValues> {
  fieldConfig: FieldConfig<T>;
  field: ControllerRenderProps<T, FieldPath<T>>;
  form: UseFormReturn<T>;
}

function TagsInput<T extends FieldValues>({ fieldConfig, field, form }: TagsInputProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const tags = (field.value as string[]) || [];

  const addTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();
      if (!trimmedTag || tags.includes(trimmedTag)) return;

      if (fieldConfig.maxTags && tags.length >= fieldConfig.maxTags) {
        toast.warning(`Maximum ${fieldConfig.maxTags} tags allowed`);
        return;
      }

      form.setValue(fieldConfig.name, [...tags, trimmedTag] as FieldPathValue<T, FieldPath<T>>);
      setInputValue("");
    },
    [tags, fieldConfig.maxTags, fieldConfig.name, form],
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      form.setValue(fieldConfig.name, tags.filter((tag) => tag !== tagToRemove) as FieldPathValue<T, FieldPath<T>>);
    },
    [tags, form, fieldConfig.name],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag(inputValue);
      }
    },
    [inputValue, addTag],
  );

  const isDisabled = fieldConfig.disabled || (fieldConfig.maxTags ? tags.length >= fieldConfig.maxTags : false);
  const canAddTag = inputValue.trim() && !isDisabled;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 min-h-[40px] border rounded-md p-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">{fieldConfig.placeholder || "Add tags..."}</span>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={fieldConfig.placeholder || "Add tag..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
        <Button type="button" variant="outline" size="default" onClick={() => addTag(inputValue)} disabled={!canAddTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
