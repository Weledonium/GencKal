"use client";

// 1. Core / React Imports
import React, { useState, useMemo } from "react";

// 2. Types & Interfaces
import {
    KullaniciProfil,
    Cinsiyet,
    AktiviteSeviyesi,
    Hedef,
} from "../types";

// 3. Utilities / Calculations
import { calculateBMI, calculateDetailedFFMI, calculateTDEE } from "../utils/calculations";

// 4. Components
import InputPanel from "./InputPanel";
import ResultsPanel from "./ResultsPanel";
import TargetSimulator from "./TargetSimulator";
import ReferenceScale from "./ReferenceScale";
import EducationalSection from "./EducationalSection";
import TDEECalculatorPanel from "./TDEECalculatorPanel";

export default function OnboardingForm() {
    const [step, setStep] = useState<number>(1);
    const [errorLine, setErrorLine] = useState<string | null>(null);

    const [formData, setFormData] = useState<KullaniciProfil>({
        fizikselVeriler: {
            boy: 175,
            kilo: 75,
            yas: 25,
            cinsiyet: "erkek" as Cinsiyet,
            yagOrani: 15,
            aktiviteSeviyesi: "hareketsiz (ofis işi)" as AktiviteSeviyesi,
            agirlikCalisiyorMu: false,
        },
        diyetVerileri: {
            diyetTipi: "standart",
            ogunSayisi: 3,
            alerjenler: [],
            kullanilanTakviyeler: [],
            hedef: "kilo_koruma" as Hedef,
        },
    });

    const { boy, kilo, yas, yagOrani } = formData.fizikselVeriler;

    // --- ANLIK HESAPLAMALAR (Real-time Calculations) ---
    const calculatedBMI = useMemo(() => calculateBMI(boy, kilo), [boy, kilo]);
    const { leanMass, ffmi: rawFFMI, normalizedFfmi: calculatedFFMI } = useMemo(
        () => calculateDetailedFFMI(boy, kilo, yagOrani),
        [boy, kilo, yagOrani]
    );
    const calculatedTDEE = useMemo(
        () => calculateTDEE(formData.fizikselVeriler),
        [formData.fizikselVeriler]
    );

    // --- ETKİLEŞİM YÖNETİCİLERİ (Handlers) ---
    const handleFizikselChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: string | number | boolean = value;

        if (type === "number" || type === "range") finalValue = Number(value);
        else if (type === "checkbox") finalValue = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            fizikselVeriler: { ...prev.fizikselVeriler, [name]: finalValue }
        }));
    };

    const setFizikselAlan = <K extends keyof KullaniciProfil["fizikselVeriler"]>(
        name: K,
        value: KullaniciProfil["fizikselVeriler"][K]
    ) => {
        setFormData(prev => ({
            ...prev,
            fizikselVeriler: { ...prev.fizikselVeriler, [name]: value }
        }));
    };

    const handleProceedToDiet = () => {
        if (boy < 100 || boy > 230 || kilo < 30 || kilo > 300 || yas < 15 || yas > 100) {
            setErrorLine("Lütfen fiziksel değerlerinizi kontrol edin (Boy: 100-230, Kilo: 30-300, Yaş: 15-100).");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setErrorLine(null);
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen font-sans bg-white flex flex-col">
            {step === 1 ? (
                <div className="animate-fade-in flex flex-col w-full">

                    {/* --- STEP 1 Header (Solid Renk, Seamless Görünüm) --- */}
                    <header className="sticky top-0 z-50 w-full flex justify-between items-center py-3 px-6 md:px-12 bg-[#3E3AAF] text-white font-medium text-[15px] border-b border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-4 bg-white rounded-full"></div>
                                <div className="w-1.5 h-6 bg-white rounded-full"></div>
                                <div className="w-1.5 h-4 bg-white rounded-full"></div>
                            </div>
                            genckalcalculator
                        </div>
                        <div className="hidden sm:flex items-center gap-6">
                            <button
                                onClick={handleProceedToDiet}
                                className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] text-sm tracking-wide"
                            >
                                Diyet Planı Oluştur
                            </button>
                            <a href="#" className="hover:text-indigo-200 transition-colors text-sm">İletişim</a>
                        </div>
                    </header>

                    {/* --- ÜST BÖLÜM (Fiziksel Veriler ve Dashboard) --- */}
                    <section className="bg-[#3E3AAF] text-white relative pb-6">

                        {/* Ana İçerik */}
                        <div className="w-full mx-auto z-10 flex flex-col items-center mt-2 md:mt-4 px-4">

                            <div className="text-center mb-4">
                                <h1 className="text-[32px] sm:text-[38px] font-normal tracking-wide text-white drop-shadow-sm mb-1 font-sans">
                                    GençKal Calculator
                                </h1>
                                <p className="text-[14px] sm:text-[15px] text-[#e0e7ff] font-light tracking-wide">
                                    Sağlık metriklerinizi ve yağsız vücut kütlenizi belirleyin
                                </p>
                            </div>

                            {errorLine && (
                                <div className="w-full max-w-[900px] mb-2 p-3 bg-red-500/20 border border-red-500/50 text-white rounded-xl text-center text-sm font-bold animate-pulse">
                                    {errorLine}
                                </div>
                            )}

                            {/* Dashboard Kartları */}
                            <div className="relative flex flex-col xl:flex-row justify-center items-center xl:items-stretch gap-6 mt-2 w-full mb-4 max-w-[1400px] mx-auto">
                                <div className="relative flex flex-col md:flex-row w-full max-w-4xl justify-center items-center md:items-stretch">
                                    <div className="z-20 w-full md:w-auto flex justify-center md:justify-end">
                                        <ResultsPanel
                                            calculatedBMI={calculatedBMI}
                                            leanMass={leanMass}
                                            bodyFat={yagOrani || 0}
                                            kilo={kilo}
                                            ffmi={rawFFMI}
                                            normalizedFfmi={calculatedFFMI}
                                        />
                                    </div>
                                    <div className="z-10 w-full md:w-auto md:-ml-12 mt-6 md:mt-0 flex justify-center md:justify-start">
                                        <InputPanel
                                            data={formData.fizikselVeriler}
                                            handleChange={handleFizikselChange}
                                            setField={setFizikselAlan}
                                        />
                                    </div>
                                </div>
                                {kilo > 0 && yagOrani > 0 && (
                                    <div className="z-20 w-full xl:w-auto flex justify-center">
                                        <TargetSimulator
                                            currentWeight={kilo}
                                            leanMass={leanMass}
                                            currentBodyFat={yagOrani}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Referans Skalası */}
                        <div className="w-full relative z-20 mt-2 pb-16 px-4">
                            <ReferenceScale
                                score={calculatedFFMI > 0 ? calculatedFFMI : calculatedBMI}
                                type={calculatedFFMI > 0 ? "FFMI" : "BMI"}
                                gender={formData.fizikselVeriler.cinsiyet}
                            />
                        </div>
                    </section>

                    {/* --- ALT BÖLÜM (Beyaz Eğitim Alanı) --- */}
                    <div className="relative z-30 w-full bg-white pt-8 -mt-7 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
                        <EducationalSection />
                    </div>

                </div>
            ) : (
                /* --- 2. ADIM (TDEE ve Kalori Planları) --- */
                <div className="flex-1 bg-gray-50 flex flex-col min-h-screen animate-fade-in-up">

                    {/* --- STEP 2 HEADER (Adım 1 ile Tamamen Aynı Tasarım) --- */}
                    <header className="w-full flex justify-between items-center py-3 px-6 md:px-12 bg-[#3E3AAF] text-white font-medium text-[15px] border-b border-white/10 z-20 relative">
                        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-4 bg-white rounded-full"></div>
                                <div className="w-1.5 h-6 bg-white rounded-full"></div>
                                <div className="w-1.5 h-4 bg-white rounded-full"></div>
                            </div>
                            genckalcalculator
                        </div>
                        <div className="hidden sm:flex items-center gap-6">
                            <button
                                onClick={() => setStep(1)}
                                className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] text-sm tracking-wide flex items-center gap-2"
                            >
                                <span>&larr;</span> Ana Sayfa
                            </button>
                            <a href="#" className="hover:text-indigo-200 transition-colors text-sm">İletişim</a>
                        </div>
                    </header>

                    {/* --- STEP 2 İÇERİK --- */}
                    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-[1200px] mx-auto flex flex-col gap-10 items-center">

                            {/* TDEE Hesaplayıcı Paneli */}
                            <div className="w-full">
                                <TDEECalculatorPanel
                                    data={formData.fizikselVeriler}
                                    handleChange={handleFizikselChange}
                                    setField={setFizikselAlan}
                                />
                            </div>

                            {/* Devasa TDEE Gösterimi */}
                            <div className="flex flex-col items-center text-center mt-6">
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
                                    Günlük Enerji İhtiyacınız
                                </h2>
                                <p className="text-indigo-600 font-black text-6xl md:text-7xl drop-shadow-sm flex items-baseline gap-3">
                                    {calculatedTDEE} <span className="text-xl md:text-2xl font-medium text-gray-500">kcal / gün</span>
                                </p>
                                <p className="text-gray-500 mt-4 max-w-lg text-sm md:text-base">
                                    Amacınıza uygun olan planı seçerek kişiselleştirilmiş diyet programınızı (Yapay Zeka ile) oluşturmaya başlayın.
                                </p>
                            </div>

                            {/* 3'lü SaaS Tarzı Fiyatlandırma/Plan Kartları */}
                            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 z-10 mt-4">

                                {/* Kilo Al */}
                                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:border-indigo-400 hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-6">📈</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Kilo Al (Bulking)</h3>
                                    <p className="text-indigo-600 font-black text-3xl mb-4">
                                        {calculatedTDEE + 500} <span className="text-sm text-gray-400 font-medium">kcal</span>
                                    </p>
                                    <p className="text-gray-500 text-sm mb-8 flex-1">
                                        Kas kütlenizi artırmak için günlük ihtiyacınızdan güvenli bir şekilde ~500 kcal fazlasını alın.
                                    </p>
                                    <button className="w-full py-4 rounded-xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-600 hover:text-white transition-colors">
                                        Bu Planı Seç
                                    </button>
                                </div>

                                {/* Kilo Koru */}
                                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-indigo-500 flex flex-col items-center text-center hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative">
                                    <div className="absolute -top-4 bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                                        MEVCUT DURUM
                                    </div>
                                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-6">⚖️</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Kilo Koru (Maintain)</h3>
                                    <p className="text-indigo-600 font-black text-3xl mb-4">
                                        {calculatedTDEE} <span className="text-sm text-gray-400 font-medium">kcal</span>
                                    </p>
                                    <p className="text-gray-500 text-sm mb-8 flex-1">
                                        Mevcut kilonuzu ve formunuzu korumak için günlük tam olarak enerji ihtiyacınız kadar kalori alın.
                                    </p>
                                    <button className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md transition-colors">
                                        Bu Planı Seç
                                    </button>
                                </div>

                                {/* Kilo Ver */}
                                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:border-indigo-400 hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-6">📉</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Kilo Ver (Cutting)</h3>
                                    <p className="text-indigo-600 font-black text-3xl mb-4">
                                        {calculatedTDEE - 500} <span className="text-sm text-gray-400 font-medium">kcal</span>
                                    </p>
                                    <p className="text-gray-500 text-sm mb-8 flex-1">
                                        Sağlıklı yağ yakımı için günlük ihtiyacınızdan ~500 kcal daha az alarak kalori açığı yaratın.
                                    </p>
                                    <button className="w-full py-4 rounded-xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-600 hover:text-white transition-colors">
                                        Bu Planı Seç
                                    </button>
                                </div>

                            </div>

                            {/* Alt Kısım Geri Dönüş (Mobilde de rahat dönülebilmesi için) */}
                            <button
                                onClick={() => setStep(1)}
                                className="sm:hidden text-gray-400 hover:text-gray-700 font-bold transition-colors z-10 flex items-center gap-2 mt-4"
                            >
                                <span>&larr;</span> Ana Sayfa
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}