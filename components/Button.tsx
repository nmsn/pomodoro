import classnames from "classnames";

const Button = ({
  children,
  onClick,
  className = 'text-blue-400',
}: {
  children: string;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      className={classnames(
        "btn",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
