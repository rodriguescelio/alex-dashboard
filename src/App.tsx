import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarFill } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { http } from './services/http.service';

import './App.css';

const App = () => {
  const [id, setId] = useState<any>(null);
  const [audios, setAudios] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => {
      const params = new URLSearchParams(window.location.search);
      if (params.has('id')) {
        setId(params.get('id'));
      }
    },
    []
  );

  useEffect(
    () => {
      if (id) {
        load();
      }
    },
    [id]
  );

  const load = async () => {
    try {
      const audios = await http.get(`/${id}/audios`).then(r => r.data);

      audios.commands.sort((a: any, b: any) => a.command.localeCompare(b.command));

      const audiosFiltered = audios.commands.filter((it: any) => audios.favorites.indexOf(it.id) === -1);

      setAudios(audiosFiltered);
      setFiltered(audiosFiltered);
      setFavorites(audios.commands.filter((it: any) => audios.favorites.indexOf(it.id) !== -1));

      inputRef.current!.value = '';
    } catch (e) {
      setId(null);
    }
  };

  const play = async (idAudio: number, event: any) => {
    event.stopPropagation();
    try {
      await http.post(`/${id}/play/${idAudio}`);
    } catch (e) {
      setId(null);
    }
  };

  const fav = async (idAudio: number, event: any) => {
    event.stopPropagation();
    try {
      await http.post(`/${id}/favorite/${idAudio}`);
      load();
    } catch (e) {
      setId(null);
    }
  };

  const onSearch = (e: any) => {
    const value = e.target.value;
    if (value) {
      setFiltered(audios.filter(it => it.command.toUpperCase().indexOf(value.toUpperCase()) !== -1));
    } else {
      setFiltered([...audios]);
    }
  }

  const getList = () => {
    const content = [
      ...favorites.map((it: any) => (
        <div key={it.id} onClick={play.bind(null, it.id)} className="item">
          <div className="fav" onClick={fav.bind(null, it.id)}>
            <FontAwesomeIcon icon={faStarFill} />
          </div>
          {it.command}
        </div>
      )),
      ...filtered.map((it: any) => (
        <div key={it.id} onClick={play.bind(null, it.id)} className="item">
          <div className="fav" onClick={fav.bind(null, it.id)}>
            <FontAwesomeIcon icon={faStarEmpty} />
          </div>
          {it.command}
        </div>
      ))
    ];

    return content;
  };

  return (
    <div className="App">
      {id ? (
        <>
          <div className="search">
            <input placeholder="Buscar..." onChange={onSearch} ref={inputRef} />
          </div>
          <div className="list">{getList()}</div>
        </>
      ) : 'Token Inválido!'}
    </div>
  );
}

export default App;
