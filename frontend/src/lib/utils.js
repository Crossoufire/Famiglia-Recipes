import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";


export const cn = (...inputs) => {
    return twMerge(clsx(inputs));
};


export const groupRecipesAlphabetically = (recipes) => {
    return recipes.reduce((acc, recipe) => {
        const firstLetter = recipe.title[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(recipe);
        return acc;
    }, {});
};


export const normalizeStr = (str) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};


export const reorganizeForSelector = (data) => {
    return data.map(label => ({ id: label.id, value: label.name, label: label.name, color: label.color }));
};
