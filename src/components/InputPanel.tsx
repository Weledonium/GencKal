import React from "react";
import { KullaniciProfil } from "../types";

interface InputPanelProps {
    data: KullaniciProfil["fizikselVeriler"];
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setField: (name: keyof KullaniciProfil["fizikselVeriler"], value: any) => void;
}

export default function InputPanel({ data, handleChange, setField }: InputPanelProps) {
    const { boy, kilo, yagOrani, cinsiyet } = data;

    return (
        <div className="w-full md:ml-[19rem] lg:ml-[22rem] bg-white text-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 z-10 relative flex flex-col justify-center">

            {/* Top Bar: Compact Extra Data */}
            <div className="flex items-center justify-center mb-8 pb-4 border-b border-gray-100 text-sm">

                {/* Gender */}
                <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-500 text-xs uppercase tracking-wider">Cinsiyet:</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setField('cinsiyet', 'erkek')}
                            type="button"
                            className={`px-4 py-1.5 rounded-lg text-sm font-black transition-all ${cinsiyet === 'erkek' ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}
                        >
                            Erkek
                        </button>
                        <button
                            onClick={() => setField('cinsiyet', 'kadın')}
                            type="button"
                            className={`px-4 py-1.5 rounded-lg text-sm font-black transition-all ${cinsiyet === 'kadın' ? 'bg-pink-600 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}
                        >
                            Kadın
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Sliders Exactly like FFMI Calculator */}
            <div className="space-y-7">
                {[
                    { name: 'boy', label: 'Boy', unit: 'cm', min: 140, max: 230, val: boy },
                    { name: 'kilo', label: 'Kilo', unit: 'kg', min: 40, max: 150, val: kilo },
                    { name: 'yagOrani', label: 'Yağ Oranı', unit: '%', min: 3, max: 50, val: yagOrani || 15 }
                ].map(slider => (
                    <div key={slider.name} className="flex flex-col">
                        <div className="flex justify-between items-baseline mb-1">
                            <label className="text-sm font-bold text-gray-600 tracking-wide">
                                {slider.label}
                            </label>
                            <div className="text-3xl font-black text-indigo-900 tracking-tight">
                                {slider.val}<span className="text-sm text-gray-400 font-bold ml-1">{slider.unit}</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            name={slider.name}
                            min={slider.min}
                            max={slider.max}
                            value={slider.val}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600 outline-none hover:accent-indigo-500 transition-all"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
