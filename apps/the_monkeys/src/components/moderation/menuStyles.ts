/** Shared geometry and hover treatment for every content options trigger. */
export const contentOptionsTriggerClass =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 text-gray-500 transition-colors hover:bg-brand-orange/5 hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange disabled:opacity-50';

/** Plain dots remain visible on a photo without drawing a permanent button badge. */
export const contentOptionsImageClass =
  '[&>button]:text-white [&>button]:drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]';
