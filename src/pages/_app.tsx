import "@/styles/globals.css";
import Head from "next/head";
import { useState, useEffect, createContext } from "react";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider, useAnonAadhaar, useProver } from "@anon-aadhaar/react";
import { Header } from "../components/Header";
import { WagmiProvider, useAccount } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { Footer } from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "../config";
import { useZKPMapping } from "../hooks/useZKPMapping";

const queryClient = new QueryClient();
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
});
export const AppContext = createContext({
  isTestMode: false,
  setIsTestMode: (isTest: boolean) => {},
  setVoted: (voted: boolean) => {},
});

function InnerApp({ Component, pageProps }: AppProps) {
  const { address } = useAccount();
  const [anonAadhaar] = useAnonAadhaar();
  const { mapWalletToZKP } = useZKPMapping();
  
  useEffect(() => {
    if (anonAadhaar.status === "logged-in" && address) {
      console.log("Mapping ZKP for wallet:", address);
      const zkpData = {
        nullifier: anonAadhaar.pcd.proof.nullifier,
        proof: anonAadhaar.pcd.proof
      };
      mapWalletToZKP(address, zkpData);
    }
  }, [anonAadhaar.status, address]);
  
  return <Component {...pageProps} />;
}

export default function App({ Component, pageProps }: AppProps) {
  const [isDisplayed, setIsDisplayed] = useState<boolean>(false);
  const [ready, setReady] = useState(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [voted, setVoted] = useState(false);
  const [, latestProof] = useProver();
  const [anonAadhaar] = useAnonAadhaar();
  
  useEffect(() => {
      if (anonAadhaar.status === "logged-in") {
        console.log(anonAadhaar.status);
      }
    }, [anonAadhaar]);
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (voted) setIsDisplayed(true);
  }, [voted]);

  return (
    <>
      <Head>
        <title>Anon Aadhaar Example</title>
        <meta property="og:title" content="Anon Aadhaar Example" key="title" />
        <meta
          property="og:image"
          content="https://anon-aadhaar-example.vercel.app/AnonAadhaarBanner.png"
          key="image"
        />
        <meta
          property="og:description"
          name="description"
          content="A Next.js example app that integrate the Anon Aadhaar SDK."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {ready ? (
        <AppContext.Provider
          value={{
            isTestMode,
            setIsTestMode,
            setVoted,
          }}
        >
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <AnonAadhaarProvider _useTestAadhaar={isTestMode}
                _artifactslinks={{
                  zkey_url: "/circuit_final.zkey",
                  vkey_url: "/vkey.json",
                  wasm_url: "/aadhaar-verifier.wasm",
                }}             
              >
                <div className="relative min-h-screen flex flex-col justify-between">
                  <div className="flex-grow">
                    <Header />
                    <InnerApp Component={Component} pageProps={pageProps} />
                  </div>
                  <Footer
                    isDisplayed={isDisplayed}
                    setIsDisplayed={setIsDisplayed}
                  />
                </div>
              </AnonAadhaarProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </AppContext.Provider>
      ) : null}
    </>
  );
}