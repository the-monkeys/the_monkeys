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
				"relative p-4 bg-background-light dark:bg-background-dark border border-foreground-light dark:border-foreground-dark rounded-xl shadow-md",
				className,
			)}
			classNames={{
				months: "flex flex-col sm:flex-row gap-4",
				month: "w-full space-y-3",
				nav: "absolute inset-x-0 top-0 flex items-center justify-between pointer-events-none",

				button_previous: cn(
					buttonVariants({ variant: "outline" }),
					"pointer-events-auto size-8 bg-transparent p-0 opacity-70 hover:opacity-100 absolute left-6 top-4",
				),
				button_next: cn(
					buttonVariants({ variant: "outline" }),
					"pointer-events-auto size-8 bg-transparent p-0 opacity-70 hover:opacity-100 absolute right-6 top-4",
				),

				month_caption: "flex h-8 items-center justify-center mx-10",
				caption_label: "text-sm font-medium",
				dropdowns: "flex items-center justify-center gap-1",

				month_grid: "w-full border-collapse mt-2",
				weekdays: "grid grid-cols-7",
				weekday:
					"font-dm_sans text-text-light/60 dark:text-text-dark/60 font-normal text-sm text-center py-2",
				week: "grid grid-cols-7 mt-1",
				day: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-md last:[&:has([aria-selected])]:rounded-md focus-within:relative focus-within:z-20",
				day_button: cn(
					buttonVariants({ variant: "ghost" }),
					"h-10 w-10 mx-auto rounded-md p-0 font-normal",
				),
				selected:
					"bg-foreground-light dark:bg-foreground-dark hover:bg-primary",
				today: "bg-accent text-accent-foreground",
				outside: "opacity-40",
				disabled: "opacity-40",
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
