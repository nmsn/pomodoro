import classnames from "classnames";

const Button = ({
  children,
  onClick,
  className,
}: {
  children: string;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      className={classnames(
        "w-32 p-2 rounded-lg font-bold bg-black text-blue-400 shadow-md select-none",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
