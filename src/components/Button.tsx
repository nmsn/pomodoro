import classnames from 'classnames';

const Button = ({
  children,
  onClick,
  className = 'text-blue-400',
  size = 'normal',
  type = 'inverse',
}: {
  children: string;
  onClick?: () => void;
  className?: string;
  size?: 'normal' | 'small';
  type?: 'positive' | 'inverse';
}) => {
  return (
    <button
      // className={classnames(size === "small" ? "btn-small" : "btn", className)}
      className={classnames(
        {
          'btn-small': size === 'small',
          'btn-normal': size === 'normal',
          'btn-positive': type === 'positive',
          'btn-inverse': type === 'inverse',
          btn: true,
        },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
