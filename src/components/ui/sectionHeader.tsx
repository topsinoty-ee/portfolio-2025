import { cn } from "@/lib/utils";

interface SectionHeaderProps extends React.ComponentProps<"h1"> {
  type?: "primary" | "secondary" | "info";
  size?: "sm" | "md" | "lg";
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ type = "primary", size = "md", className, ...props }) => {
  const Tag = size === "lg" ? "h1" : size === "sm" ? "h4" : "h2";

  return (
    <Tag
      {...props}
      className={cn(
        "font-bold tracking-tight",
        {
          "text-primary": type === "primary",
          "text-secondary": type === "secondary",
          "text-accent": type === "info",
          "text-4xl leading-snug md:text-6xl md:leading-relaxed": size === "lg",
          "text-2xl md:text-3xl": size === "md",
          "text-lg md:text-xl": size === "sm",
        },
        className
      )}
    />
  );
};
