import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useReadContract,
} from "wagmi";

import deploy from "./deploy.json";
import LogicV1ABI from "./abi/LogicV1.json";
import ProxyABI from "./abi/Proxy.json";
import type { Abi, Address } from "viem";
import { SetValueButton } from "./components/SetValueButton";
import { UpgradeButton } from "./components/UpgradeButton";

export default function App() {
  const { isConnected } = useAccount();
  const { data: value, refetch } = useReadContract({
    address: deploy.proxy as Address,
    abi: LogicV1ABI.abi,
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
              abi={LogicV1ABI.abi as Abi}
              refetch={refetch}
              />

            <UpgradeButton
              proxy={deploy.proxy as Address}
              newLogic={deploy.logicV2 as Address}
              abi={ProxyABI.abi as Abi}
              />
          </div>
        </div>
      )}
    </div>
  );
}
