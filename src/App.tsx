import React, {useEffect, useState} from 'react';
import './App.css'

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
        <div id='character-entry' className='flex entry' key={index}>
          <div className="img-square">
            <img src={character.thumbnail} />
          </div>
          <div className='text-content'>
            <p className='entry-title'>{character.name.family}{character.name.last}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
