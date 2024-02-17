import type { Metadata } from "next";
import { Josefin_Sans, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "./theme-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const jost = Jost({
	subsets: ["latin"],
	variable: "--font-jost",
	display: "swap",
});

const josefin_Sans = Josefin_Sans({
	subsets: ["latin"],
	variable: "--font-josefin_Sans",
	display: "swap",
});
const playfair_Display = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair_Display",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Monkeys",
	description: "We are the Monkeys!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${jost.variable} ${josefin_Sans.variable}  ${playfair_Display.variable} bg-primary-monkeyWhite dark:bg-primary-monkeyBlack`}
			>
				<ThemeProviders>
					<Navbar />
					<main>{children}</main>
					<Footer />
				</ThemeProviders>
			</body>
		</html>
	);
}
