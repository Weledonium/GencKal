"use client";

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
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto z-10 relative">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md mb-4">
                        GencKal Calculator
                    </h1>
                    <p className="mt-2 text-indigo-200 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                    </p>
                </div>

                {errorLine && (
                    <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 text-white rounded-xl text-center text-sm font-bold animate-pulse">
                        {errorLine}
                    </div>
                )}

                {step === 1 ? (
                    <div className="animate-fade-in flex flex-col">

                        {/* ASYMMETRIC CARDS */}
                        <div className="relative flex flex-col md:flex-row mt-6 md:mt-16 w-full mb-8 md:mb-12">
                            <ResultsPanel
                                calculatedBMI={calculatedBMI}
                                leanMass={leanMass}
                                bodyFat={yagOrani || 0}
                            />
                            <InputPanel
                                data={formData.fizikselVeriler}
                                handleChange={handleFizikselChange}
                                setField={setFizikselAlan}
                            />
                        </div>

                        {/* ALT SKALA (Gradient Bar) */}
                        <ReferenceScale
                            score={calculatedFFMI > 0 ? calculatedFFMI : calculatedBMI}
                            type={calculatedFFMI > 0 ? "FFMI" : "BMI"}
                            gender={formData.fizikselVeriler.cinsiyet}
                        />

                        {/* BİLGİLENDİRME METİNLERİ VE TABLOLAR */}
                        <div className="max-w-7xl mx-auto mt-16 bg-white/95 rounded-2xl p-8 md:p-12 text-gray-800 shadow-2xl mb-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                                {/* --- SOL KOLON: BMI BÖLÜMÜ --- */}
                                <section>
                                    <h2 className="text-3xl font-bold mb-4 text-center text-indigo-900">BMI (Vücut Kitle İndeksi) Nedir?</h2>
                                    <p className="mb-6 leading-relaxed">
                                        BMI, boyunuza ve kilonuza dayanarak zayıflık veya şişmanlık derecenizi ölçen, doku kütlesini ölçmeyi amaçlayan bir hesaplamadır. Bir kişinin boyuna göre sağlıklı bir vücut ağırlığına sahip olup olmadığının genel bir göstergesi olarak yaygın şekilde kullanılır.
                                    </p>

                                    <h3 className="text-xl font-semibold mb-3 text-indigo-800">Yetişkinler İçin BMI Tablosu (DSÖ)</h3>
                                    <div className="overflow-x-auto mb-8">
                                        <table className="w-full text-left border-collapse whitespace-nowrap">
                                            <thead>
                                                <tr className="border-b-2 border-indigo-200 bg-indigo-50">
                                                    <th className="p-3">Sınıflandırma</th>
                                                    <th className="p-3">BMI Aralığı (kg/m²)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b"><td className="p-3">İleri Derece Zayıflık</td><td className="p-3">&lt; 16</td></tr>
                                                <tr className="border-b bg-gray-50"><td className="p-3">Orta Derece Zayıflık</td><td className="p-3">16 - 17</td></tr>
                                                <tr className="border-b"><td className="p-3">Hafif Zayıflık</td><td className="p-3">17 - 18.5</td></tr>
                                                <tr className="border-b bg-green-50 font-semibold text-green-800"><td className="p-3">Normal</td><td className="p-3">18.5 - 25</td></tr>
                                                <tr className="border-b bg-yellow-50"><td className="p-3">Fazla Kilolu</td><td className="p-3">25 - 30</td></tr>
                                                <tr className="border-b bg-orange-50"><td className="p-3">Obez (1. Derece)</td><td className="p-3">30 - 35</td></tr>
                                                <tr className="border-b bg-red-50"><td className="p-3">Obez (2. Derece)</td><td className="p-3">35 - 40</td></tr>
                                                <tr className="bg-red-100 text-red-900 font-semibold"><td className="p-3">Aşırı Obez (3. Derece)</td><td className="p-3">&gt; 40</td></tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3 text-indigo-800">BMI'nin Sınırları</h3>
                                    <p className="mb-4 leading-relaxed text-sm">
                                        BMI sağlıklı vücut ağırlığını belirlemek için yaygın olsa da, kas ve yağ oranını dikkate almayan sadece bir tahmindir.
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 mb-8 text-sm text-gray-700">
                                        <li><strong>Sporcular:</strong> Kas yağdan daha ağır olduğu için yüksek kas kütlesine sahip kişiler BMI'ye göre "Obez" çıkabilir, ancak aslında son derece sağlıklıdırlar.</li>
                                        <li><strong>Yaşlı Yetişkinler:</strong> Aynı BMI değerine sahip gençlere kıyasla daha fazla vücut yağına sahip olma eğilimindedirler.</li>
                                    </ul>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 text-red-700">Fazla Kilo Riskleri</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
                                                <li>Yüksek tansiyon ve kolesterol</li>
                                                <li>Tip II diyabet</li>
                                                <li>Koroner kalp hastalığı</li>
                                                <li>Uyku apnesi</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 text-yellow-600">Düşük Kilo Riskleri</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
                                                <li>Yetersiz beslenme ve anemi</li>
                                                <li>Osteoporoz (Kemik erimesi)</li>
                                                <li>Zayıf bağışıklık sistemi</li>
                                                <li>Büyüme sorunları</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* --- SAĞ KOLON: FFMI BÖLÜMÜ --- */}
                                <section>
                                    <h2 className="text-3xl font-bold mb-4 text-center text-indigo-900">FFMI Nedir?</h2>
                                    <p className="mb-6 leading-relaxed">
                                        FFMI (Yağsız Vücut Kütlesi İndeksi), boyunuza oranla ne kadar kas kütlesine sahip olduğunuzu hesaplamanızı sağlayan bir indekstir. Bu indeks, vücut geliştiriciler ve sporcular tarafından gelişimlerini takip etmek için yaygın olarak kullanılır ve BMI'ye göre çok daha güvenilirdir.
                                    </p>

                                    <h3 className="text-xl font-semibold mb-3 text-indigo-800">FFMI Formülü</h3>
                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-8 font-mono text-xs sm:text-sm">
                                        <p>Vücut Yağı = Kilo * (Yağ Oranı [%] / 100)</p>
                                        <p>Yağsız Kütle = Kilo - Vücut Yağı</p>
                                        <p>FFMI = Yağsız Kütle (kg) / Boy (m)<sup>2</sup></p>
                                        <p className="mt-2 text-indigo-600 font-bold">Norm. FFMI = FFMI + 6.1 * (1.8 - Boy (m))</p>
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3 text-indigo-800">Erkekler İçin FFMI Skorları</h3>
                                    <div className="overflow-x-auto mb-8">
                                        <table className="w-full text-left border-collapse whitespace-nowrap">
                                            <thead>
                                                <tr className="border-b-2 border-indigo-200">
                                                    <th className="p-3">FFMI</th>
                                                    <th className="p-3">Yağ Oranı</th>
                                                    <th className="p-3">Açıklama</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                <tr className="border-b"><td className="p-3 font-semibold">17-18</td><td className="p-3">10-18%</td><td className="p-3">Zayıf</td></tr>
                                                <tr className="border-b bg-gray-50"><td className="p-3 font-semibold">18-20</td><td className="p-3">20-27%</td><td className="p-3">Ortalama</td></tr>
                                                <tr className="border-b"><td className="p-3 font-semibold">19-21</td><td className="p-3">25-40%</td><td className="p-3">Kilolu</td></tr>
                                                <tr className="border-b bg-gray-50"><td className="p-3 font-semibold">20-21</td><td className="p-3">10-18%</td><td className="p-3">Sporcu / Orta Seviye</td></tr>
                                                <tr className="border-b"><td className="p-3 font-semibold">22-23</td><td className="p-3">6-12%</td><td className="p-3">İleri Seviye Sporcu</td></tr>
                                                <tr className="border-b bg-gray-50"><td className="p-3 font-semibold">24-25</td><td className="p-3">8-20%</td><td className="p-3">Vücut Geliştirici</td></tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3 text-indigo-800">Kadınlar İçin FFMI Skorları</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse whitespace-nowrap">
                                            <thead>
                                                <tr className="border-b-2 border-indigo-200">
                                                    <th className="p-3">FFMI</th>
                                                    <th className="p-3">Yağ Oranı</th>
                                                    <th className="p-3">Açıklama</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                <tr className="border-b"><td className="p-3 font-semibold">14-15</td><td className="p-3">20-25%</td><td className="p-3">Zayıf</td></tr>
                                                <tr className="border-b bg-gray-50"><td className="p-3 font-semibold">14-17</td><td className="p-3">22-35%</td><td className="p-3">Ortalama</td></tr>
                                                <tr className="border-b"><td className="p-3 font-semibold">15-18</td><td className="p-3">30-45%</td><td className="p-3">Kilolu</td></tr>
                                                <tr className="border-b bg-gray-50"><td className="p-3 font-semibold">16-17</td><td className="p-3">18-25%</td><td className="p-3">Sporcu / Orta Seviye</td></tr>
                                                <tr className="border-b"><td className="p-3 font-semibold">18-20</td><td className="p-3">15-22%</td><td className="p-3">İleri Seviye Sporcu</td></tr>
                                                <tr className="border-b bg-gray-50"><td className="p-3 font-semibold">19-21</td><td className="p-3">15-30%</td><td className="p-3">Vücut Geliştirici</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                            </div>
                        </div>

                        {/* AŞAMA 2'YE GEÇİŞ BUTONU */}
                        <div className="mt-16 text-center pb-8 border-t border-white/10 pt-16">
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
                        </div>
                    </div>
                ) : (
                    // DİYET & TAKVİYE FORMU (ADIM 2)
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
                                        Alerjenler <span className="text-[10px] text-gray-400 normal-case">(Virgülle ayırın, Opsiyonel)</span>
                                    </label>
                                    <input name="alerjenler" type="text" placeholder="Yer Fıstığı, Süt..." value={formData.diyetVerileri.alerjenler.join(", ")} onChange={(e) => handleArrayChange(e, "alerjenler")} className="border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-700 bg-gray-50 hover:bg-white" />
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Kullanılan Takviyeler <span className="text-[10px] text-gray-400 normal-case">(Virgülle ayırın, Opsiyonel)</span>
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
                )}
            </div>
        </div>
    );
}
