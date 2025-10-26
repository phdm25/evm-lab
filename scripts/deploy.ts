import { network } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config({ path: "./frontend/.env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const { ethers } = await network.connect();

  console.log("🚀 Deploying contracts using Hardhat v3 + Ethers v6...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", await deployer.getAddress());

  const owners = [process.env.VITE_OWNER1!, process.env.VITE_OWNER2!];
  const required = parseInt(process.env.VITE_REQUIRED || "2");

  // === LogicV1 ===
  const LogicV1 = await ethers.getContractFactory("LogicV1");
  const logicV1 = await LogicV1.deploy();
  await logicV1.waitForDeployment();
  const logicV1Address = await logicV1.getAddress();
  console.log("LogicV1 deployed at:", logicV1Address);

  // === Proxy (без initData)
  const Proxy = await ethers.getContractFactory("Proxy");
  const proxy = await Proxy.deploy(logicV1Address, { gasLimit: 6_000_000 });
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log("Proxy deployed at:", proxyAddress);

  // === Initialize через Proxy ===
  const proxyAsLogic = await ethers.getContractAt("LogicV1", proxyAddress);
  const tx = await proxyAsLogic.initialize(0n);
  await tx.wait();
  console.log("✅ Proxy initialized successfully");

  // === Multisig ===
  const multisig = await ethers.deployContract("SimpleMultisig", [owners, required]);
  await multisig.waitForDeployment();
  console.log("Multisig deployed at:", multisig.target);

  // === LogicV2 ===
  const logicV2 = await ethers.deployContract("LogicV2");
  await logicV2.waitForDeployment();
  const logicV2Address = await logicV2.getAddress();
  console.log("LogicV2 deployed at:", logicV2Address);

  // === Save addresses ===
  const result = {
    proxy: proxy.target,
    multisig: multisig.target,
    logicV1: logicV1Address,
    logicV2: logicV2Address,
  };

  fs.writeFileSync("./frontend/src/deploy.json", JSON.stringify(result, null, 2));
  console.log("\n✅ Addresses saved to frontend/src/deploy.json");

  // === Generate ABIs ===
  const contracts = ["LogicV1", "LogicV2", "Proxy", "SimpleMultisig"];
  const abiDir = path.join(__dirname, "../frontend/src/abi");

  if (!fs.existsSync(abiDir)) fs.mkdirSync(abiDir, { recursive: true });

  for (const name of contracts) {
    const artifactPath = path.join(__dirname, `../artifacts/contracts/${name}.sol/${name}.json`);
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abi = { abi: artifact.abi };
    fs.writeFileSync(path.join(abiDir, `${name}.json`), JSON.stringify(abi, null, 2));
  }

  console.log("✅ ABIs exported to frontend/src/abi/");
  console.table(result);
}

main().catch((err) => {
  console.error("❌ Deployment error:", err);
  process.exitCode = 1;
});
