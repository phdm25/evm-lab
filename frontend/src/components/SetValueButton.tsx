import { useState } from "react";
import { useWriteContract } from "wagmi";
import type { Abi, Address } from "viem";

interface SetValueButtonProps {
  address: Address;
  abi: Abi;
  refetch: () => void;
}

export function SetValueButton({ address, abi, refetch }: SetValueButtonProps) {
  const [value, setValue] = useState("");
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleSetValue = async () => {
    try {
      await writeContract({
        address,
        abi,
        functionName: "setValue",
        args: [BigInt(value)],
      });
      await refetch();
    } catch (err) {
      console.error("Error calling setValue:", err);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter new value"
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleSetValue}
        disabled={isPending || !value}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isPending ? "Pending..." : "Set Value"}
      </button>

      {isSuccess && <p className="text-green-600">✅ Transaction sent!</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}
    </div>
  );
}
