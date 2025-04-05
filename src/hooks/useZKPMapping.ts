import { useState } from 'react';
import { supabase } from '../lib/supabase'

interface ZKPData {
  nullifier: string;
  proof: any;
}

export function useZKPMapping() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapWalletToZKP = async (walletAddress: string, zkpData: ZKPData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_zkp_mappings')
        .upsert({
          wallet_address: walletAddress.toLowerCase(),
          nullifier: zkpData.nullifier,
          proof: zkpData.proof
        })
        .select();

      if (error) throw error;
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getZKPByWallet = async (walletAddress: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_zkp_mappings')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mapWalletToZKP,
    getZKPByWallet,
    isLoading,
    error
  };
}