import Icon, { IconName } from "../icon";

import CircularButton from "./CircularButton";

type ButtonVariants =
  | "primary"
  | "secondary"
  | "alert"
  | "ghost"
  | "shallow"
  | "circular";

export type ButtonProps = {
  title: string;
  variant: ButtonVariants;
  // Left aligned icon
  startIcon?: boolean;
  // Right aligned icon
  endIcon?: boolean;
  iconName?: IconName;
  disabled?: boolean;
  animate?: boolean;
  flex?: boolean;
  // Tool tip: In case the icon is not present or it's size is set to small
  toolTip?: boolean;
  toolTipSide?: "top" | "right" | "bottom" | "left";
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  title,
  variant,
  startIcon,
  endIcon,
  iconName = "RiAlertLine",
  disabled = false,
  animate = false,
  flex,
  toolTip,
  toolTipSide,
  onClick,
}) => {
  const baseStyles =
    "px-6 py-2 rounded-md hover:scale-90 cursor-pointer transition-all";
  const primaryStyles = "bg-primary-monkeyOrange text-primary-monkeyWhite";
  const secondaryStyes = "bg-secondary-darkGrey text-secondary-white";
  const alertStyles = "bg-alert-red text-secondary-white";
  const shallowStyles =
    "text-secondary-darkGrey dark:text-secondary-white bg-secondary-darkGrey/0 dark:bg-secondary-white/0 hover:bg-secondary-darkGrey dark:hover:bg-secondary-white/100 hover:bg-opcaity-100 hover:text-secondary-white dark:hover:text-secondary-darkGrey border-[1px] border-secondary-darkGrey dark:border-secondary-white";
  const ghostStyles =
    "text-primary-monkeyBlack dark:text-primary-monkeyWhite hover:bg-primary-monkeyBlack dark:hover:bg-primary-monkeyWhite hover:text-primary-monkeyWhite dark:hover:text-primary-monkeyBlack";

  const getStyles = () => {
    switch (variant) {
      case "primary":
        return `${baseStyles} ${primaryStyles}`;
      case "secondary":
        return `${baseStyles} ${secondaryStyes}`;
      case "alert":
        return `${baseStyles} ${alertStyles}`;
      case "ghost":
        return `${baseStyles} ${ghostStyles}`;
      case "shallow":
        return `${baseStyles} ${shallowStyles}`;
    }
  };

  if (variant === "circular") {
    return (
      <CircularButton animate={animate} iconName={iconName} onClick={onClick} />
    );
  }

  return (
    <div className={`${getStyles()}`} onClick={onClick}>
      <div className="flex gap-4 justify-between items-center">
        {startIcon && <Icon name={iconName} size={20} hasHover={false} />}
        <p className="font-jost">{title}</p>
        {endIcon && <Icon name={iconName} size={20} hasHover={false} />}
      </div>
    </div>
  );
};

export default Button;
