import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import {formatDateTime} from "~/lib/utils/helpers";
import enTranslations from "./translations/en.json";
import frTranslations from "./translations/fr.json";
import LanguageDetector from "i18next-browser-languagedetector";


interface Formatters {
    datetime: (
        value: string | number | Date,
        lang: string | undefined,
        options?: DateTimeFormatOptions
    ) => string;
}


interface DateTimeFormatOptions {
    includeTime?: boolean;
}


const formatters: Formatters = {
    datetime: (value, lang, options) => formatDateTime(value, lang, options),
};


const detectionOptions = {
    lookupCookie: "i18next",
    lookupQuerystring: "lng",
    lookupLocalStorage: "i18nextLng",
    caches: ["localStorage", "cookie"],
    order: ["localStorage", "navigator", "querystring", "cookie", "htmlTag"],
};


void i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        fallbackLng: "en",
        detection: detectionOptions,
        resources: {
            en: { translation: enTranslations },
            fr: { translation: frTranslations },
        },
        interpolation: {
            escapeValue: false,
            format: (value: unknown, format?: string, lang?: string, options?: unknown) => {
                if (format === "datetime") {
                    const opts: DateTimeFormatOptions | undefined = typeof options === "object" && options !== null
                        ? (options as DateTimeFormatOptions) : undefined;

                    if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
                        return formatters.datetime(value, lang, opts);
                    }
                }
                return String(value);
            },
        },
        react: {
            useSuspense: true,
        },
    });


export default i18next;
