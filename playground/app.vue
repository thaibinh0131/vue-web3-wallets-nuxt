<script lang="ts" setup>
import { useWallet, ref } from "#imports";
import { ethers } from "ethers";

const chainInfo = {
  [122]: {
    explorer: "https://explorer.fuse.io/",
    name: "Fuse Mainnet",
    nativeCurrency: { name: "Fuse", symbol: "FUSE", decimals: 18 },
    rpcUrl: "https://rpc.fuse.io/",
  },
  [123]: {
    explorer: "https://explorer.fusespark.io/",
    name: "Fuse Testnet",
    nativeCurrency: { name: "Fuse", symbol: "FUSE", decimals: 18 },
    rpcUrl: "https://explorernode.fusespark.io/",
  },
};
const { address, chainId, disconnect, provider } = useWallet({
  supportedChains: chainInfo,
  defaultChain: 123,
  wcProjectId: "b996ef7b9f234aaccd8b26c6ba095dc3",
});

const ercAbi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

const signMessage = async () => {
  if (provider.value) {
    const library = new ethers.providers.Web3Provider(provider.value);
    const signer = library.getSigner();
    // const signature = await signer.signMessage('Sign with wallet connect');
    const contract = new ethers.Contract(
      "0x73620a914B2dB80ff87f3000fa50aE4Dd81C19Ba",
      ercAbi,
      signer
    );
    const res = await contract.approve(
      "0x22bB0964653F4c286451bbc363D3326eA0fe79cC",
      "1000000000000000000"
    );
    console.debug({ res });
  }
};
const show = ref(false);
</script>

<template>
  <div>
    <client-only><ConnectWalletModal v-model="show" /></client-only>
    <button v-if="!address" @click="show = true">Connect Wallet</button>
    <button v-else @click="signMessage">Sign Message</button>
  </div>
</template>

<script setup></script>
