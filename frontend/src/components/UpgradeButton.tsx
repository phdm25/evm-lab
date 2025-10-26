import { useWriteContract } from "wagmi";
import type { Abi, Address } from "viem";

interface UpgradeButtonProps {
  proxy: Address;
  newLogic: Address;
  abi: Abi;
}

export function UpgradeButton({ proxy, newLogic, abi }: UpgradeButtonProps) {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleUpgrade = async () => {
    try {
      await writeContract({
        address: proxy,
        abi,
        functionName: "upgrade",
        args: [newLogic, "0x"],
      });
    } catch (err) {
      console.error("Upgrade error:", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleUpgrade}
        disabled={isPending}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        {isPending ? "Upgrading..." : "Upgrade to LogicV2"}
      </button>

      {isSuccess && <p className="text-green-600">✅ Upgrade successful!</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}
    </div>
  );
}
