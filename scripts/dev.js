import { spawn } from "child_process";

async function run() {
  console.log("🚀 Starting Hardhat node...");
  const node = spawn("npx", ["hardhat", "node"], { stdio: "inherit" });

  await new Promise((r) => setTimeout(r, 3000));

  console.log("📦 Deploying contracts...");
  const deploy = spawn("npx", ["hardhat", "run", "scripts/deploy.ts", "--network", "localhost"], { stdio: "inherit" });

  deploy.on("close", (code) => {
    if (code === 0) {
      console.log("🌐 Starting frontend...");
      spawn("npm", ["run", "dev", "--prefix", "frontend"], { stdio: "inherit" });
    } else {
      console.error(`❌ Deploy failed with code ${code}`);
      process.exit(code);
    }
  });

  process.on("SIGINT", () => {
    console.log("🧹 Shutting down...");
    node.kill("SIGINT");
    process.exit(0);
  });
}

run().catch(console.error);
