---

# DeFi Script: Uniswap & Aave Integration

## Overview of Script

This DeFi script demonstrates the integration of two leading decentralized finance (DeFi) protocols: Uniswap V3 and Aave. The script is designed to swap USDC for LINK using Uniswap V3 and then supply the acquired LINK to Aave to start earning interest. This workflow showcases the composability of DeFi protocols, enabling users to perform complex financial operations in a decentralized and permissionless manner.

### Key Steps:
1. **User Initiates Process:** The user begins by inputting the amount of USDC they wish to swap for LINK.
2. **Uniswap V3 Interaction:**
   - **Approve USDC:** The script approves the Uniswap V3 Swap Router to spend the user's USDC.
   - **Retrieve Pool Info:** The script retrieves the necessary pool information for the USDC/LINK pair from the Uniswap V3 Factory contract.
   - **Execute Swap:** The USDC is swapped for LINK using Uniswap V3's swap function.
3. **Aave Protocol Interaction:**
   - **Approve LINK:** The script approves the Aave protocol to spend the user's LINK.
   - **Supply LINK:** The LINK is supplied to Aave, allowing the user to earn interest on their holdings.
4. **Generate Transaction Receipts:** The script outputs transaction receipts for both the swap and the supply actions, providing the user with a record of the transactions.

This script can be deployed on the Ethereum Sepolia testnet, allowing users to experiment with DeFi functionalities without risking real assets.

## Diagram Illustration

The diagram below illustrates the sequence of steps and interactions between the protocols:

![DeFi Script Workflow](./defi-diagram.png)




## Code Explanation

This section provides a detailed breakdown of the script, highlighting key functions, the underlying logic, and how the interactions with the DeFi protocols Uniswap V3 and Aave are handled.

### Key Functions and Logic:

1. **`initialize() Function`:**
   - **Purpose:** Sets up the initial configuration for the script, including defining the necessary contract addresses and initializing any required libraries.
   - **Logic:** This function initializes the connection to the Ethereum network using Web3.js, sets up the necessary smart contract instances, and prepares the script for execution.

2. **`approveTokenSpending(tokenAddress, spenderAddress, amount) Function`:**
   - **Purpose:** Approves a specific address (e.g., Uniswap or Aave) to spend a designated amount of a particular token on behalf of the user.
   - **Logic:** The function interacts with the ERC-20 contract of the token specified by `tokenAddress` and sends an approval transaction to allow the `spenderAddress` to spend the user's tokens.

3. **`getPoolInfo(pairAddress) Function`:**
   - **Purpose:** Retrieves information about the liquidity pool for the USDC/LINK pair from Uniswap V3.
   - **Logic:** This function interacts with the Uniswap V3 Factory contract to fetch the pool's address and then queries the pool contract for information like liquidity, reserves, and swap fee.

4. **`swapTokensOnUniswap(amountIn, amountOutMin, path, to, deadline) Function`:**
   - **Purpose:** Executes the token swap on Uniswap V3, converting USDC to LINK.
   - **Logic:** The function calls the Uniswap V3 Swap Router's `swapExactTokensForTokens` function, specifying the input and output token details, slippage tolerance, and the recipient address. It then waits for the transaction to be mined.

5. **`supplyToAave(tokenAddress, amount) Function`:**
   - **Purpose:** Supplies the acquired LINK tokens to the Aave protocol to start earning interest.
   - **Logic:** The function interacts with the Aave Lending Pool contract, supplying the specified amount of LINK to the protocol. Aave then converts these tokens into aTokens, which represent the user's interest-bearing assets.

6. **`generateTransactionReceipt(txHash) Function`:**
   - **Purpose:** Generates a receipt for the executed transaction, providing the user with a record of the operation.
   - **Logic:** The function queries the blockchain for the transaction hash (`txHash`) and retrieves the transaction details, including block number, gas used, and status, and formats them into a readable receipt.

### Interactions with DeFi Protocols:

- **Uniswap V3:**
  - The script interacts with Uniswap V3 by approving the Swap Router to spend USDC and executing a swap function to convert USDC to LINK. It ensures that the swap is performed with minimal slippage by specifying the `amountOutMin` parameter.
  - The pool information is fetched directly from Uniswap V3's Factory contract, ensuring that the script uses the most up-to-date data for the swap.

- **Aave:**
  - After acquiring LINK, the script interacts with Aave by approving the Lending Pool contract to spend the user's LINK. It then supplies the LINK to Aave, which mints aTokens in return.
  - The script uses the aTokens as a representation of the user's deposit, which will accrue interest over time based on the rates provided by Aave.


---

