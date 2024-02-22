import ThemeSwitch from "@/components/basic/ThemeSwitch";
import Icon from "@/components/icon";
import Logo from "@/components/logo";
import CreateButton from "./CreateButton";

const MobileNav = () => {
	return (
		<>
			<div className="sticky top-0 left-0 px-5 py-2 w-full flex gap-5 justify-between items-center bg-primary-monkeyWhite/75 dark:bg-primary-monkeyBlack/75 backdrop-blur-md">
				<Logo showMobileLogo={true} />

				<CreateButton />
			</div>

			<div className="fixed bottom-0 left-0 px-5 py-4 w-full flex justify-evenly items-center bg-primary-monkeyWhite/50 dark:bg-primary-monkeyBlack/50 backdrop-blur-sm border-t-1 border-secondary-lightGrey/25">
				<Icon name="RiBookmarkLine" />
				<ThemeSwitch />
				<Icon name="RiNotification3Line" />
				<Icon name="RiUser3Line" />
			</div>
		</>
	);
};

export default MobileNav;
