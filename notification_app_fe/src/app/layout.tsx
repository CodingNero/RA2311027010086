import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "./Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Campus Notifications",
    description: "Campus notification platform",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className} style={{ margin: 0, padding: 0, boxSizing: "border-box", background: "#060c14" }}>
                <Navigation />
                {children}
            </body>
        </html>
    );
}