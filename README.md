# GençKal Calculator & AI Diet Planner 🚀

GençKal, kullanıcıların Beden Kitle İndeksi (BMI), Yağsız Vücut Kütlesi ve Vücut Yağ Kütlesi gibi önemli sağlık metriklerini hesaplayan, ardından bu verileri kullanarak Yapay Zeka (AI) destekli kişiselleştirilmiş diyet ve takviye planları oluşturan modern bir SaaS platformudur.

## 🌟 Özellikler
* **Canlı Analiz Paneli:** Girilen fiziksel verilere göre anında BMI ve Yağsız Kütle hesaplaması.
* **İnteraktif Skala:** Matematiksel olarak kusursuz hizalanmış referans değerleri.
* **Modern UI/UX:** Zengin gradyanlar, asimetrik kart tasarımları ve cam efekti (glassmorphism) detayları.
* **AI Entegrasyonu:** Kullanıcı verilerine özel diyet planı oluşturma.

## 🛠️ Teknolojiler
* Next.js / React
* Tailwind CSS
* TypeScript

## 📅 Proje İş Kırılım Yapısı (Gantt Şeması)

```mermaid
gantt
    title GençKal AI - 14 Haftalık Geliştirme Takvimi
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b

    section Faz 1: UI & Algoritma
    Planlama & Altyapı       :done,    des1, 2026-02-23, 7d
    UI/UX & Core Algoritma   :done,    des2, 2026-03-02, 7d

    section Faz 2: AI Entegrasyonu
    API & Prompt Müh.        :active,  des3, 2026-03-09, 7d
    LLM & Veri Akışı         :         des4, 2026-03-16, 7d
    Sonuç Ekranı (UI)        :         des5, 2026-03-23, 7d

    section Faz 3: Backend
    Veritabanı Kurulumu      :         des6, 2026-03-30, 7d
    Kullanıcı Doğrulama (Auth):         des7, 2026-04-06, 7d

    section Faz 4: Optimizasyon
    AI Optimizasyonu         :         des8, 2026-04-13, 7d
    Dışa Aktarım (PDF/Mail)  :         des9, 2026-04-20, 7d
    QA & Hata Ayıklama       :         des10, 2026-04-27, 7d

    section Faz 5: Canlıya Alma
    Deploy Süreci            :         des11, 2026-05-04, 7d
    Beta Testi               :         des12, 2026-05-11, 7d
    Dokümantasyon            :         des13, 2026-05-18, 7d
    Proje Savunması          :         des14, 2026-05-25, 7d