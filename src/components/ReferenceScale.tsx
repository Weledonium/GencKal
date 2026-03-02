import React, { useMemo } from "react";
import { Cinsiyet } from "../types";

interface ReferenceScaleProps {
    score: number;
    type: "FFMI" | "BMI";
    gender?: Cinsiyet;
}

export default function ReferenceScale({ score, type, gender }: ReferenceScaleProps) {
    const isBMI = type === "BMI";
    const minScale = isBMI ? 15 : 16;
    const maxScale = isBMI ? 40 : 30;

    // Yüzde hesaplama (Bara göre konum)
    const percent = useMemo(() => {
        return Math.min(100, Math.max(0, ((score - minScale) / (maxScale - minScale)) * 100));
    }, [score, minScale, maxScale]);

    const categories = isBMI ? [
        { label: "Zayıf", position: 10 },
        { label: "Normal", position: 30 },
        { label: "Fazla Kilolu", position: 60 },
        { label: "Obez", position: 85 }
    ] : [
        { label: "Ortalama Altı", position: 7 },     // ~17
        { label: "Ortalama", position: 21 },         // ~19
        { label: "Ortalamanın Üstü", position: 35 }, // ~21
        { label: "Mükemmel", position: 50 },         // ~23
        { label: "Üstün", position: 64 },            // ~25
        { label: "Şüpheli", position: 78.5 },        // ~27
        { label: "İmkansız", position: 93 }          // ~29
    ];

    const ticks = Array.from({ length: maxScale - minScale + 1 }, (_, i) => minScale + i);

    return (
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl w-full relative z-10 transition-all">
            <h3 className="text-white text-lg font-bold mb-14 text-center drop-shadow-sm flex items-center justify-center gap-2">
                Gelişim Referans Skalası
                <span className={`text-xs px-3 py-1 rounded-full tracking-widest uppercase font-black ${type === 'FFMI' ? 'bg-purple-600 text-purple-50' : 'bg-emerald-600 text-emerald-50'}`}>
                    {type}
                </span>
            </h3>

            <div className="relative pt-6 pb-12 px-2 max-w-5xl mx-auto">

                {/* Durak Noktaları (Kategoriler üstte) */}
                <div className="absolute top-[-25px] w-full h-px hidden md:block">
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            className="absolute flex flex-col items-center -translate-x-1/2"
                            style={{ left: `${cat.position}%` }}
                        >
                            <span className="text-indigo-50 font-bold text-xs whitespace-nowrap drop-shadow-md">
                                {cat.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Yüzey Pürüzsüz Gradient Bar */}
                <div className="relative w-full h-5 rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-blue-500 to-purple-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] z-10 border border-white/10 overflow-hidden">
                    {/* Parlama Efekti */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-full"></div>
                </div>

                {/* Pointer (Ok ve Değer) */}
                <div
                    className="absolute -top-3 w-10 flex flex-col items-center transition-all duration-700 ease-out z-30"
                    style={{ left: `calc(${percent}% - 1.25rem)` }}
                >
                    <div className="bg-white text-indigo-900 font-black text-sm py-1.5 px-3 rounded-lg shadow-xl shadow-indigo-900/50 whitespace-nowrap mb-[2px] border-b-4 border-indigo-500">
                        {score.toFixed(1)}
                    </div>
                    {/* Aşağıya bakan ok üçgeni */}
                    <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-indigo-500 drop-shadow-lg"></div>
                </div>

                {/* Cetvel Çentikleri ve Sayılar (Barın Altında) */}
                <div className="relative w-full h-px mt-2 flex justify-between">
                    {ticks.map((tick) => {
                        const tickPercent = ((tick - minScale) / (maxScale - minScale)) * 100;
                        const isEven = isBMI ? tick % 5 === 0 : true; // BMI için çok sayı var
                        return (
                            <div
                                key={tick}
                                className="absolute flex flex-col items-center -translate-x-1/2"
                                style={{ left: `${tickPercent}%` }}
                            >
                                {/* Dikey kılavuz çizgi (Bara bağlanan çentik) */}
                                {isEven && <div className="w-0.5 h-2 bg-white/40 mb-1"></div>}

                                {isEven && (
                                    <span className="text-indigo-200/90 font-bold text-[10px] sm:text-xs">
                                        {tick}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
