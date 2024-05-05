import { BlogViewStyles } from './blog/BlogView';
import { ButtonVariantStyles } from './button';
import { IconVariantStyles } from './icon';
import { InputVariantStyles } from './input';

export const buttonVariantStyles: ButtonVariantStyles = {
  base: 'group px-4 py-2 font-jost text-sm sm:text-base rounded-lg cursor-pointer transition-all',
  primary:
    'bg-primary-monkeyOrange text-primary-monkeyWhite hover:text-primary-monkeyOrange border-2 border-primary-monkeyOrange hover:bg-primary-monkeyOrange/0',
  secondary:
    'bg-secondary-darkGrey text-secondary-white hover:text-primary-monkeyBlack dark:hover:text-primary-monkeyWhite border-2 border-secondary-darkGrey hover:bg-secondary-darkGrey/0',
  alert:
    'text-primary-monkeyWhite hover:text-alert-red border-2 border-alert-red bg-alert-red hover:bg-opacity-0',
  shallow:
    'hover:bg-secondary-darkGrey dark:hover:bg-secondary-white hover:text-secondary-white dark:hover:text-secondary-darkGrey border-2 border-primary-monkeyBlack dark:border-primary-monkeyWhite',
  ghost:
    'text-secondary-darkGrey dark:text-secondary-white hover:bg-secondary-darkGrey dark:hover:bg-secondary-white hover:text-secondary-white dark:hover:text-secondary-darkGrey',
};

export const inputVariantStyles: InputVariantStyles = {
  base: 'px-4 py-2 font-jost bg-primary-monkeyWhite/0 dark:bg-primary-monkeyBlack/0',
  border:
    'border-1 border-secondary-lightGrey/75 focus:border-secondary-lightGrey/25 focus:outline-none rounded-lg',
  ghost: 'focus:outline-none',
};

export const iconVariantStyles: IconVariantStyles = {
  base: 'text-primary-monkeyBlack dark:text-primary-monkeyWhite',
  primary: 'text-primary-monkeyWhite group-hover:text-primary-monkeyOrange',
  secondary:
    'text-secondary-white group-hover:text-primary-monkeyBlack dark:group-hover:text-primary-monkeyWhite',
  alert: 'text-primary-monkeyWhite group-hover:text-alert-red',
  shallow:
    'group-hover:text-primary-monkeyWhite dark:group-hover:text-primary-monkeyBlack',
  ghost:
    'text-primary-monkeyBlack dark:text-primary-monkeyWhite group-hover:text-primary-monkeyWhite dark:group-hover:text-primary-monkeyBlack',
  orange: 'text-primary-monkeyOrange',
  white: 'text-primary-monkeyWhite',
};

export const editorBlockVariantStyles: BlogViewStyles = {
  base: 'font-jost',
  header1: 'text-[2rem] pt-2',
  header2: 'text-[1.8rem] pt-2',
  header3: 'text-[1.5rem] pt-2',
  paragraph: 'text-[1.2rem] py-2',
  list: 'list-outside pl-10 py-2',
  listItemOrdered: 'py-1 list-decimal',
  listItemUnordered: 'py-1 list-disc',
  delimiter: 'text-[2rem] text-center',
};
