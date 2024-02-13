import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "alert";
  bgColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  bgColor,
  ...rest
}) => {
  const getColor = (colorKey: string): string => {
    return `var(--${variant}.${colorKey})`;
  };

  return (
    <button
      className={`bg-${getColor("monkeyOrange")} hover:bg-${getColor(
        "monkeyBlack"
      )} text-${getColor("monkeyWhite")} 
                  ${
                    variant === "secondary"
                      ? "border border-solid border-lightGray"
                      : ""
                  } 
                  py-2 px-4 rounded`}
      style={{ backgroundColor: bgColor }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
