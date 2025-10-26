import { network } from "hardhat";
import * as fs from "fs";

async function main() {
  // Подключаемся к сети и берём ethers API
  const { ethers } = await network.connect();

  console.log("🔁 Starting upgrade via multisig...");

  // Загружаем адреса из deploy.json
  const deployment = JSON.parse(fs.readFileSync("./frontend/src/deploy.json", "utf-8"));
  const proxyAddr = deployment.proxy;
  const multisigAddr = deployment.multisig;
  const logicV2Addr = deployment.logicV2;

  // Получаем экземпляры контрактов
  const proxy = await ethers.getContractAt("Proxy", proxyAddr);
  const multisig = await ethers.getContractAt("SimpleMultisig", multisigAddr);

  // Готовим calldata для обновления логики
  const newImplementation = logicV2Addr;
  const iface = new ethers.Interface(["function upgrade(address newImplementation)"]);
  const data = iface.encodeFunctionData("upgrade", [newImplementation]);

  console.log("Creating multisig transaction...");
  const tx = await multisig.submitTransaction(proxyAddr, 0, data);
  const receipt = await tx.wait();

  const txId = receipt.logs[0].args?.txIndex ?? 0;
  console.log("Transaction submitted, ID:", txId.toString());


  console.log("Confirming multisig transaction...");
  await multisig.confirmTransaction(txId);
  console.log("Multisig transaction confirmed ✅");

  console.log(`Proxy successfully upgraded to LogicV2 at ${logicV2Addr}`);
}

main().catch((err) => {
  console.error("❌ Upgrade error:", err);
  process.exitCode = 1;
});
