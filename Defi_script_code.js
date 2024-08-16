// Required Imports and Setup
const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Uniswap and Aave ABIs and addresses
const UNISWAP_ROUTER_ABI = require("./abis/UniswapRouterABI.json");
const UNISWAP_FACTORY_ABI = require("./abis/UniswapFactoryABI.json");
const AAVE_LENDING_POOL_ABI = require("./abis/AaveLendingPoolABI.json");

const USDC_ADDRESS = "0x...";  // USDC address on Sepolia
const LINK_ADDRESS = "0x...";  // LINK address on Sepolia
const SWAP_ROUTER_ADDRESS = "0x...";  // Uniswap Swap Router address on Sepolia
const AAVE_LENDING_POOL_ADDRESS = "0x...";  // Aave Lending Pool address on Sepolia

const TOKEN_ABI = require("./abis/ERC20ABI.json"); // ERC20 ABI

// Approve Token Function
async function approveToken(tokenAddress, amount, spender, wallet) {
    const tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, wallet);
    const approveAmount = ethers.utils.parseUnits(amount.toString(), 6); // Assuming USDC has 6 decimals
    await tokenContract.approve(spender, approveAmount);
    console.log(`Approved ${amount} USDC to ${spender}`);
}

// Get Pool Info Function
async function getPoolInfo(factoryContract, tokenIn, tokenOut) {
    const poolAddress = await factoryContract.getPool(tokenIn, tokenOut, 3000);
    const poolContract = new ethers.Contract(poolAddress, UNISWAP_FACTORY_ABI, provider);
    const [token0, token1, fee] = await Promise.all([poolContract.token0(), poolContract.token1(), poolContract.fee()]);
    return { poolContract, token0, token1, fee };
}

// Prepare Swap Params Function
async function prepareSwapParams(poolContract, amountIn) {
    return {
        tokenIn: USDC_ADDRESS,
        tokenOut: LINK_ADDRESS,
        fee: await poolContract.fee(),
        recipient: wallet.address,
        amountIn: ethers.utils.parseUnits(amountIn.toString(), 6),
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
    };
}

// Execute Swap Function
async function executeSwap(swapRouter, params) {
    const transaction = await swapRouter.exactInputSingle(params);
    const receipt = await transaction.wait();
    console.log(`Swap executed: https://sepolia.etherscan.io/tx/${receipt.transactionHash}`);
}

// Supply LINK to Aave Function
async function supplyLinkToAave(amount) {
    const linkContract = new ethers.Contract(LINK_ADDRESS, TOKEN_ABI, wallet);
    await linkContract.approve(AAVE_LENDING_POOL_ADDRESS, amount);
    const aaveLendingPool = new ethers.Contract(AAVE_LENDING_POOL_ADDRESS, AAVE_LENDING_POOL_ABI, wallet);
    await aaveLendingPool.deposit(LINK_ADDRESS, amount, wallet.address, 0);
    console.log(`Supplied ${amount} LINK to Aave`);
}

// Main Function
async function main(swapAmount) {
    await approveToken(USDC_ADDRESS, swapAmount, SWAP_ROUTER_ADDRESS, wallet);

    const uniswapFactoryContract = new ethers.Contract(UNISWAP_FACTORY_ABI, provider);
    const { poolContract } = await getPoolInfo(uniswapFactoryContract, USDC_ADDRESS, LINK_ADDRESS);

    const swapParams = await prepareSwapParams(poolContract, swapAmount);
    const uniswapRouter = new ethers.Contract(SWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, wallet);
    await executeSwap(uniswapRouter, swapParams);

    const linkBalance = await linkContract.balanceOf(wallet.address);
    await supplyLinkToAave(linkBalance);
}

// Execute the main function with a specified amount of USDC
main("100");
