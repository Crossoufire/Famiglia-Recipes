import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";


export const LanguageSwitcher = ({ className }) => {
    const { i18n } = useTranslation();
    const [selectedLang, setSelectedLang] = useState(i18n.language);

    useEffect(() => {
        setSelectedLang(i18n.language);
    }, [i18n.language]);

    const changeLanguage = async (ev) => {
        const newLang = ev.target.value;
        setSelectedLang(newLang);
        await i18n.changeLanguage(newLang);
    };

    const languages = [
        { code: "en" },
        { code: "fr" },
    ];

    return (
        <div className={className}>
            <select value={selectedLang} onChange={changeLanguage} className="bg-neutral-950 text-gray-300
            text-sm font-medium hover:cursor-pointer">
                {languages.map(lang =>
                    <option key={lang.code} value={lang.code}>
                        {lang.code.toUpperCase()}
                    </option>
                )}
            </select>
        </div>
    );
};
