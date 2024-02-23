import Button from "@/components/button";
import React from "react";

const CreateButton = () => {
	return (
		<div className="flex flex-col items-center">
			<Button
				title="Create"
				variant="circular"
				iconName="RiPencilLine"
				animateIcon
			/>
			<p className="hidden sm:block font-playfair_Display font-medium">
				Create
			</p>
		</div>
	);
};

export default CreateButton;
