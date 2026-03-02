export type Cinsiyet = 'erkek' | 'kadın';
export type AktiviteSeviyesi = 'hareketsiz (ofis işi)' | 'hafif egzersiz (haftada 1-2 gün)' | 'orta düzey egzersiz (haftada 3-5 gün)' |
    'yoğun egzersiz (haftada 6-7 gün)' | 'atlet (günde 2 kez egzersiz)';
export type Hedef = 'kilo_alma' | 'kilo_verme' | 'kilo_koruma';

export interface FizikselVeriler {
    boy: number; // cm
    kilo: number; // kg
    yas: number;
    cinsiyet: Cinsiyet;
    yagOrani?: number; // Yüzde, opsiyonel (FFMI için)
    aktiviteSeviyesi: AktiviteSeviyesi;
    agirlikCalisiyorMu: boolean;
}

export interface DiyetVerileri {
    diyetTipi: string;
    ogunSayisi: number;
    alerjenler: string[];
    kullanilanTakviyeler: string[];
    hedef: Hedef;
}

export interface KullaniciProfil {
    fizikselVeriler: FizikselVeriler;
    diyetVerileri: DiyetVerileri;
}
