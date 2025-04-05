/* eslint-disable react/no-unescaped-entities */
import { LaunchProveModal, useAnonAadhaar } from "@anon-aadhaar/react";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { AppContext } from "./_app";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { AuroraText } from "../components/magicui/aurora-text";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
// This is a trick to enable having both modes in under the same page.
// This could be removed and only the <LaunchProveModal /> could be displayed.
const LaunchMode = ({
  isTest,
  setIsTestMode,
}: {
  isTest: boolean;
  setIsTestMode: (isTest: boolean) => void;
}) => {
  return (
    <button onClick={() => setIsTestMode(!isTest)}>
      {isTest ? "" : ""}
    </button>
  );
};

export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();
  const { isConnected, address } = useAccount();
  const { isTestMode, setIsTestMode } = useContext(AppContext);
  const { open } = useWeb3Modal();
  const router = useRouter();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      router.push("./vote");
    }
  }, [anonAadhaar, router]);

  return (
    <>
      <main className="flex flex-col min-h-[75vh] mx-auto justify-center items-center w-full p-4">
      <FlickeringGrid
        className="absolute inset-0 z-[-1] size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={800}
        width={Math.max(800, window.innerWidth)}
      />
        <div className="max-w-4xl w-full">
          <h6 className="mb-6 bg-gradient-to-r from-purple-400 via-gold-400 to-purple-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-2xl">
            
          </h6>
          <h2 className="mb-6 bg-gradient-to-r from-purple-400 via-gold-400 to-purple-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
          <AuroraText>The Future of Decentralized Lending</AuroraText>
          </h2>
          <div className="text-md mt-4 mb-8 text-[#717686]">
          Secure, Transparent, Zero-Knowledge Lending
          </div>

          <div className="flex w-full gap-8 mb-6">
            <LaunchMode isTest={isTestMode} setIsTestMode={setIsTestMode} />
            {isConnected ? (
              <LaunchProveModal
                nullifierSeed={Math.floor(Math.random() * 1983248)}
                signal={address}
                buttonStyle={{
                  borderRadius: "8px",
                  border: "solid",
                  borderWidth: "1px",
                  boxShadow: "none",
                  fontWeight: 500,
                  borderColor: "#009A08",
                  color: "#009A08",
                  fontFamily: "rajdhani",
                }}
                buttonTitle={
                  isTestMode ? "USE TEST CREDENTIALS" : "USE REAL CREDENTIALS"
                }
              />
            ) : (
              <button
                className="bg-purple-800 rounded-lg text-white px-6 py-1 font-rajdhani font-medium"
                onClick={() => open()}
              >
                CONNECT WALLET
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
