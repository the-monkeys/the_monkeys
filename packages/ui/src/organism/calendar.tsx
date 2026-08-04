"use client";

import type * as React from "react";

import { DayPicker, type DropdownProps } from "@daypicker/react";
import { buttonVariants } from "../atoms/button";
import { ScrollArea } from "../atoms/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../atoms/select";
import { AngleLeft, AngleRight } from "../icons";
import { cn } from "../utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				"px-4 py-2 bg-background-light dark:bg-background-dark border border-foreground-light dark:border-foreground-dark rounded-md shadow-md",
				className,
			)}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4",
				month_caption: "flex justify-center pt-1 relative items-center",
				caption_label: "text-sm font-medium",
				dropdowns: "flex justify-center gap-1",
				nav: "space-x-1 flex items-center",
				button_previous: cn(
					buttonVariants({ variant: "outline" }),
					"size-8 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1",
				),
				button_next: cn(
					buttonVariants({ variant: "outline" }),
					"size-8 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1",
				),
				month_grid: "w-full border-collapse space-y-1",
				weekdays: "flex space-x-1",
				weekday:
					"font-dm_sans text-text-light/80 dark:text-text-dark/80 rounded-md w-9 font-normal text-sm",
				week: "flex w-full mt-2 space-x-1",
				day: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
				day_button: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0"),
				selected:
					"bg-foreground-light dark:bg-foreground-dark hover:bg-primary",
				today: "bg-accent text-accent-foreground",
				outside: "opacity-50",
				disabled: "opacity-50",
				range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				hidden: "invisible",
				...classNames,
			}}
			components={{
				Dropdown: ({ value, onChange, options }: DropdownProps) => {
					const selected = options?.find((child) => child.value === value);

					const handleChange = (value: string) => {
						const changeEvent = {
							target: { value },
						} as React.ChangeEvent<HTMLSelectElement>;
						onChange?.(changeEvent);
					};

					return (
						<Select
							value={value?.toString()}
							onValueChange={(value) => {
								handleChange(value);
							}}
						>
							<SelectTrigger className="font-dm_sans bg-background-light dark:bg-background-dark">
								<SelectValue>{selected?.label}</SelectValue>
							</SelectTrigger>

							<SelectContent position="popper">
								<ScrollArea className="h-[200px] m-0 outline-none">
									{options?.map((option, id: number) => (
										<SelectItem
											key={`${option.value}-${id}`}
											value={option.value?.toString() ?? ""}
											disabled={option.disabled}
										>
											{option.label}
										</SelectItem>
									))}
								</ScrollArea>
							</SelectContent>
						</Select>
					);
				},
				Chevron: (props) => {
					if (props?.orientation === "left") {
						return <AngleLeft size={18} />;
					}
					return <AngleRight size={18} />;
				},
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
