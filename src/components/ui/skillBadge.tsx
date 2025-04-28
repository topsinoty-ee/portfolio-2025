import { ComponentProps } from "react";
import { Badge } from "./badge";

export type TypeofBadge = ComponentProps<typeof Badge>;

interface SkillBadgeProps extends Omit<TypeofBadge, "variant"> {
  variant: "core" | "tools" | "others";
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ variant = "tools", ...props }) => {
  const variantMap: Record<SkillBadgeProps["variant"], TypeofBadge["variant"]> = {
    core: "default",
    tools: "secondary",
    others: "outline",
  };

  return <Badge variant={variantMap[variant]} {...props} />;
};

export const SkillBadgeList = ({
  skills,
  ...divProps
}: { skills: { core?: string[]; tools?: string[]; others?: string[] } } & React.ComponentProps<"div">) => {
  return (
    <div className="flex flex-wrap gap-4" {...divProps}>
      {(skills.core?.length ?? 0) > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Core Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {skills.core?.map((skill, index) => (
              <SkillBadge variant="core" key={index}>
                {skill}
              </SkillBadge>
            ))}
          </div>
        </div>
      )}

      {(skills.tools?.length ?? 0) > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Key Tools</h3>
          <div className="flex flex-wrap gap-2">
            {skills.tools?.map((skill, index) => (
              <SkillBadge variant="tools" key={index}>
                {skill}
              </SkillBadge>
            ))}
          </div>
        </div>
      )}

      {(skills.others?.length ?? 0) > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Also Work With</h3>
          <div className="flex flex-wrap gap-2">
            {skills.others?.map((skill, index) => (
              <SkillBadge variant="others" key={index}>
                {skill}
              </SkillBadge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
