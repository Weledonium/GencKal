import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "GencKal",
    description: "Kişiselleştirilmiş Beslenme Planlayıcısı",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <body>{children}</body>
        </html>
    );
}
