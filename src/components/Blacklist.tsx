import { useEffect, useState } from "react";
import { getRawContributers } from "../misc/API";
import getAppSettings, { IAppSettings, SETTINGS_KEY } from "../misc/Config";
import Autocomplete from "./Autocomplete";

export default function Blacklist() {
    function removeContributer(input: string){
        const newList: string[] = selectedContributers.filter((item: string) => item !== input)
        const settings = getAppSettings();
        settings.blacklistedUsers = [...newList];
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        setSelectedContributers(newList);

        window.dispatchEvent(new Event('storage'));
    }
    function refreshData() {
        const data: IAppSettings = getAppSettings();
        setUser(data.owner);
        setRepo(data.repo);
        setSelectedContributers(data.blacklistedUsers);
        getContributers(data.owner, data.repo);
    }
    function getContributers(owner: string, repo: string) {
        getRawContributers(owner, repo).then((data) => {
            if (data) {
                const temp: string[] = data
                    .map((item: { login: string }) => item.login)
                    .filter((item: string) => item !== user);
                setContributers(temp);
            } else {
                setContributers([])
            }
        });
    }
    function handleItemClick(input: string) {
        if (!selectedContributers.includes(input)) {
            const settings = getAppSettings();
            settings.blacklistedUsers = [...selectedContributers, input];
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            setSelectedContributers([...selectedContributers, input])
            
            window.dispatchEvent(new Event('storage'));
        }
    }


    const settings = getAppSettings();
    const [user, setUser] = useState<string>(settings.owner);
    const [repo, setRepo] = useState<string>(settings.repo);
    const [selectedContributers, setSelectedContributers] = useState<string[]>([]);
    const [contributers, setContributers] = useState<string[]>([]);

    useEffect(() => {
        window.addEventListener('storage', refreshData);
        getContributers(user, repo);
        setSelectedContributers(getAppSettings().blacklistedUsers)
    }, []);

    return (
        <div className="blacklist">
            <Autocomplete
                placeholder="Добавить в черный список"
                initialValue=""
                autocompleteList={contributers}
                returnValueFunc={(input, isClicked) => {
                    if (isClicked) {
                        handleItemClick(input);
                    }
                }}
            />
            <div className="blacklist__list">
                {selectedContributers.map((item, i) => <a
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