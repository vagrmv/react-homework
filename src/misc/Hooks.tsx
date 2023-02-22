import { useState } from "react";

export const useToggle = (initialValue: boolean): [boolean, () => void] => {
    const [value, setValue] = useState(initialValue);
    const toggleValue = () => setValue(!value);
    return [value, toggleValue];
}

export const useAutocomplete = (fullList: string[]): [string[], (input: string) => void] => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const getSuggestions = (input: string) => {
        if (input === null) {
            return [];
        }
        const result = fullList.filter((item) => item.toLowerCase().includes(input.toLowerCase()));
        setSuggestions(result);
    };
    return [suggestions, getSuggestions];
}