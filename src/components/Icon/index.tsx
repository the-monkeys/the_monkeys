import { FC } from "react";
import * as RemixIcons from "@remixicon/react";

type IconProps = {
	title: string;
	name:
		| "RiToggleLine"
		| "RiToggleFill"
		| "RiNotification3Line"
		| "RiUserLine"
		| "RiPencilLine"
		| "RiSearch2Line"
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
		| "RiTwitterFill"
		| "RiGoogleFill";
	size?: number;
	color: string;
	onClick?: () => void;
};

const Icon: FC<IconProps> = ({ title, name, size, color, onClick }) => {
	const DynamicIcon = RemixIcons[name];

	return (
		<div className="flex items-center justify-center">
			<DynamicIcon
				className="cursor-pointer hover:opacity-80"
				size={size || 24}
				color={color || "#ff462e"}
				onClick={onClick}
			/>
		</div>
	);
};

export default Icon;
