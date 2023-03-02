import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Collapsible from './components/Collapsible';
import { getRawContributers } from './misc/API';
import { blacklistActionCreator, contributersActionCreator, IContributer, RootState } from './store/store';

function App() {
  function loadContributers() {
    getRawContributers(appState.settings.login, appState.settings.repo)
      .then((data) => {
        if (data) {
          const contributers: IContributer[] = data
            .map((item: IContributer) => {
              return { login: item.login, avatar_url: item.avatar_url }
            })
            .filter((item: IContributer) => {
              return item.login !== appState.settings.login
            })
          dispatch(contributersActionCreator(contributers));
        }
      });
  }

  function findReviewer() {
    const contributers = appState.contributers
      .filter((item) => {
        return !appState.blacklist.includes(item.login);
      });

    if (contributers.length) {
      const randomIndex = Math.floor(Math.random() * contributers.length);
      setContributer(contributers[randomIndex]);
    }
  }

  const [selectedContributer, setContributer] = useState<IContributer>();
  const appState: RootState = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    loadContributers();
    setContributer(undefined);
    dispatch(blacklistActionCreator([]));
  }, [appState.settings.login, appState.settings.repo]);

  return (
    <div className='app'>
      <Collapsible />
      <button className='submit' onClick={findReviewer}>Поиск</button>
      <div className='result'>
        <img className='result__img' src={selectedContributer?.avatar_url} alt="" />
        <p className='result__text' >{selectedContributer?.login}</p>
        {!appState.contributers.length && <p>По заданным настройкам не нашлось контрибьютеров</p>}
      </div>
    </div>
  );
}

export default App;
