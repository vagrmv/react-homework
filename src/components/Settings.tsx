import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRawUserRepos } from "../misc/API";
import { RootState, settingsActionCreator } from "../store/store";
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
        setTempLogin(e.target.value);
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            getUserRepos(e.target.value);
        }, 500));
    }

    function handleSave() {
        dispatch(settingsActionCreator(tempLogin, tempRepo));
    }

    const login = useSelector((state: RootState) => state.settings.login);
    const repo = useSelector((state: RootState) => state.settings.repo);
    const [tempLogin, setTempLogin] = useState<string>(login);
    const [tempRepo, setTempRepo] = useState<string>(repo);
    const dispatch = useDispatch();
    const [repos, setRepos] = useState<string[]>([]);
    const [timer, setTimer] = useState<NodeJS.Timeout>();

    useEffect(() => {
        getUserRepos(tempLogin);
    }, []);

    return (
        <div className="settings">
            <input
                type="text"
                placeholder="Логин"
                value={tempLogin}
                onChange={handleUserInput}
            />
            <Autocomplete
                placeholder="Репозиторий"
                autocompleteList={repos}
                initialValue={tempRepo}
                returnValueFunc={(input) => setTempRepo(input)}
            />
            <button className="settings__save" onClick={handleSave}>Сохранить</button>
        </div>
    );
}