import { network } from "hardhat";
import { expect } from "chai";

describe("Upgradeable Proxy", function () {
  it("should delegate calls to LogicV1", async function () {
    const { ethers } = await network.connect();
    await ethers.getSigners();

    // Deploy LogicV1
    const LogicV1 = await ethers.getContractFactory("LogicV1");
    const logicV1 = await LogicV1.deploy();
    await logicV1.waitForDeployment();
    console.log("LogicV1 deployed at:", logicV1.target);

    // === Deploy Proxy (без initData)
    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy(logicV1.target, { gasLimit: 6_000_000 });
    await proxy.waitForDeployment();
    console.log("Proxy deployed at:", proxy.target);

    // === Initialize через Proxy ===
    const proxyAsLogic = await ethers.getContractAt("LogicV1", proxy.target);
    const initTx = await proxyAsLogic.initialize(0n);
    await initTx.wait();
    console.log("✅ Proxy initialized successfully");

    // === Проверяем инициализацию ===
    const initialValue = await proxyAsLogic.getValue();
    expect(initialValue).to.equal(0n);
    console.log("Initial value =", initialValue.toString());

    // === Устанавливаем новое значение ===
    const tx = await proxyAsLogic.setValue(42n);
    await tx.wait();

    // === Проверяем, что значение обновилось через delegatecall ===
    const newValue = await proxyAsLogic.getValue();
    expect(newValue).to.equal(42n);
    console.log("✅ Value updated via Proxy =", newValue.toString());
  });
});
