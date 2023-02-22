interface IAutocompleteItemProps {
    value: string,
    onClick: (itemValue: string) => void,
}

export default function AutocompleteItem({ value, onClick }: IAutocompleteItemProps) {
    return (
        <a
            href={value}
            className="autocomplete__item"
            onClick={(e) => {
                e.preventDefault();
                onClick(value)
            }}
        >
            {value}
        </a>
    );
}