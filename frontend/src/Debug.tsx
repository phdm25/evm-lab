
import {
  useReadContract,
} from "wagmi";
import deploy from "./deploy.json";

import type { Address } from "viem";
import { ProxyABI } from "./abi/ProxyABI";
import { LogicV1ABI } from "./abi/LogicV1ABI";


export function DebugInfo() {
    const { data: implementation } = useReadContract({
      address: deploy.proxy as Address,
      abi: ProxyABI,
      functionName: "implementation",
    });
  
    const { data: owner } = useReadContract({
      address: deploy.proxy as Address,
      abi: ProxyABI,
      functionName: "owner",
    });
  
    const { data: value } = useReadContract({
      address: deploy.proxy as Address,
      abi: LogicV1ABI,
      functionName: "getValue",
    });

    let versionLabel = "Unknown";

    if (typeof implementation === 'string') {
      if (implementation.toLowerCase() === deploy.logicV1.toLowerCase()) {
        versionLabel = "LogicV1 (initial version)";
      } else if (implementation.toLowerCase() === deploy.logicV2.toLowerCase()) {
        versionLabel = "LogicV2 (upgraded)";
      }
    }
  
    return (
      <div className="mt-8 p-4 border rounded-lg ">
        <h2 className="font-semibold mb-2 text-lg">Debug Info</h2>
        <ul className="text-sm">
          <li>
            <strong>Proxy:</strong> {deploy.proxy}
          </li>
          <li>
            <strong>Implementation:</strong>{" "}
            {implementation ? String(implementation) : "—"}
          </li>
          <li>
            <strong>Owner:</strong> {owner ? String(owner) : "—"}
          </li>
          <li>
            <strong>Current value:</strong> {value !== undefined ? String(value) : "—"}
          </li>
          <li>
            <strong>Version:</strong> {versionLabel}
          </li>
        </ul>
      </div>
    );
  }