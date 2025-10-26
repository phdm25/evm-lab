
import {
  useReadContract,
} from "wagmi";
import deploy from "./deploy.json";
import ProxyABI from "./abi/Proxy.json";
import LogicV1ABI from "./abi/LogicV1.json";
import type { Address } from "viem";


export function DebugInfo() {
    const { data: implementation } = useReadContract({
      address: deploy.proxy as Address,
      abi: ProxyABI.abi,
      functionName: "implementation",
    });
  
    const { data: owner } = useReadContract({
      address: deploy.proxy as Address,
      abi: ProxyABI.abi,
      functionName: "owner",
    });
  
    const { data: value } = useReadContract({
      address: deploy.proxy as Address,
      abi: LogicV1ABI.abi,
      functionName: "getValue",
    });
  
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
        </ul>
      </div>
    );
  }