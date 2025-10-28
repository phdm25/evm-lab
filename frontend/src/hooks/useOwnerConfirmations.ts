import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import deploy from "../deploy.json";
import type { Address } from "viem";
import { SimpleMultisigABI } from "../abi/SimpleMultisigABI.js";

//TODO use react query instead
export function useOwnerConfirmations(txId: bigint, owners: Address[] | undefined) {
  const config = useConfig();
  const [confirmations, setConfirmations] = useState<{owner:Address,confirmed: boolean}[]>([]);

  useEffect(() => {
    if (!owners?.length || txId === undefined) return;

    async function fetchConfirmations() {
      if(owners){
        try {
          const results = await Promise.all(
            owners.map(async (owner) => {
              const confirmed = await readContract(config, {
                address: deploy.multisig as Address,
                abi: SimpleMultisigABI,
                functionName: "isConfirmed",
                args: [BigInt(txId), owner],
              });
          
              return { owner, confirmed };
            })
          
          );
          setConfirmations(results);
        } catch (err) {
          console.error("Failed to read confirmations:", err);
          setConfirmations(owners.map( owner => ({owner,confirmed:false})));
        }
      }
    }

    fetchConfirmations();
  }, [config, owners, txId]);

  return confirmations;
}
