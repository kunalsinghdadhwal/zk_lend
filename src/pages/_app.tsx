import "@/styles/globals.css";
import { useState, useEffect, createContext } from "react";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider, useAnonAadhaar } from "@anon-aadhaar/react";
import { Header } from "../components/Header";
import { WagmiProvider, useAccount } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { Footer } from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "../config";
import { useZKPMapping } from "../hooks/useZKPMapping";

export const AppContext = createContext<{
  isDisplayed: boolean;
  setIsDisplayed: (value: boolean) => void;
}>({
  isDisplayed: false,
  setIsDisplayed: () => {},
});

const queryClient = new QueryClient();
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
});

function AppContent({ Component, pageProps }: AppProps) {
  const [anonAadhaar] = useAnonAadhaar();
  const { address } = useAccount();
  const { mapWalletToZKP } = useZKPMapping();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in" && address) {
      const zkpData = {
        nullifier: anonAadhaar.pcd.proof.nullifier,
        proof: anonAadhaar.pcd.proof
      };
      mapWalletToZKP(address, zkpData);
    }
  }, [anonAadhaar.status, address, mapWalletToZKP]);

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

function MyApp(props: AppProps) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={{ isDisplayed, setIsDisplayed }}>
          <AnonAadhaarProvider>
            <AppContent {...props} />
          </AnonAadhaarProvider>
        </AppContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;