import React from "react";

interface ResultsPanelProps {
    calculatedBMI: number;
    leanMass: number;
    bodyFat: number;
}

export default function ResultsPanel({ calculatedBMI, leanMass, bodyFat }: ResultsPanelProps) {
    // BMI'ye Göre Kategori ve Renk Hesaplama
    let bmiLabel = "Normal";
    let strokeColorClass = "text-emerald-500";

    if (calculatedBMI > 0) {
        if (calculatedBMI < 18.5) {
            bmiLabel = "Zayıf";
            strokeColorClass = "text-red-500";
        } else if (calculatedBMI < 25) {
            bmiLabel = "Normal";
            strokeColorClass = "text-emerald-500";
        } else if (calculatedBMI < 30) {
            bmiLabel = "Fazla Kilolu";
            strokeColorClass = "text-amber-500";
        } else {
            bmiLabel = "Obez";
            strokeColorClass = "text-red-600";
        }
    }

    // 40 max referans BMI
    const progressPercent = calculatedBMI > 0 ? Math.min(100, Math.max(0, (calculatedBMI / 40) * 100)) : 0;
    const dashOffset = 251.2 - (251.2 * progressPercent) / 100;

    return (
        <div className="h-fit md:absolute md:top-[-2rem] md:left-0 w-full md:w-[20rem] lg:w-[21rem] bg-indigo-900/95 text-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-5 z-20 border border-indigo-500/30 backdrop-blur-xl mb-8 md:mb-0 transition-transform hover:-translate-y-1">
            <h3 className="text-center text-indigo-300 text-xs font-bold tracking-widest uppercase mb-4">Canlı Analiz</h3>

            {/* Dairesel İlerleme Çubuğu SVG */}
            <div className="relative w-36 h-36 mx-auto mb-4 bg-indigo-950/20 rounded-full shadow-inner">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-indigo-950 opacity-60" />
                    <circle
                        cx="50" cy="50" r="40"
                        stroke="currentColor"
                        strokeWidth="8" fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        className={`${strokeColorClass} transition-all duration-700 ease-out`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black drop-shadow-sm transition-colors duration-700 ${strokeColorClass}`}>
                        {calculatedBMI > 0 ? calculatedBMI.toFixed(1) : "0.0"}
                    </span>
                    <span className="text-[10px] text-indigo-200 mt-1 font-bold tracking-widest uppercase text-center">
                        BMI SKORU
                    </span>
                </div>
            </div>

            {/* Alt Metrikler - Kapsamlı 4 Satır Planı */}
            <div className="space-y-3 border-t border-indigo-700/50 pt-5">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-indigo-300 font-medium tracking-wide">Beden Kitle İndeksi</span>
                    <span className="font-bold text-base">{calculatedBMI > 0 ? calculatedBMI : '--'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-indigo-300 font-medium tracking-wide">BMI Durumu</span>
                    <span className={`font-black text-xs sm:text-sm uppercase transition-colors duration-700 ${strokeColorClass}`}>
                        {calculatedBMI > 0 ? bmiLabel : '--'}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-indigo-300 font-medium tracking-wide">Yağsız Vücut Kütlesi</span>
                    <span className="font-bold text-base">{leanMass > 0 ? leanMass : '--'} <span className="text-xs text-indigo-400 ml-0.5">kg</span></span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-indigo-300 font-medium tracking-wide">Vücut Yağ Oranı</span>
                    <span className="font-bold text-base">{bodyFat > 0 ? bodyFat : '--'} <span className="text-xs text-indigo-400 ml-0.5">%</span></span>
                </div>
            </div>
        </div>
    );
}
