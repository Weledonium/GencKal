"use client";
import EducationalSection from "./EducationalSection";

import React, { useState, useMemo } from "react";
import {
    KullaniciProfil,
    Cinsiyet,
    AktiviteSeviyesi,
    Hedef,
} from "../types";
import { calculateBMI, calculateDetailedFFMI, calculateTDEE } from "../utils/calculations";
import InputPanel from "./InputPanel";
import ResultsPanel from "./ResultsPanel";
import ReferenceScale from "./ReferenceScale";

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

    // Real-time calculations
    const calculatedBMI = useMemo(() => calculateBMI(boy, kilo), [boy, kilo]);
    const { leanMass, ffmi: rawFFMI, normalizedFfmi: calculatedFFMI } = useMemo(() => calculateDetailedFFMI(boy, kilo, yagOrani), [boy, kilo, yagOrani]);
    const calculatedTDEE = useMemo(() => calculateTDEE(formData.fizikselVeriler), [formData.fizikselVeriler]);

    // Handlers
    const handleFizikselChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: string | number | boolean = value;

        if (type === "number" || type === "range") finalValue = Number(value);
        else if (type === "checkbox") finalValue = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({ ...prev, fizikselVeriler: { ...prev.fizikselVeriler, [name]: finalValue } }));
    };

    const setFizikselAlan = (name: keyof KullaniciProfil["fizikselVeriler"], value: any) => {
        setFormData(prev => ({ ...prev, fizikselVeriler: { ...prev.fizikselVeriler, [name]: value } }));
    };

    const handleDiyetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, diyetVerileri: { ...prev.diyetVerileri, [name]: type === "number" ? Number(value) : value } }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "alerjenler" | "kullanilanTakviyeler") => {
        const arrayValue = e.target.value.split(",").map(item => item.trim()).filter(item => item.length > 0);
        setFormData(prev => ({ ...prev, diyetVerileri: { ...prev.diyetVerileri, [field]: arrayValue } }));
    };

    const handleSubmitFinal = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorLine(null);

        const { ogunSayisi } = formData.diyetVerileri;
        if (ogunSayisi < 1 || ogunSayisi > 8) {
            setErrorLine("Öğün sayısı en az 1, en fazla 8 olabilir.");
            return;
        }

        console.log("Onboarding Tamamlandı! Form JSON:", JSON.stringify(formData, null, 2));
        alert("Planınız oluşturuluyor... (Konsolda çıktı görüntülendi)");
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

                    {/* --- ÜST BÖLÜM (KOYU LACİVERT) --- */}
                    <section className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto z-10 relative">

                            {/* Header */}
                            <div className="text-center mb-12">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md mb-4">
                                    GencKal Calculator
                                </h1>
                            </div>

                            {errorLine && (
                                <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 text-white rounded-xl text-center text-sm font-bold animate-pulse">
                                    {errorLine}
                                </div>
                            )}

                            {/* ASYMMETRIC CARDS */}
                            <div className="relative flex flex-col md:flex-row mt-6 w-full mb-8 md:mb-12">
                                <ResultsPanel calculatedBMI={calculatedBMI} leanMass={leanMass} bodyFat={yagOrani || 0} />
                                <InputPanel data={formData.fizikselVeriler} handleChange={handleFizikselChange} setField={setFizikselAlan} />
                            </div>

                            {/* ALT SKALA (Gradient Bar) */}
                            <ReferenceScale score={calculatedFFMI > 0 ? calculatedFFMI : calculatedBMI} type={calculatedFFMI > 0 ? "FFMI" : "BMI"} gender={formData.fizikselVeriler.cinsiyet} />
                        </div>
                    </section>

                    {/* --- ALT BÖLÜM (BEYAZ) --- */}
                    <EducationalSection />

                    {/* AŞAMA 2'YE GEÇİŞ BUTONU (BEYAZ BÖLÜMÜN EN ALTI) */}
                    <section className="bg-white text-center pb-16 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleProceedToDiet}
                            className="group relative inline-flex items-center justify-center px-12 py-6 font-black tracking-wide text-white rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_15px_40px_rgba(52,211,153,0.4)] hover:shadow-[0_20px_50px_rgba(52,211,153,0.6)] transition-all duration-300 transform hover:-translate-y-1 text-xl w-full sm:w-auto overflow-hidden"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                            <span className="relative">Bana Özel Diyet Planı Oluştur</span>
                            <svg className="relative w-7 h-7 ml-3 transform transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </button>
                    </section>

                </div>
            ) : (
                // --- 2. ADIM (DİYET FORMU) ---
                <div className="flex-1 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto bg-white text-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10 animate-fade-in relative z-20 top-8">
                        <form onSubmit={handleSubmitFinal} className="space-y-8">
                            <h2 className="text-3xl font-black text-center text-gray-900 border-b border-gray-100 pb-6">
                                Diyet ve Takviye Tercihleri
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Temel Hedef</label>
                                    <select name="hedef" value={formData.diyetVerileri.hedef} onChange={handleDiyetChange} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-0 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white hover:border-indigo-300">
                                        <option value="kilo_alma">Kilo Alma (Bulking)</option>
                                        <option value="kilo_verme">Kilo Verme (Cutting)</option>
                                        <option value="kilo_koruma">Kilo Koruma (Maintaining)</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Beslenme Tipi <span className="text-[10px] text-gray-400 normal-case">(Zorunlu)</span>
                                    </label>
                                    <input name="diyetTipi" type="text" placeholder="Standart, Vegan, Keto..." value={formData.diyetVerileri.diyetTipi} onChange={handleDiyetChange} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white" required />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Günlük Öğün Sayısı</label>
                                    <input name="ogunSayisi" type="number" min="1" max="8" value={formData.diyetVerileri.ogunSayisi} onChange={handleDiyetChange} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white" required />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Alerjenler <span className="text-[10px] text-gray-400 normal-case">(Virgülle ayırın)</span>
                                    </label>
                                    <input name="alerjenler" type="text" placeholder="Yer Fıstığı, Süt..." value={formData.diyetVerileri.alerjenler.join(", ")} onChange={(e) => handleArrayChange(e, "alerjenler")} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white" />
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Kullanılan Takviyeler <span className="text-[10px] text-gray-400 normal-case">(Virgülle ayırın)</span>
                                    </label>
                                    <input name="kullanilanTakviyeler" type="text" placeholder="Whey Protein, Kreatin, Omega-3..." value={formData.diyetVerileri.kullanilanTakviyeler.join(", ")} onChange={(e) => handleArrayChange(e, "kullanilanTakviyeler")} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100 mt-8">
                                <button type="button" onClick={() => setStep(1)} className="w-full sm:w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-5 px-4 rounded-2xl transition-all">
                                    ← Vazgeç ve Geri Dön
                                </button>
                                <button type="submit" className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl py-5 px-4 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                                    Planı Tamamla (Konsola Yaz)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}