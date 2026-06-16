import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenith Trader | Pocket Options",
  description: "Real-time forex trading signals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0d1117", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
