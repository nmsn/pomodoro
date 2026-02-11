import { cn } from "@/lib/utils";

const Button = ({
  children,
  onClick,
  className = "text-blue-400",
  size = "normal",
  type = "inverse",
}: {
  children: string;
  onClick?: () => void;
  className?: string;
  size?: "normal" | "small";
  type?: "positive" | "inverse";
}) => {
  return (
    <button
      className={cn(
        "btn",
        size === "small" && "btn-small",
        size === "normal" && "btn-normal",
        type === "positive" && "btn-positive",
        type === "inverse" && "btn-inverse",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
