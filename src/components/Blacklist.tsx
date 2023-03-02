import { useDispatch, useSelector } from "react-redux";
import { blacklistActionCreator, RootState } from "../store/store";
import Autocomplete from "./Autocomplete";

export default function Blacklist() {
    function removeContributer(input: string) {
        const newList: string[] = blacklist.filter((item: string) => item !== input)
        dispatch(blacklistActionCreator(newList));
    }

    function handleItemClick(input: string) {
        if (!blacklist.includes(input)) {
            dispatch(blacklistActionCreator([...blacklist, input]));
        }
    }

    const contributers = useSelector((state: RootState) => state.contributers);
    const blacklist = useSelector((state: RootState) => state.blacklist);
    const dispatch = useDispatch();

    return (
        <div className="blacklist">
            <Autocomplete
                placeholder="Добавить в черный список"
                initialValue=""
                autocompleteList={contributers.map(item => item.login)}
                returnValueFunc={(input, isClicked) => {
                    if (isClicked) {
                        handleItemClick(input);
                    }
                }}
            />
            <div className="blacklist__list">
                {blacklist.map((item, i) => <a
                    href={item}
                    className='blacklist__item'
                    key={i}
                    onClick={(e) => {
                        e.preventDefault();
                        removeContributer(item);
                    }}
                >
                    {item} &#10006;
                </a>)}
            </div>
        </div>
    );
}