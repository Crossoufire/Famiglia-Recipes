import React from "react";
import {useTranslation} from "react-i18next";


interface LanguageSwitcherProps {
    className?: string;
}


export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
    const { i18n } = useTranslation();

    const changeLanguage = async (ev: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = ev.target.value;
        await i18n.changeLanguage(newLang);
    };

    const languages = [{ code: "en" }, { code: "fr" }];

    return (
        <div className={className}>
            <select value={i18n.language} onChange={changeLanguage} className="bg-neutral-950 text-gray-300
            text-sm font-medium hover:cursor-pointer">
                {languages.map((lang) =>
                    <option key={lang.code} value={lang.code}>
                        {lang.code.toUpperCase()}
                    </option>
                )}
            </select>
        </div>
    );
};
