"use client";
import EducationalSection from "./EducationalSection";
import TargetSimulator from "./TargetSimulator";

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

                    {/* --- ÜST BÖLÜM --- */}
                    <section className="bg-[#3E3AAF] text-white pb-2 relative overflow-hidden">
                        {/* Mock Navbar */}
                        <header className="w-full flex justify-between items-center py-4 px-6 md:px-12 text-white font-medium text-[15px] border-b border-white/10">
                            <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-5 bg-white rounded-full"></div>
                                    <div className="w-1.5 h-7 bg-white rounded-full"></div>
                                    <div className="w-1.5 h-5 bg-white rounded-full"></div>
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
                                <a href="#" className="hover:text-indigo-200 transition-colors text-sm">Contacts</a>
                            </div>
                        </header>

                        <div className="w-full mx-auto z-10 flex flex-col items-center mt-4 md:mt-8 px-4">

                            {/* Main Title */}
                            <div className="text-center mb-8 mt-2">
                                <h1 className="text-[38px] sm:text-[44px] font-normal tracking-wide text-white drop-shadow-sm mb-2 font-sans">
                                    GençKal Calculator
                                </h1>
                                <p className="text-[15px] sm:text-[16px] text-[#e0e7ff] font-light tracking-wide">
                                    Sağlık metriklerinizi ve yağsız vücut kütlenizi belirleyin
                                </p>
                            </div>

                            {errorLine && (
                                <div className="w-full max-w-[900px] mb-4 p-4 bg-red-500/20 border border-red-500/50 text-white rounded-xl text-center text-sm font-bold animate-pulse">
                                    {errorLine}
                                </div>
                            )}

                            {/* DASHBOARD LAYOUT: SOLDA ANALİZ+FORM, SAĞDA SİMÜLATÖR */}
                            <div className="relative flex flex-col xl:flex-row justify-center items-center xl:items-stretch gap-8 mt-4 md:mt-8 w-full mb-6 md:mb-8 max-w-[1400px] mx-auto">

                                {/* Sol Grup: Canlı Analiz ve Beyaz Form (Eski Asimetrik Yapı) */}
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
                                        <InputPanel data={formData.fizikselVeriler} handleChange={handleFizikselChange} setField={setFizikselAlan} />
                                    </div>
                                </div>

                                {/* Sağ Grup: Hedef Simülatörü */}
                                {kilo > 0 && yagOrani > 0 && (
                                    <div className="z-20 w-full xl:w-auto flex justify-center">
                                        <TargetSimulator currentWeight={kilo} leanMass={leanMass} currentBodyFat={yagOrani} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ALT SKALA */}
                        <div className="w-full relative z-20 -mt-6 md:-mt-10 pb-20 md:pb-32">
                            <ReferenceScale score={calculatedFFMI > 0 ? calculatedFFMI : calculatedBMI} type={calculatedFFMI > 0 ? "FFMI" : "BMI"} gender={formData.fizikselVeriler.cinsiyet} />
                        </div>
                    </section>

                    {/* --- ALT BÖLÜM (BEYAZ EĞİTİM ALANI) --- */}
                    <div className="relative z-30 w-full bg-white shadow-[0_-25px_50px_rgba(0,0,0,0.15)] -mt-16 md:-mt-32 pt-8">
                        <EducationalSection />
                    </div>

                </div>
            ) : (
                /* --- 2. ADIM (DİYET FORMU) --- */
                <div className="flex-1 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto bg-white text-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10 animate-fade-in relative z-20 top-8">
                        <form onSubmit={handleSubmitFinal} className="space-y-8">
                            <h2 className="text-3xl font-black text-center text-gray-900 border-b border-gray-100 pb-6">
                                Diyet ve Takviye Tercihleri
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Cinsiyet</label>
                                    <select name="cinsiyet" value={formData.fizikselVeriler.cinsiyet} onChange={handleFizikselChange} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-0 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white hover:border-indigo-300">
                                        <option value="erkek">Erkek</option>
                                        <option value="kadin">Kadın</option>
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Yaşınız</label>
                                    <input name="yas" type="number" min="15" max="100" value={formData.fizikselVeriler.yas} onChange={handleFizikselChange} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white" required />
                                </div>

                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Aktivite Seviyesi</label>
                                    <select name="aktiviteSeviyesi" value={formData.fizikselVeriler.aktiviteSeviyesi} onChange={handleFizikselChange} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-0 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white hover:border-indigo-300">
                                        <option value="hareketsiz (ofis işi)">Hareketsiz (Ofis İşi)</option>
                                        <option value="hafif egzersiz (haftada 1-2 gün)">Hafif Egzersiz (1-2 Gün)</option>
                                        <option value="orta düzey egzersiz (haftada 3-5 gün)">Orta Düzey (3-5 Gün)</option>
                                        <option value="yoğun egzersiz (haftada 6-7 gün)">Yoğun Egzersiz (6-7 Gün)</option>
                                        <option value="atlet (günde 2 kez egzersiz)">Atlet (Günde 2 Kez)</option>
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ağırlık Antrenmanı</label>
                                    <label className="flex items-center gap-3 border-2 border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white transition-all cursor-pointer h-full">
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" name="agirlikCalisiyorMu" checked={formData.fizikselVeriler.agirlikCalisiyorMu} onChange={handleFizikselChange} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </div>
                                        <span className="font-semibold text-gray-700 text-sm">Aktif olarak ağırlık kaldırıyorum</span>
                                    </label>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Temel Hedef</label>
                                    <select name="hedef" value={formData.diyetVerileri.hedef} onChange={handleDiyetChange} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-0 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white hover:border-indigo-300">
                                        <option value="kilo_alma">Kilo Alma (Bulking)</option>
                                        <option value="kilo_verme">Kilo Verme (Cutting)</option>
                                        <option value="kilo_koruma">Kilo Koruma (Maintaining)</option>
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Beslenme Tipi</label>
                                    <input name="diyetTipi" type="text" placeholder="Standart, Vegan, Keto..." value={formData.diyetVerileri.diyetTipi} onChange={handleDiyetChange} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white" required />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Günlük Öğün Sayısı</label>
                                    <input name="ogunSayisi" type="number" min="1" max="8" value={formData.diyetVerileri.ogunSayisi} onChange={handleDiyetChange} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white" required />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Alerjenler</label>
                                    <input name="alerjenler" type="text" placeholder="Yer Fıstığı, Süt..." value={formData.diyetVerileri.alerjenler.join(", ")} onChange={(e) => handleArrayChange(e, "alerjenler")} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white" />
                                </div>

                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kullanılan Takviyeler</label>
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