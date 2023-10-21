import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";

import SessionProvider from "./components/SessionProvider";
import { LobbyProvider } from "./context/LobbyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Color With Me",
  description: "Color with your friends!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <LobbyProvider>
        <SessionProvider session={session}>
          <body className={inter.className}>{children}</body>
        </SessionProvider>
      </LobbyProvider>
    </html>
  );
}
