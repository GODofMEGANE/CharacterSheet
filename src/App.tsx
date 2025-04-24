import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

import './App.css'
import { fixImageUrl, adjustShade, adjustTint } from './utils';

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
                if (character.draft) {
                    return;
                }
                if (character.images.length == 0) {
                    character.images.push(character.thumbnail)
                }

                const css_vars = {
                    '--color': character.color,
                    '--color-background': adjustTint(adjustShade(character.color, 0.5), 0.5),
                    '--color-background-gray': adjustTint(adjustShade(character.color, 0.5), 0.5),
                    '--color-background-accent': adjustShade(character.color, 0.5),
                    '--color-shadow': adjustShade(character.color, 0.7),
                    '--color-text': "#ffffff",
                };

                const chartdata: ChartData = {
                    labels: character.chart.map((chart: { name: string, value: number }) => chart.name),
                    datasets: [
                        {
                            label: `${character.name}のレーダーチャート`,
                            data: character.chart.map((chart: { name: string, value: number }) => chart.value),
                            backgroundColor: css_vars['--color'],
                            borderColor: css_vars['--color-shadow'],
                            borderWidth: 1,
                        },
                    ],
                };
                return (<div id='character-entry' key={index} style={css_vars as React.CSSProperties}>
                    <div className='flex entry' onClick={() => { index !== expandIndex ? setExpandIndex(index) : setExpandIndex(-1) }}>
                        <div className="img-square">
                            <img src={fixImageUrl(character.thumbnail)} />
                        </div>
                        <div className='text-content'>
                            <p className='entry-title' style={{ fontSize: `clamp(1rem, ${window.innerWidth * 0.6 / character.name.length}px, 3rem)` } as React.CSSProperties}>{character.name}</p>
                            <p className='entry-kana'>{character.name_kana}</p>
                        </div>
                    </div>
                    {index === expandIndex && (
                        <div className='entry-description'>
                            <div className='flex'>
                                {character.images.map((image: string, index: number) => (
                                    <div className="img-area" key={`${index}-img`}>
                                        <img src={fixImageUrl(image)} />
                                    </div>
                                ))}
                                <div className="radar">
                                    <Radar data={chartdata} options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        aspectRatio: 1,
                                    }} />
                                </div>
                            </div>
                            {character.memo.map((memo: { category: string, content: string }, index: number) => (
                                <div className='memo' key={`${index}-memo`}>
                                    <p className='text-category' key={`${index}-category`}>
                                        <span>{memo.category}</span>
                                    </p>
                                    <p className='text-content' key={`${index}-content`}>
                                        <span>{memo.content}</span>
                                    </p>
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
