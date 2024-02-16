import Icon, { IconName } from "../icon/index";

type CircularButtonProps = {
  iconName: IconName;
  title?: string;
  animate?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const CircularButton: React.FC<CircularButtonProps> = ({
  iconName = "RiPencilLine",
  title,
  animate,
  disabled,
  onClick,
}) => {
  return (
    <div
      className="group w-8 h-8 cur rounded-full flex items-center justify-center bg-primary-monkeyOrange cursor-pointer transition-all"
      onClick={onClick}
    >
      <div className={`${animate ? "group-hover:animate-shake" : ""}`}>
        <Icon
          name={iconName}
          size={18}
          customColor={true}
          color="#FFF4ed"
          hasHover={false}
        />
      </div>
    </div>
  );
};

export default CircularButton;
