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
		| "RiGithubFill"
		| "RiTwitterFill";
	size?: number;
	color: string;
	onClick?: () => void;
};

const Icon: FC<IconProps> = (props) => {
	const DynamicIcon = RemixIcons[props.name];

	return (
		<div className="flex items-center justify-center">
			<DynamicIcon
				className="cursor-pointer hover:opacity-80"
				size={props?.size || 24}
				color={props?.color || "#ff462e"}
				onClick={props.onClick}
			/>
		</div>
	);
};

export default Icon;
