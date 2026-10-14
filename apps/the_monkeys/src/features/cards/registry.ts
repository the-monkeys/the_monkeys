import { auroraGlass } from './templates/AuroraGlass';
import { classicClean } from './templates/ClassicClean';
import { corporateSplit } from './templates/CorporateSplit';
import { darkExecutive } from './templates/DarkExecutive';
import { editorialCentered } from './templates/EditorialCentered';
import { modernMinimal } from './templates/ModernMinimal';
import { CardTemplate } from './types';

export const CARD_TEMPLATES: CardTemplate[] = [
  classicClean,
  modernMinimal,
  corporateSplit,
  darkExecutive,
  auroraGlass,
  editorialCentered,
];

export const DEFAULT_TEMPLATE_ID = classicClean.id;

export const getTemplateById = (id: string): CardTemplate =>
  CARD_TEMPLATES.find((t) => t.id === id) ?? CARD_TEMPLATES[0];
