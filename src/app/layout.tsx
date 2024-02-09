import type { Metadata } from "next";
import { Josefin_Sans, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "./theme-provider";

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
        className={`${jost.variable} ${josefin_Sans.variable}  ${playfair_Display.variable}`}
      >
        <ThemeProviders>
          <main>{children}</main>
        </ThemeProviders>
      </body>
    </html>
  );
}
