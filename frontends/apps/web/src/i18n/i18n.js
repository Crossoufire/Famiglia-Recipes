import i18n from "i18next";
import {formatDateTime} from "@/lib/utils";
import {initReactI18next} from "react-i18next";
import enTranslations from "./translations/en.json";
import frTranslations from "./translations/fr.json";
import LanguageDetector from "i18next-browser-languagedetector";


const formatters = {
    datetime: (value, lang, options) => formatDateTime(value, lang, options),
};


const detectionOptions = {
    lookupCookie: "i18next",
    lookupQuerystring: "lng",
    lookupLocalStorage: "i18nextLng",
    caches: ["localStorage", "cookie"],
    order: ["localStorage", "navigator", "querystring", "cookie", "htmlTag"]
};


void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: import.meta.env.DEV,
        detection: detectionOptions,
        resources: {
            en: { translation: enTranslations },
            fr: { translation: frTranslations },
        },
        interpolation: {
            escapeValue: false,
            format: (value, format, lang, options) => {
                console.log({ value, format, lang, options });
                if (format === "datetime") {
                    return formatters.datetime(value, lang, options);
                }
                return value;
            }
        }
    });


export default i18n;