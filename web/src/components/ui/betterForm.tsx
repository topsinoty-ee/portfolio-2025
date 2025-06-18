import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ControllerRenderProps, DefaultValues, FieldPath, FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type FormFieldType = "text" | "email" | "tel" | "textarea" | "select" | "multiselect";

export interface SelectOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface AsyncSelectConfig {
  fetchFn: (query: string) => Promise<SelectOption[]>;
  debounceMs?: number;
  minSearchChars?: number;
  initialOptions?: SelectOption[];
}

interface SmartSelectFieldConfig {
  mode: "static" | "async";
  staticOptions?: SelectOption[];
  asyncConfig?: AsyncSelectConfig;
  maxSelections?: number;
  allowCustomValues?: boolean;
  searchVisibilityThreshold?: number;
}

interface FormFieldConfig<FieldValuesType extends FieldValues> {
  name: FieldPath<FieldValuesType>;
  label?: string;
  placeholder?: string;
  type?: FormFieldType;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  selectConfig?: SmartSelectFieldConfig;
}

interface BetterFormCallbackUtils<FieldValuesType extends FieldValues> extends UseFormReturn<FieldValuesType> {
  toast: typeof toast;
}

interface BetterFormProps<FieldValuesType extends FieldValues> {
  formSchema: z.ZodSchema<FieldValuesType>;
  fields: readonly FormFieldConfig<FieldValuesType>[];
  onSubmit: (values: FieldValuesType) => Promise<void>;
  defaultValues?: DefaultValues<FieldValuesType>;
  submitButtonText?: string;
  className?: string;
  onSuccess?: (data: FieldValuesType, utils: BetterFormCallbackUtils<FieldValuesType>) => void;
  onError?: (error: unknown, utils: BetterFormCallbackUtils<FieldValuesType>) => void;
}

