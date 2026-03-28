import React from "react";
import { KullaniciProfil, Cinsiyet, AktiviteSeviyesi } from "../types";

interface TDEECalculatorPanelProps {
    data: KullaniciProfil["fizikselVeriler"];
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setField: (name: keyof KullaniciProfil["fizikselVeriler"], value: any) => void;
}

const cinsiyetOptions: { key: Cinsiyet; label: string }[] = [
    { key: "erkek", label: "Erkek" },
    { key: "kadin", label: "Kadın" },
];

const aktiviteOptions: { key: AktiviteSeviyesi; label: string; desc: string }[] = [
    { key: "hareketsiz (ofis işi)", label: "Hareketsiz", desc: "Ofis işi" },
    { key: "hafif egzersiz (haftada 1-2 gün)", label: "Hafif", desc: "1-2 Gün" },
    { key: "orta düzey egzersiz (haftada 3-5 gün)", label: "Orta", desc: "3-5 Gün" },
    { key: "yoğun egzersiz (haftada 6-7 gün)", label: "Yoğun", desc: "6-7 Gün" },
    { key: "atlet (günde 2 kez egzersiz)", label: "Atlet", desc: "Günde 2x" },
];

export default function TDEECalculatorPanel({ data, handleChange, setField }: TDEECalculatorPanelProps) {
    return (
        <div className="w-full bg-white text-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col font-sans">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                TDEE (Günlük Enerji İhtiyacı) Verileri
            </h3>

            <div className="flex flex-col gap-8">
                {/* Üst Satır: 4'lü Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* 1. Cinsiyet */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cinsiyet</label>
                        <div className="flex gap-3 h-[48px]">
                            {cinsiyetOptions.map((option) => (
                                <button
                                    key={option.key}
                                    type="button"
                                    onClick={() => setField("cinsiyet", option.key)}
                                    className={`flex-1 rounded-xl border-2 transition-all font-semibold text-sm flex items-center justify-center ${data.cinsiyet === option.key
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                                            : "bg-gray-50 border-gray-100 hover:border-indigo-200 text-gray-700 hover:bg-white"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Boy (Manuel Input) */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Boy</label>
                        <div className="relative h-[48px]">
                            <input
                                type="number"
                                name="boy"
                                value={data.boy || ""}
                                onChange={handleChange}
                                className="w-full h-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-4 pr-12 font-bold text-xl text-gray-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="175"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">cm</span>
                        </div>
                    </div>

                    {/* 3. Kilo (Manuel Input) */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kilo</label>
                        <div className="relative h-[48px]">
                            <input
                                type="number"
                                name="kilo"
                                value={data.kilo || ""}
                                onChange={handleChange}
                                className="w-full h-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-4 pr-12 font-bold text-xl text-gray-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="75"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                        </div>
                    </div>

                    {/* 4. Yaş (Manuel Input) */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Yaş</label>
                        <div className="relative h-[48px]">
                            <input
                                type="number"
                                name="yas"
                                value={data.yas || ""}
                                onChange={handleChange}
                                className="w-full h-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-4 pr-12 font-bold text-xl text-gray-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="25"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">yaş</span>
                        </div>
                    </div>
                </div>

                {/* Alt Satır: Aktivite Seviyesi */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aktivite Seviyesi</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {aktiviteOptions.map((option) => (
                            <button
                                key={option.key}
                                type="button"
                                onClick={() => setField("aktiviteSeviyesi", option.key)}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center h-[80px] ${data.aktiviteSeviyesi === option.key
                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                                        : "bg-gray-50 border-gray-100 hover:border-indigo-200 text-gray-700 hover:bg-white"
                                    }`}
                            >
                                <span className="font-semibold text-sm mb-1">{option.label}</span>
                                <span className={`text-[10px] ${data.aktiviteSeviyesi === option.key ? "text-indigo-200" : "text-gray-400"
                                    }`}>
                                    {option.desc}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}