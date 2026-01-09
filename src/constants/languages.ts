export interface LanguageOption {
    code: string;
    name: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-HK', name: '繁體中文' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ko', name: '한국어' },
    { code: 'it', name: 'Italiano' },
    { code: 'th', name: 'ไทย' },
];

export const DEFAULT_LANGUAGE = 'zh-CN';
