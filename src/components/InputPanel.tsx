import React from "react";
import { KullaniciProfil } from "../types";

interface InputPanelProps {
    data: KullaniciProfil["fizikselVeriler"];
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setField: (name: keyof KullaniciProfil["fizikselVeriler"], value: any) => void;
}

export default function InputPanel({ data, handleChange, setField }: InputPanelProps) {
    const { boy, kilo, yas, yagOrani, cinsiyet, aktiviteSeviyesi, agirlikCalisiyorMu } = data;

    return (
        <div className="w-full md:ml-[19rem] lg:ml-[22rem] bg-white text-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 z-10 relative flex flex-col justify-center">

            {/* Top Bar: Compact Extra Data */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 mb-8 pb-4 border-b border-gray-100 text-sm">

                {/* Age */}
                <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-500 text-xs uppercase tracking-wider">Yaş:</span>
                    <input
                        type="number"
                        name="yas"
                        value={yas}
                        onChange={handleChange}
                        className="w-14 border-b-2 border-gray-200 px-1 py-0.5 outline-none focus:border-indigo-500 text-center font-bold text-gray-800 bg-transparent transition-colors"
                    />
                </div>

                {/* Gender */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setField('cinsiyet', 'erkek')}
                        type="button"
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${cinsiyet === 'erkek' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Erkek
                    </button>
                    <button
                        onClick={() => setField('cinsiyet', 'kadın')}
                        type="button"
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${cinsiyet === 'kadın' ? 'bg-pink-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Kadın
                    </button>
                </div>

                {/* Weight Training */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-500 text-xs uppercase tracking-wider">Ağırlık:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="agirlikCalisiyorMu" checked={agirlikCalisiyorMu} onChange={handleChange} className="sr-only peer" />
                        <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                {/* Activity */}
                <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-500 text-xs uppercase tracking-wider">Aktİflik:</span>
                    <select
                        value={aktiviteSeviyesi}
                        onChange={(e) => setField('aktiviteSeviyesi', e.target.value)}
                        className="border-b-2 border-gray-200 px-1 py-0.5 outline-none focus:border-indigo-500 font-bold text-gray-800 bg-transparent text-xs max-w-[100px] truncate transition-colors appearance-none cursor-pointer"
                    >
                        <option value="hareketsiz (ofis işi)">Hareketsiz</option>
                        <option value="hafif egzersiz (haftada 1-2 gün)">Hafif</option>
                        <option value="orta düzey egzersiz (haftada 3-5 gün)">Orta</option>
                        <option value="yoğun egzersiz (haftada 6-7 gün)">Yoğun</option>
                    </select>
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
