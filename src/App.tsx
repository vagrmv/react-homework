import React, { useEffect, useState } from 'react';
import Collapsible from './components/Collapsible';
import { getRawContributers } from './misc/API';
import getAppSettings, { IAppSettings } from './misc/Config';
import { useToggle } from './misc/Hooks';

interface IContributer {
  login: string;
  avatar_url: string;
}

function App() {
  function findReviewer() {
    getRawContributers(settings.owner, settings.repo)
      .then((data) => {
        if (data) {
          const contributers = data
            .map((item: IContributer) => {
              return { login: item.login, avatar_url: item.avatar_url }
            })
            .filter((item: IContributer) => {
              return !settings.blacklistedUsers.includes(item.login);
            });
          if (contributers.length) {
            const randomIndex = Math.floor(Math.random() * contributers.length);
            setContributer(contributers[randomIndex]);
            setVisibility(false);
          } else {
            setVisibility(true);
          }
        } else {
          setVisibility(true);
        }
      });
  }

  const [isVisible, setVisibility] = useState(false);
  const [contributer, setContributer] = useState<IContributer>();
  const [settings, setSettings] = useState<IAppSettings>(getAppSettings());
  useEffect(() => {
    window.addEventListener('storage', () => {
      setContributer(undefined);
      setSettings(getAppSettings());
    });
  }, []);

  return (
    <div className='app'>
      <Collapsible />
      <button className='submit' onClick={findReviewer}>Поиск</button>
      <div className='result'>
        <img className='result__img' src={contributer?.avatar_url} alt="" />
        <p className='result__text' >{contributer?.login}</p>
        {isVisible && <p>По заданным настройкам не нашлось контрибьютеров</p>}
      </div>
    </div>
  );
}

export default App;
