/* eslint-disable react/no-unescaped-entities */
import { AnonAadhaarProof, LaunchProveModal, useAnonAadhaar, useProver } from "@anon-aadhaar/react";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { AppContext } from "./_app";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { AuroraText } from "../components/magicui/aurora-text";
import clsx from "clsx";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { HeroStats } from "@/components/hero-stats";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
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
  const [, latestProof] = useProver();
  const router = useRouter();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
    }
  }, [anonAadhaar, router]);

  function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <>
      <main className="flex flex-col min-h-[75vh] mx-auto justify-center items-center w-full p-4">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,opacity_0.2)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
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
      <div className="flex flex-col items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8">
        {/* Render the proof if generated and valid */}
        {anonAadhaar.status === "logged-in" && (
          <>
            <p>✅ Proof is valid</p>
            <p>Got your Aadhaar Identity Proof</p>
            <>Welcome anon!</>
            {latestProof && (
              <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />
            )}
          </>
        )}
      </div>
          </div>
        </div>
        <HeroStats/>
      </main>
    </>
  );
}
