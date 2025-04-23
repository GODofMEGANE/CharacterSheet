import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

import './App.css'
import { adjustShade, adjustTint, getTextColor } from './utils';

function App() {
    const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzK_ydizzOWf8bdQgJ1zuqS2K3fzhGxnwZZohcuyYGiesF3N5-1tIAK7FxtV5bl_fX-/exec?path=";
    const [characters, setCharacters] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandIndex, setExpandIndex] = useState<number>(-1);

    interface ChartData {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }[];
    }

    useEffect(() => {
        fetch(`${GAS_API_URL}list`).then(res => res.json()).then(data => {
            setCharacters(data);
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching data:", err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div id='loading'>
                <h1>Loading...</h1>
            </div>
        )
    }
    return (
        <div id='character-entries'>
            <div>{expandIndex}</div>
            {characters.map((character, index) => {
                const chartdata: ChartData = {
                    labels: character.chart.map((chart: { name: string, value: number }) => chart.name),
                    datasets: [
                        {
                            label: `${character.name}のレーダーチャート`,
                            data: character.chart.map((chart: { name: string, value: number }) => chart.value),
                            backgroundColor: adjustTint(character.color, 0.5),
                            borderColor: adjustShade(character.color, 0.8),
                            borderWidth: 1,
                        },
                    ],
                };
                return (<div id='character-entry' className='entry' key={index} style={{ '--color-background': adjustShade(character.color, 0.5), '--color-background-gray': adjustTint(adjustShade(character.color, 0.5), 0.5) } as React.CSSProperties}>
                    <div className='flex' onClick={() => { index !== expandIndex ? setExpandIndex(index) : setExpandIndex(-1) }}>
                        <div className="img-square" style={{ '--color-background-accent': adjustShade(character.color, 0.8) } as React.CSSProperties}>
                            <img src={`https://lh3.googleusercontent.com/d/${character.thumbnail}`} />
                        </div>
                        <div className='text-content'>
                            <p className='entry-title' style={{fontSize: `clamp(1rem, ${window.innerWidth * 0.6 / character.name.length}px, 3rem)`, '--color-text': getTextColor(adjustShade(character.color, 0.5)) } as React.CSSProperties}>{character.name}</p>
                            <p className='entry-kana' style={{ '--color-text': getTextColor(adjustShade(character.color, 0.5)) } as React.CSSProperties}>{character.name_kana}</p>
                        </div>
                    </div>
                    {index === expandIndex && (
                        <div className='entry-description' style={{ '--color-background': adjustTint(character.color, 0.8), '--color-text': getTextColor(adjustTint(character.color, 0.8)) } as React.CSSProperties}>
                            <Radar data={chartdata} />
                            {character.memo.map((memo: { category: string, content: string }, index: number) => (
                                <div key={`${index}-memo`}>
                                    <p key={`${index}-category`}>{memo.category}</p>
                                    <p className='text' key={`${index}-content`}>{memo.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                )
            })}
        </div>
    )
}

export default App
