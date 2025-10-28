import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { encodeFunctionData } from "viem";
import deploy from "../deploy.json";
import type { Address } from "viem";
import { getEllipsisString } from "../utils/getEllipsisString";
import { SimpleMultisigABI } from "../abi/SimpleMultisigABI";
import { ProxyABI } from "../abi/ProxyABI";
import { useOwnerConfirmations } from "../hooks/useOwnerConfirmations";
import { useMemo } from "react";

export const  MultisigUpgrade = () =>  {
  const { address } = useAccount();
  const { writeContract, isPending } = useWriteContract();
 
  const { data: owners } = useReadContract({
    address: deploy.multisig as Address,
    abi: SimpleMultisigABI,
    functionName: "getOwners",
  });
  
  const { data: required } = useReadContract({
    address: deploy.multisig as Address,
    abi: SimpleMultisigABI,
    functionName: "required",
  });
  
  const { data: txCountData, refetch: refetchTxCount } = useReadContract({
    address: deploy.multisig as Address,
    abi: SimpleMultisigABI,
    functionName: "getTransactionsCount",
  });
  
  const txCount = Number(txCountData ?? '0n')
  const txId = txCount ? Number(txCount) - 1 : 0
  const ownersList = useMemo(() => owners ? [...owners] : [], [owners])
  const confirmations = useOwnerConfirmations(BigInt(txId), ownersList );

  const { data: txData, refetch: refetchTx } = useReadContract({
    address: deploy.multisig as Address,
    abi: SimpleMultisigABI,
    functionName: "getTransaction",
    args: [BigInt(txId)],
  });


  const handleSubmitUpgrade = async () => {
    const upgradeData = encodeFunctionData({
      abi: ProxyABI,
      functionName: "upgrade",
      args: [deploy.logicV2 as Address, "0x"],
    });

    try {
      await writeContract({
        address: deploy.multisig as Address,
        abi: SimpleMultisigABI,
        functionName: "submit",
        args: [deploy.proxy as Address, 0n, upgradeData],
      });
      await refetchTxCount();
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const handleConfirm = async (id: number) => {
    try {
      await writeContract({
        address: deploy.multisig as Address,
        abi: SimpleMultisigABI,
        functionName: "confirm",
        args: [BigInt(id)],
      });
      await refetchTx();
    } catch (err) {
      console.error("Confirm failed:", err);
    }
  };

  const handleExecute = async (id: number) => {
    try {
      await writeContract({
        address: deploy.multisig as Address,
        abi: SimpleMultisigABI,
        functionName: "execute",
        args: [BigInt(id)],
      });
      await refetchTx();
    } catch (err) {
      console.error("Execute failed:", err);
    }
  };

  if (!owners ) return <p>Loading multisig data...</p>;

  const confirms = txData ? Number(txData[2] ) : 0;
  const executed = txData ? txData?.[1] : false;
  const allConfirmed = confirms >= Number(required);

  return (
    <div className="p-6 mt-8 border rounded-lg space-y-4">
      <h2 className="text-xl font-bold">🔐 Multisig Upgrade Panel</h2>
      <button
        onClick={handleSubmitUpgrade}
        disabled={isPending || executed}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        Submit Upgrade
      </button>

      {txCount > 0 && <div className="border-t pt-4">
          <p>
            Confirmations:{" "}
            <strong>
              {confirms}/{required?.toString()}
            </strong>
          </p>
          <p >Status: <span className={`${executed ? "text-green-60" : "text-gray-500"}`}>{executed ? "Executed" : "Pending"}</span></p>
          <h3 className="font-semibold mb-2">Owners</h3>
          <ul className="space-y-2">
            {
              confirmations.map(({owner,confirmed}) => {
                const isCurrent = address?.toLowerCase() === owner.toLowerCase();
                return (
                  <li key={owner} className="flex items-center justify-between">
                    <span
                      className={`text-sm text-blue-600 ${
                        isCurrent ? "font-bold" : "opacity-50"
                      }`}
                    >
                      {getEllipsisString(owner ?? '',4,4)}
                    </span>
  
                    {confirmed ? (
                      <span className="text-green-600">Confirmed</span>
                    ) : isCurrent ? (
                      <button
                        onClick={() => handleConfirm(txId)}
                        disabled={executed}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                      >
                        Confirm
                      </button>
                    ) : (
                      <span className="text-gray-500">Waiting...</span>
                    )}
                  </li>
                );
              })
            }
          </ul>
        </div>
      }

      {allConfirmed && !executed && (
        <button
          onClick={() => handleExecute(txId)}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-4"
        >
          Execute Upgrade
        </button>
      )}
    </div>
  );
}
