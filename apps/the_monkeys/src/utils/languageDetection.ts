/**
 * Simple language detection utility
 * Detects common languages based on character patterns and common words
 */

interface LanguageDetection {
  code: string;
  name: string;
  confidence: number;
}

// Common words for different languages
const languagePatterns = {
  en: {
    name: 'English',
    patterns: [
      /\b(the|and|for|are|but|not|you|all|any|can|had|her|was|one|our|out|day|get|has|him|his|how|man|new|now|old|see|two|who|boy|did|its|let|put|say|she|too|use)\b/gi,
      /\b(about|after|again|before|being|every|first|found|great|group|house|little|never|other|place|right|small|still|such|those|under|where|while|world)\b/gi,
    ],
    threshold: 3,
  },
  es: {
    name: 'Spanish',
    patterns: [
      /\b(que|por|con|una|para|como|pero|sus|han|del|las|los|una|uno|dos|más|muy|ser|fue|día|año|vez|casa|desde|hasta|donde|porque|cuando|aunque)\b/gi,
      /\b(español|también|después|mientras|aunque|siempre|nunca|sobre|entre|contra|durante|mediante|según|hacia|desde)\b/gi,
    ],
    threshold: 3,
  },
  fr: {
    name: 'French',
    patterns: [
      /\b(que|pas|pour|vous|une|sur|avec|tout|son|une|ses|mais|qui|dans|par|plus|dire|mes|moi|ces|son|une|deux|bien|être|avoir|faire|aller|voir|savoir)\b/gi,
      /\b(français|aussi|après|pendant|bien|toujours|jamais|contre|entre|depuis|jusqu|avant|maintenant|seulement)\b/gi,
    ],
    threshold: 3,
  },
  de: {
    name: 'German',
    patterns: [
      /\b(der|die|das|und|ich|ist|sie|ein|zu|er|es|auch|auf|an|als|für|mit|war|hat|er|wir|von|nicht|den|eine|einer|sich|bei|nach|wie|über|sein|haben|werden)\b/gi,
      /\b(deutsch|auch|aber|oder|wenn|dann|noch|nur|schon|mehr|hier|dort|heute|morgen|gestern|immer|nie|gegen|zwischen|während|bevor|nachdem)\b/gi,
    ],
    threshold: 3,
  },
  it: {
    name: 'Italian',
    patterns: [
      /\b(che|per|con|una|non|più|da|su|come|ma|se|no|ci|lo|le|si|la|un|di|a|e|il|in|del|della|delle|degli|nell|alla|dal|sul|col|nel)\b/gi,
      /\b(italiano|anche|dopo|mentre|però|sempre|mai|contro|tra|fra|durante|secondo|verso|fino|prima|adesso|soltanto)\b/gi,
    ],
    threshold: 3,
  },
  pt: {
    name: 'Portuguese',
    patterns: [
      /\b(que|não|uma|com|para|ser|ter|ele|seu|por|mais|mas|dos|como|bem|foi|seu|ela|até|sem|aos|meu|tem|seu|vez|vez|anos|onde|isso|cada|tanto|desde)\b/gi,
      /\b(português|também|depois|enquanto|porém|sempre|nunca|contra|entre|durante|segundo|até|antes|agora|apenas|muito|muito)\b/gi,
    ],
    threshold: 3,
  },
  zh: {
    name: 'Chinese',
    patterns: [
      /[\u4e00-\u9fff]/g, // Chinese characters
      /[的|和|是|了|在|有|我|他|她|你|们|这|那|个|上|下|中|来|去|说|会|能|要|还|就|都|也|很|太|非常]/g,
    ],
    threshold: 5,
  },
  ja: {
    name: 'Japanese',
    patterns: [
      /[\u3040-\u309f]/g, // Hiragana
      /[\u30a0-\u30ff]/g, // Katakana
      /[\u4e00-\u9fff]/g, // Kanji
      /[の|を|に|は|が|で|と|から|まで|より|へ|や|か|も|こと|です|ます|した|して|する|ある|いる]/g,
    ],
    threshold: 3,
  },
  ko: {
    name: 'Korean',
    patterns: [
      /[\uac00-\ud7af]/g, // Korean characters
      /[의|를|에|는|이|가|와|과|로|으로|부터|까지|보다|에서|에게|한테|처럼|같이|만|도|조차|마저]/g,
    ],
    threshold: 3,
  },
  ar: {
    name: 'Arabic',
    patterns: [
      /[\u0600-\u06ff]/g, // Arabic characters
      /[في|من|إلى|على|عن|مع|هذا|هذه|التي|الذي|كان|كانت|يكون|تكون|قد|لقد|أن|أو|لكن|لكن|إذا|عندما]/g,
    ],
    threshold: 3,
  },
  hi: {
    name: 'Hindi',
    patterns: [
      /[\u0900-\u097f]/g, // Devanagari characters
      /[का|की|के|में|से|को|पर|है|हैं|था|थे|होना|करना|यह|वह|और|या|लेकिन|अगर|जब|क्योंकि]/g,
    ],
    threshold: 3,
  },
  ru: {
    name: 'Russian',
    patterns: [
      /[\u0400-\u04ff]/g, // Cyrillic characters
      /\b(что|для|как|так|все|еще|уже|или|если|когда|где|там|здесь|сейчас|потом|всегда|никогда|против|между|во время|перед|после)\b/gi,
    ],
    threshold: 3,
  },
};

/**
 * Extract text content from EditorJS blocks
 */
export function extractTextFromBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks
    .map((block) => {
      switch (block.type) {
        case 'paragraph':
        case 'header':
          return block.data?.text || '';
        case 'list':
          return block.data?.items?.join(' ') || '';
        case 'quote':
          return block.data?.text || '';
        case 'code':
          return ''; // Skip code blocks for language detection
        default:
          return '';
      }
    })
    .join(' ')
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
}

/**
 * Detect language from text content
 */
export function detectLanguage(text: string): LanguageDetection {
  if (!text || text.length < 10) {
    return { code: 'unknown', name: 'Unknown', confidence: 0 };
  }

  const results: LanguageDetection[] = [];

  // Test each language
  Object.entries(languagePatterns).forEach(([code, lang]) => {
    let matches = 0;
    let totalMatches = 0;

    lang.patterns.forEach((pattern) => {
      const patternMatches = text.match(pattern);
      if (patternMatches) {
        matches += patternMatches.length;
        totalMatches += patternMatches.length;
      }
    });

    if (matches >= lang.threshold) {
      const confidence = Math.min(matches / text.split(' ').length, 1);
      results.push({
        code,
        name: lang.name,
        confidence: confidence,
      });
    }
  });

  // Sort by confidence and return the best match
  results.sort((a, b) => b.confidence - a.confidence);

  if (results.length > 0) {
    return results[0];
  }

  // Default to English if no clear pattern is found but text is in Latin script
  const hasLatinChars = /[a-zA-Z]/.test(text);
  if (hasLatinChars) {
    return { code: 'en', name: 'English', confidence: 0.3 };
  }

  return { code: 'unknown', name: 'Unknown', confidence: 0 };
}

/**
 * Get language flag emoji (optional visual enhancement)
 */
export function getLanguageFlag(languageCode: string): string {
  const flags: Record<string, string> = {
    en: '🇺🇸',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    it: '🇮🇹',
    pt: '🇵🇹',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
    ar: '🇸🇦',
    hi: '🇮🇳',
    ru: '🇷🇺',
    unknown: '🌐',
  };

  return flags[languageCode] || '🌐';
}
