import { combineReducers, legacy_createStore } from 'redux';

const rawData = localStorage.getItem('appSettings');
const savedState = rawData ? JSON.parse(rawData) : null;

const initialState = {
    settings: {
        login: 'freeCodeCamp',
        repo: 'freeCodeCamp',
    },
    contributers: [],
    blacklist: [],
};

export interface ISettings {
    login: string,
    repo: string,
};

export interface ISettingsAction {
    type: string,
    payload: ISettings,
};

export const settingsReducer = (state: ISettings = { login: '', repo: '' }, action: ISettingsAction): ISettings => {
    switch (action.type) {
        case 'SETTINGS_SET':
            return {
                login: action.payload.login,
                repo: action.payload.repo,
            };
        default:
            return state;
    }
};

export const settingsActionCreator = (login: string, repo: string): ISettingsAction => {
    return {
        type: 'SETTINGS_SET',
        payload: {
            login: login,
            repo: repo,
        }
    }
};

export interface IArrayAction {
    type: string,
    payload: [],
};

export interface IContributer {
    login: string;
    avatar_url: string;
}


export const contributersReducer = (state: IContributer[] = [], action: IArrayAction): IContributer[] => {
    switch (action.type) {
        case 'CONTRIBUTERS_SET':
            return action.payload;
        default:
            return state;
    }
};

export const contributersActionCreator = (contributers: IContributer[]) => {
    return {
        type: 'CONTRIBUTERS_SET',
        payload: contributers,
    }
};

export const blacklistReducer = (state: string[] = [], action: IArrayAction): string[] => {
    switch (action.type) {
        case 'BLACKLIST_SET':
            return action.payload;
        default:
            return state;
    }
};

export const blacklistActionCreator = (blacklist: string[]) => {
    return {
        type: 'BLACKLIST_SET',
        payload: blacklist,
    }
};






const reducer = combineReducers({
    settings: settingsReducer,
    contributers: contributersReducer,
    blacklist: blacklistReducer,
});

export const store = legacy_createStore(reducer, savedState ?? initialState);

store.subscribe(() => {
    try {
        const data = JSON.stringify(store.getState());
        localStorage.setItem('appSettings', data);
    } catch {
        console.log('something went wrong durint localStorage.setItem()');
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;