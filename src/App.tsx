import React, {useEffect, useState} from 'react';
import './App.css'
import { adjustShade, adjustTint } from './utils';

function App() {
  const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzK_ydizzOWf8bdQgJ1zuqS2K3fzhGxnwZZohcuyYGiesF3N5-1tIAK7FxtV5bl_fX-/exec?path=";
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${GAS_API_URL}list`).then(res => res.json()).then(data => {
      setCharacters(data);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching data:", err);
      setLoading(false);
    });
  }, []);

  if(loading){
    return (
      <div id='loading'>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div id='character-entries'>
      {characters.map((character, index) => (
        <div id='character-entry' className='flex entry' key={index} style={{backgroundColor: adjustTint(character.color, 0.7)}}>
          <div className="img-square" style={{filter: `drop-shadow(5px 5px 0 ${adjustShade(character.color, 0.5)})`}}>
            <img src={character.thumbnail} />
          </div>
          <div className='text-content'>
            <p className='entry-title'>{character.name.family}{character.name.last}</p>
            <p className='entry-kana'>{character.name.family_kana}{character.name.last_kana}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
