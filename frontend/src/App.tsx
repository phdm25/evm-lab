import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useReadContract,
} from "wagmi";

import deploy from "./deploy.json";
import type { Address } from "viem";
import { SetValueButton } from "./components/SetValueButton";
import { MultisigUpgrade } from "./components/MultisigUpgrade";
import { LogicV1ABI } from "./abi/LogicV1ABI";

export default function App() {
  const { isConnected } = useAccount();
  const { data: value, refetch } = useReadContract({
    address: deploy.proxy as Address,
    abi: LogicV1ABI,
    functionName: "getValue",
  });

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upgradeable Proxy</h1>
      <ConnectButton />

      {isConnected && (
        <div className="mt-6 space-y-4">
          <p>Stored value: <strong>{value?.toString() ?? "0"}</strong></p>
          <div className="flex flex-col gap-2">
            <SetValueButton
              address={deploy.proxy as Address}
              abi={LogicV1ABI}
              refetch={refetch}
              />
            <MultisigUpgrade />
          </div>
        </div>
      )}
    </div>
  );
}
