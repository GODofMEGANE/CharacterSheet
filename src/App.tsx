import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { motion } from "framer-motion";
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
                const chartdata = {
                    type: 'radar',
                    data: {
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
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 1,
                        scales: {r: {
                            min: 0,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                backdropColor: 'transparent',
                            },
                        }}
                    }
                }

                return (

                    <div id='character-entry' key={`${index}-character-entry`} style={css_vars as React.CSSProperties}>
                        <div className='flex entry' style={(index === expandIndex ? { backgroundPosition: 'right' } : {})}
                            onClick={(e) => {
                                if (index !== expandIndex) e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                index !== expandIndex ? setExpandIndex(index) : setExpandIndex(-1);
                            }}>
                            <div className="img-square" key={`${index}-img-square`}>
                                <img src={fixImageUrl(character.thumbnail)} key={`${index}-thumbnail`} />
                            </div>
                            <div className='text-content'>
                                <p className='entry-title' key={`${index}-entry-title`}
                                    style={{ fontSize: `clamp(1rem, ${window.innerWidth * 0.6 / character.name.length}px, 3rem)` } as React.CSSProperties}>
                                    {character.name}
                                </p>
                                <p className='entry-kana'>{character.name_kana}</p>
                            </div>
                        </div>
                        {index === expandIndex && (
                            <motion.div className='entry-description' key={`${index}-entry-description`}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                style={{ overflow: "hidden" }}>

                                <div className='flex' key={`${index}-description-header`}>
                                    {character.images.map((image: string, image_index: number) => (
                                        <div className="img-area" key={`${index}-${image_index}-img-area`}>
                                            <img src={fixImageUrl(image)} key={`${index}-${image_index}-image`} />
                                        </div>
                                    ))}
                                    <div className="radar" key={`${index}-rader`}>
                                        <Radar data={chartdata.data} key={`${index}-radercanvas`} options={chartdata.options} />
                                    </div>
                                </div>
                                {character.memo.map((memo: { category: string, content: string }, memo_index: number) => (
                                    <div className='memo' key={`${index}-${memo_index}-memo`}>
                                        <p className='text-category' key={`${index}-${memo_index}-text-category`}>
                                            <span>{memo.category}</span>
                                        </p>
                                        <p className='text-content' key={`${index}-${memo_index}-text-content`}>
                                            <span>{memo.content}</span>
                                        </p>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                )
            })}
        </div>
    )
}

export default App