export function BetterForm<FieldValuesType extends FieldValues>({
  formSchema,
  fields,
  onSubmit,
  defaultValues,
  submitButtonText = "Submit",
  className = "",
  onSuccess,
  onError,
}: BetterFormProps<FieldValuesType>) {
  const form = useForm<FieldValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const callbackUtils: BetterFormCallbackUtils<FieldValuesType> = useMemo(
    () => ({
      ...form,
      toast,
    }),
    [form],
  );

  const handleSubmit = useCallback(
    async (data: FieldValuesType) => {
      try {
        await onSubmit(data);
        toast.success("Form submitted successfully!");
        onSuccess?.(data, callbackUtils);
      } catch (error) {
        toast.error("Failed to submit form. Please try again.");
        onError?.(error, callbackUtils);
      }
    },
    [onSubmit, onSuccess, onError, callbackUtils],
  );

  const renderField = useCallback(
    (
      fieldConfig: FormFieldConfig<FieldValuesType>,
      field: ControllerRenderProps<FieldValuesType, FieldPath<FieldValuesType>>,
    ) => {
      const commonProps = {
        disabled: fieldConfig.disabled || false,
        placeholder: fieldConfig.placeholder,
      };

      switch (fieldConfig.type) {
        case "textarea":
          return <Textarea {...commonProps} {...field} />;
        case "select":
        case "multiselect":
          if (!fieldConfig.selectConfig) {
            console.warn(`SmartSelect field "${String(fieldConfig.name)}" is missing selectConfig.`);
            return <Input type="text" {...commonProps} {...field} />;
          }
          return (
            <SmartSelect
              fieldType={fieldConfig.type}
              fieldConfig={fieldConfig}
              field={field}
              formInstance={form}
              {...commonProps}
            />
          );
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
                    {fieldConfig.label && (
                      <FormLabel>
                        {fieldConfig.label}
                        {fieldConfig.required && <span className="text-destructive ml-1">*</span>}
                      </FormLabel>
                    )}

                    <FormControl>{renderField(fieldConfig, field)}</FormControl>
                    {fieldConfig.description && <FormDescription>{fieldConfig.description}</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
            {form.formState.isSubmitting ? "Submitting..." : submitButtonText}
          </Button>
        </form>
      </Form>
      <Toaster />
    </>
  );
}

interface SmartSelectProps<FieldValuesType extends FieldValues> {
  fieldType: "select" | "multiselect";
  fieldConfig: FormFieldConfig<FieldValuesType>;
  field: ControllerRenderProps<FieldValuesType, FieldPath<FieldValuesType>>;
  formInstance: UseFormReturn<FieldValuesType>;
  disabled?: boolean;
  placeholder?: string;
}

function SmartSelect<FieldValuesType extends FieldValues>({
  fieldType,
  fieldConfig,
  field,
  disabled = false,
  placeholder,
}: SmartSelectProps<FieldValuesType>) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [cachedResults, setCachedResults] = useState<Map<string, SelectOption[]>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const selectSettings = fieldConfig.selectConfig;

  if (!selectSettings) {
    console.error(`SmartSelect field "${String(fieldConfig.name)}" is missing selectConfig.`);
    return null;
  }

  const {
    mode = "static",
    staticOptions = [],
    asyncConfig,
    maxSelections,
    allowCustomValues = false,
    searchVisibilityThreshold = 5,
  } = selectSettings;

  const isMultiselect = fieldType === "multiselect";

  const currentFieldValue = field.value;
  const selectedValues: string[] = isMultiselect ? (Array.isArray(currentFieldValue) ? currentFieldValue : []) : [];
  const singleValue: string = isMultiselect ? "" : "";

  const shouldShowSearch = useMemo(() => {
    if (mode === "async") return true;
    if (isMultiselect) return true;
    return staticOptions.length > searchVisibilityThreshold;
  }, [mode, isMultiselect, staticOptions.length, searchVisibilityThreshold]);

  useEffect(() => {
    if (mode === "static") {
      setSuggestions(staticOptions);
      return;
    }

    if (!asyncConfig || !asyncConfig.fetchFn) {
      console.warn(`SmartSelect in async mode but no fetchFn provided for field "${String(fieldConfig.name)}".`);
      setSuggestions([]);
      return;
    }

    const { fetchFn, debounceMs = 300, minSearchChars = 1, initialOptions = [] } = asyncConfig;

    if (!searchQuery) {
      setSuggestions(initialOptions);
      return;
    }

    if (searchQuery.length < minSearchChars) {
      setSuggestions([]);
      return;
    }

    if (cachedResults.has(searchQuery)) {
      setSuggestions(cachedResults.get(searchQuery)!);
      return;
    }

    const timer = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);

      try {
        const results = await fetchFn(searchQuery);
        if (!abortControllerRef.current.signal.aborted) {
          setSuggestions(results);
          setCachedResults((prev) => new Map(prev).set(searchQuery, results));
        }
      } catch (error) {
        if (!abortControllerRef.current.signal.aborted) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]);
        }
      } finally {
        if (!abortControllerRef.current.signal.aborted) {
          setLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchQuery, mode, asyncConfig, staticOptions, cachedResults, fieldConfig.name]);

  const allAvailableOptions = useMemo(() => {
    const combined = new Map<string, SelectOption>();
    staticOptions.forEach((option) => combined.set(option.value, option));
    suggestions.forEach((option) => combined.set(option.value, option));
    return Array.from(combined.values());
  }, [staticOptions, suggestions]);

  const filteredDisplayOptions = useMemo(() => {
    if (mode === "async") return suggestions;
    if (!shouldShowSearch || !searchQuery) return staticOptions;

    return staticOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [mode, suggestions, staticOptions, shouldShowSearch, searchQuery]);

  const handleSelect = useCallback(
    (value: string) => {
      if (isMultiselect) {
        const currentSelected = new Set(selectedValues);
        let newValues: string[];

        if (currentSelected.has(value)) {
          currentSelected.delete(value);
          newValues = Array.from(currentSelected);
        } else {
          if (maxSelections && selectedValues.length >= maxSelections) {
            toast.warning(`Maximum ${maxSelections} selections allowed.`);
            return;
          }
          currentSelected.add(value);
          newValues = Array.from(currentSelected);
        }
        field.onChange(newValues);
      } else {
        field.onChange(value);
        setOpen(false);
      }
    },
    [isMultiselect, selectedValues, maxSelections, field],
  );

  const handleAddCustomValue = useCallback(
    (customValue: string) => {
      if (!allowCustomValues || !isMultiselect) return;

      const trimmedValue = customValue.trim();
      if (!trimmedValue || selectedValues.includes(trimmedValue)) {
        setSearchQuery("");
        return;
      }

      if (maxSelections && selectedValues.length >= maxSelections) {
        toast.warning(`Maximum ${maxSelections} selections allowed.`);
        return;
      }

      const newValues = [...selectedValues, trimmedValue];
      field.onChange(newValues);
      setSearchQuery("");
    },
    [allowCustomValues, isMultiselect, selectedValues, maxSelections, field],
  );

  const handleRemove = useCallback(
    (valueToRemove: string) => {
      if (!isMultiselect) return;

      const newValues = selectedValues.filter((v) => v !== valueToRemove);
      field.onChange(newValues);
    },
    [isMultiselect, selectedValues, field],
  );

  const getDisplayValue = useCallback(() => {
    if (isMultiselect) return "";

    const option = allAvailableOptions.find((opt) => opt.value === singleValue);
    return option?.label || placeholder || "Select...";
  }, [isMultiselect, allAvailableOptions, singleValue, placeholder]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && allowCustomValues && isMultiselect && searchQuery.trim()) {
        e.preventDefault();
        handleAddCustomValue(searchQuery);
      }
      if (e.key === "Backspace" && isMultiselect && !searchQuery && selectedValues.length > 0) {
        e.preventDefault();
        handleRemove(selectedValues[selectedValues.length - 1]);
      }
    },
    [allowCustomValues, isMultiselect, searchQuery, selectedValues, handleAddCustomValue, handleRemove],
  );

  return (
    <div className="space-y-2">
      {isMultiselect && (
        <div className="flex flex-wrap gap-1 min-h-[40px] border rounded-md p-2">
          {selectedValues.length > 0 ? (
            <>
              {selectedValues.slice(0, selectedValues.length > 3 ? 2 : selectedValues.length).map((value) => {
                const option = allAvailableOptions.find((opt) => opt.value === value);
                return (
                  <Badge key={value} variant="secondary" className="flex items-center gap-1">
                    {option?.label || value} {}
                    <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => handleRemove(value)} />
                  </Badge>
                );
              })}
              {selectedValues.length > 3 && <Badge variant="outline">+{selectedValues.length - 2} more</Badge>}
            </>
          ) : (
            <span className="text-muted-foreground text-sm">{placeholder || "Add items..."}</span>
          )}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-full justify-between", !singleValue && !isMultiselect && "text-muted-foreground")}
            disabled={disabled}
          >
            {isMultiselect ? (
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {selectedValues.length > 0 ? `Add more (${selectedValues.length} selected)` : "Add items"}
              </span>
            ) : (
              getDisplayValue()
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            {shouldShowSearch && (
              <CommandInput
                placeholder="Search..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                onKeyDown={handleKeyDown}
              />
            )}
            <CommandList>
              {loading ? (
                <CommandEmpty>
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </CommandEmpty>
              ) : filteredDisplayOptions.length === 0 &&
                (!allowCustomValues || !isMultiselect || !searchQuery.trim()) ? (
                <CommandEmpty>No options found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  <ScrollArea className="max-h-48">
                    {filteredDisplayOptions.map((option) => (
                      <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            (isMultiselect ? selectedValues.includes(option.value) : singleValue === option.value)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                    {}
                    {allowCustomValues &&
                      isMultiselect &&
                      searchQuery.trim() &&
                      !allAvailableOptions.some((opt) => opt.value === searchQuery.trim()) && (
                        <CommandItem onSelect={() => handleAddCustomValue(searchQuery)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add "{searchQuery}"
                        </CommandItem>
                      )}
                  </ScrollArea>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
