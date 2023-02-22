import { useState } from "react";
import { useAutocomplete, useToggle } from "../misc/Hooks"
import AutocompleteItem from "./AutocompleteItem";

interface IAutocompleteProps {
    placeholder: string,
    initialValue: string,
    autocompleteList: string[],
    returnValueFunc?: (input: string, isClicked?: boolean) => void,
}

export default function Autocomplete({ placeholder, initialValue, autocompleteList, returnValueFunc }: IAutocompleteProps) {
    function handleItemClick(itemValue: string) {
        setValue(itemValue);
        (returnValueFunc && returnValueFunc(itemValue, true));
    }
    function handleChange(e: {target: {value: string}}){
        setValue(e.target.value);
        (returnValueFunc && returnValueFunc(e.target.value, false));
        setSuggestions(e.target.value);
    }
    const [value, setValue] = useState<string>(initialValue);
    const [isVisible, toggleVisibility] = useToggle(false);
    const [suggestions, setSuggestions] = useAutocomplete(autocompleteList);
    return (
        <div
            className="autocomplete"
            onFocus={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    toggleVisibility();
                    setSuggestions(value);
                }
            }}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    toggleVisibility();
                }
            }}
        >
            <input
                type="search"
                className="autocomplete__input"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />

            {isVisible && <div className="autocomplete__panel">
                {suggestions.map((item, i) => <AutocompleteItem key={i} value={item} onClick={(e) => {
                    toggleVisibility();
                    handleItemClick(e)
                }}/>)}
            </div>}
        </div>
    )
}