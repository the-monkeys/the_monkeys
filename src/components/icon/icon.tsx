// Remix Icons: https://remixicon.com/
// Github: https://github.com/Remix-Design/RemixIcon

import * as RemixIcons from "@remixicon/react";

export type IconName =
	| "RiToggleLine"
	| "RiToggleFill"
	| "RiNotification3Line"
	| "RiUser3Line"
	| "RiPencilLine"
	| "RiSearchLine"
	| "RiBookmarkLine"
	| "RiArrowRightUpLine"
	| "RiMoreLine"
	| "RiCloseLine"
	| "RiAddLine"
	| "RiMailFill"
	| "RiShareForwardFill"
	| "RiShareForwardLine"
	| "RiEyeLine"
	| "RiEyeFill"
	| "RiCake2Fill"
	| "RiGithubFill"
	| "RiTwitterXFill"
	| "RiDiscordFill"
	| "RiGoogleFill"
	| "RiAlertLine"
	| "RiErrorWarningLine";

export type IconProps = {
	name: IconName;
	size?: number;
	hasHover?: boolean;
	customColor?: boolean;
	color?: string;
	toolTip?: boolean;
	toolTipSide?: "top" | "right" | "bottom" | "left";
	onClick?: () => void;
};

const Icon: React.FC<IconProps> = ({
	name,
	size = 24,
	hasHover = true,
	customColor,
	color,
	toolTip,
	toolTipSide,
	onClick,
}) => {
	const DynamicIcon = RemixIcons[name];

	return (
		<div className="flex items-center justify-center">
			{customColor ? (
				<DynamicIcon
					className={`${hasHover && "hover:opacity-80"}`}
					size={size}
					onClick={onClick}
					color={color}
				/>
			) : (
				<>
					<DynamicIcon
						className={`cursor-pointer ${
							hasHover && "hover:opacity-80"
						} dark:hidden`}
						size={size}
						onClick={onClick}
					/>
					<DynamicIcon
						className={`cursor-pointer ${
							hasHover && "hover:opacity-80"
						} dark:block hidden`}
						size={size}
						onClick={onClick}
					/>
				</>
			)}
		</div>
	);
};

export default Icon;
