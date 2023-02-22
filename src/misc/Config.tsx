export interface IAppSettings {
    owner: string;
    repo: string;
    blacklistedUsers: string[]
}

export const SETTINGS_KEY = 'appSettings';

export default function getAppSettings(): IAppSettings{
    const data: IAppSettings = {
        owner: '',
        repo: '',
        blacklistedUsers: [],
    }
    const rawData = localStorage.getItem(SETTINGS_KEY);
    if (rawData) {
        return Object.assign(data, JSON.parse(rawData));
    }
    return data;
}