# EVM Lab — Upgradeable Proxy + Multisig Example

This project demonstrates a **complete local EVM lab setup** built with:
- **Hardhat v3 + Ethers v6**
- **Upgradeable Proxy pattern**
- **Multisig contract for secure upgrades**
- **Frontend (React + Wagmi + RainbowKit + TailwindCSS)**

It allows you to:
- Deploy and upgrade smart contracts locally
- Manage upgrades via a multisig wallet
- Interact with everything through a clean React UI

---

## Requirements

- Node.js 20+
- npm or pnpm
- Hardhat 3.x
- MetaMask browser extension

---

## 🚀 Setup Instructions

### 1) Install Dependencies

```bash
npm install
cd frontend && npm install
```

### 2) Create `.env.local`

From the project root:

```bash
npm run node
```

It will print 20 pre-funded accounts, each with 10,000 ETH on your local network (chainId 31337).

Saving Private Keys & Environment Configuration

To keep your accounts consistent across restarts, define their addresses and private keys inside frontend/.env.local.

Example configuration:
```bash
VITE_OWNER1=0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
VITE_PRIVATE1=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

VITE_OWNER2=0x70997970c51812dc3a010c7d01b50e0d17dc79c8
VITE_PRIVATE2=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

VITE_REQUIRED=2
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545
```

Why This Matters

Hardhat generates new wallets each time you restart the node.
By saving the same private keys here, you ensure:

The same owners are used for the multisig contract.

The frontend always connects to known accounts.

Deployments and confirmations stay consistent between runs.

---

### 3) 🦊 Adding Accounts to MetaMask

🦊 Adding Accounts to Metamask

To test with these wallets:

Open Metamask → Import Account

Paste one of the private keys from .env.local

Switch to the Localhost 8545 network (appears automatically when Hardhat node is running)

Repeat for all owners (if using multisig)

Now these accounts will show 10,000 ETH each, ready for transactions.

---

## Run app

From the project root:

```bash
npm run dev
```

The script will:
- Starts the local Hardhat node — launches a local Ethereum blockchain on http://127.0.0.1:8545.
- Deploys all smart contracts — runs the deployment script to compile and deploy LogicV1, Proxy, LogicV2, and Multisig contracts.
- Generates frontend artifacts — saves deployed addresses and ABIs to frontend/src/deploy.json and frontend/src/abi/.
- Starts the frontend development server — runs the Vite app (React + Wagmi + RainbowKit) on http://localhost:5173.
- Connects frontend to the local blockchain — the dApp automatically interacts with deployed contracts via the local Hardhat node.

---

## 🧠 Troubleshooting

**Port 8545 already in use**
```bash
pkill -f "hardhat"
```

**No ETH in MetaMask**
- Ensure you imported the local private keys and are on the `Hardhat Local` network.

**MetaMask simulates Proxy call as “unrecognized selector”**
- That’s expected for simulation; the real tx goes via `delegatecall` and succeeds on chain.

---

