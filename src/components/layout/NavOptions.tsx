import ThemeSwitch from "@/components/basic/ThemeSwitch";
import Icon from "@/components/icon";

const NavbarOptions = () => {
	return (
		<div className="flex items-center gap-2 sm:gap-5 ">
			<Icon name="RiNotification3Line" />
			<ThemeSwitch />
			<Icon name="RiUser3Line" />
		</div>
	);
};

export default NavbarOptions;
