import { useEffect, useState } from "react";
import { getRawUserRepos } from "../misc/API";
import getAppSettings, { IAppSettings, SETTINGS_KEY } from "../misc/Config";
import Autocomplete from "./Autocomplete";

export default function Settings() {
    function getUserRepos(input: string) {
        getRawUserRepos(input).then((data) => {
            if (data) {
                const temp = data.map((item: { name: string }) => item.name);
                setRepos(temp)
            } else {
                setRepos([]);
            }
        });
    }
    function handleUserInput(e: { target: { value: string } }) {
        setUser(e.target.value);
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            getUserRepos(e.target.value)
        }, 500));
    }

    function handleSave() {
        const data: IAppSettings = {
            owner: user,
            repo: repo,
            blacklistedUsers: []
        }
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
            window.dispatchEvent(new Event('storage'));
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message)
                console.log('something went wrong during writing settings to localStorage');
            }
        }
    }

    
    const settings = getAppSettings();
    const [user, setUser] = useState<string>(settings.owner);
    const [repo, setRepo] = useState<string>(settings.repo);
    const [repos, setRepos] = useState<string[]>([]);
    const [timer, setTimer] = useState<NodeJS.Timeout>();

    useEffect(() => {
        getUserRepos(user);
    }, []);

    return (
        <div className="settings">
            <input
                type="text"
                placeholder="Логин"
                value={user}
                onChange={handleUserInput}
            />
            <Autocomplete
                placeholder="Репозиторий"
                autocompleteList={repos}
                initialValue={repo}
                returnValueFunc={(input) => setRepo(input)}
            />
            <button className="settings__save" onClick={handleSave}>Сохранить</button>
        </div>
    );
}