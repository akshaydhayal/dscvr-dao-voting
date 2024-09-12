"use client";
import React from "react";
import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";
import { CanvasWalletProvider } from "./components/CanvasWalletProvider";
import Container from "./components/container";
import Head from "next/head";
import { useCanvasClient } from "@/lib/useCanvasClient";
import { useResizeObserver } from "@/lib/useResizeObserver";
import { registerCanvasWallet } from "@dscvr-one/canvas-wallet-adapter";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import Navbar from "@/components/Navbar";
import "@solana/wallet-adapter-react-ui/styles.css";

const inter = Inter({ subsets: ["latin"] });
const syne = Syne({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "DAO",
//   description: "Create DAO Voting",
//   openGraph: {
//     title: "DAO",
//     description: "Create DAO Voting - Powered by Solana",
//     type: "website",
//     url: "https://dao-frontend-beta.vercel.app/",
//     images: "https://news.miami.edu/_assets/images-stories/2023/02/dao-web3-hero-940x529.jpg"
//   },
//   other: {
//     'dscvr:canvas:version': "vNext",
//   }
// };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const endpoint = clusterApiUrl("devnet");
  const { client, user, content, isReady } = useCanvasClient();
  useResizeObserver(client);
  if (client) {
    registerCanvasWallet(client);
  }
  return (
    <html lang="en">
      <Head>
        <meta name="dscvr:canvas:version" content="vNext" />
        <meta name="og:image" content="https://my-canvas.com/preview-image.png" />
      </Head>
      <head>
        <meta name="dscvr:canvas:version" content="vNext" />
        <meta name="og:image" content="https://my-canvas.com/preview-image.png" />
      </head>
      <body className="" style={{ height: "700px" }}>
        <div>

        <ConnectionProvider endpoint={endpoint}>
          {/* <WalletProvider wallets={[phantomWallet]} autoConnect> */}
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <Navbar />
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
        </div>
        {/* <AppWalletProvider>
          <CanvasWalletProvider>
            <Container>{children}</Container>
          </CanvasWalletProvider>
        </AppWalletProvider> */}
      </body>
    </html>
  );
}


