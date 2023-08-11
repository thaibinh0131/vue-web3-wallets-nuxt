import { computed, ref, Ref, WritableComputedRef } from "vue";
import type { ChainOption, ChainInfo, InitializeOptions } from "../types";
import Provider, { EthereumProvider } from "@walletconnect/ethereum-provider";
import { useState } from "#imports";

const provider = ref<Provider>();
const walletConnectProvider = ref<Provider>();

type UseWallet = {
  handleSwitchChain: (chain: number) => Promise<void>;
  connectToWallet: (id: string) => Promise<void>;
  setChain: (chain: number) => void;
  setAddress: (address: string) => void;
  onConnectResponse: (res: {
    chain: number;
    account: string;
    provider: Provider;
    connectorId: string;
  }) => void;
  disconnect: () => void;
  address: Ref<string>;
  chainId: Ref<number>;
  provider: Ref<Provider | undefined>;

  loadingConnect: Ref<boolean>;
  savedConnector: WritableComputedRef<string>;
};

export const useWallet = (initializeOptions?: InitializeOptions): UseWallet => {
  const SAVED_CONNECTOR_KEY = "savedConnector";
  const address = useState<string>("connectedAddress", () => "");
  const initOptions = useState<InitializeOptions | undefined>(
    "initOptions",
    () => undefined
  );
  const chainId = useState<number>("chainId");
  const loading = useState<boolean>("loading", () => false);
  const supportedChains = useState<ChainInfo>("supportedChains", () => ({}));
  const walletConnectProjectId = useState<string>(
    "walletConnectProjectId",
    () => ""
  );
  const initialized = useState("initialized", () => false);
  const errors = useState<Error>("errors");
  const savedConnector = computed({
    get() {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(SAVED_CONNECTOR_KEY) || "";
      }
      return "";
    },
    set(val: string) {
      if (typeof window !== "undefined") {
        if (!val) {
          return window.localStorage.removeItem(SAVED_CONNECTOR_KEY);
        } else {
          return window.localStorage.setItem(SAVED_CONNECTOR_KEY, val);
        }
      }
    },
  });
  const supportedChainIds = computed(() =>
    supportedChains.value
      ? Object.keys(supportedChains.value).map((el) => Number(el))
      : []
  );

  // const emit = defineEmits(['error']);

  const toHex = (chainIdDec: number) => `0x${chainIdDec.toString(16)}`;
  const setChain = (chain: number) => {
    chainId.value = chain;
  };
  const setAddress = (val: string) => {
    address.value = val;
  };
  const resetState = () => {
    if (provider.value) {
      const myProvider = provider.value as any;
      if (typeof myProvider.close === "function") {
        myProvider.close();
      }

      if (typeof myProvider.removeAllListeners === "function") {
        myProvider.removeAllListeners();
      }
    }
    if (typeof window !== "undefined") {
      Object.keys(window.localStorage)
        .filter((x) => x.startsWith("wc@2"))
        .forEach((x) => localStorage.removeItem(x));
    }
    address.value = "";
    provider.value = undefined;
    savedConnector.value = "";
  };
  const onConnectResponse = (res: {
    chain: number;
    account: string;
    provider: Provider;
    connectorId: string;
  }) => {
    const { chain, account, provider: providerInstance, connectorId } = res;

    chainId.value = chain;
    address.value = account;
    provider.value = providerInstance;
    savedConnector.value = connectorId;
    if (initOptions.value?.onConnect) {
      initOptions.value?.onConnect(account);
    }
    subscribeEvent();
  };

  const initialize = async () => {
    if (initializeOptions && process.client) {
      const {
        defaultChain,
        supportedChains: requiredSupportedChains,
        wcProjectId,
      } = initializeOptions;
      chainId.value = defaultChain;
      supportedChains.value = { ...requiredSupportedChains };
      walletConnectProjectId.value = wcProjectId;
      const customRpcs = Object.entries(supportedChains.value).reduce(
        (acc, [key, val]) => {
          acc[key.toString()] = val.rpcUrl;
          return acc;
        },
        {} as Record<string, string>
      );
      const client = await EthereumProvider.init({
        projectId: walletConnectProjectId.value,
        showQrModal: true,
        chains: [defaultChain],
        methods: ["eth_sendTransaction", "personal_sign"],
        events: ["chainChanged", "accountsChanged"],
        rpcMap: customRpcs,
      });
      console.debug({
        defaultChain,
        customRpcs,
        client,
      });
      walletConnectProvider.value = client;
      if (
        walletConnectProvider.value.accounts &&
        walletConnectProvider.value.accounts[0]
      ) {
        onConnectResponse({
          account: walletConnectProvider.value.accounts[0],
          chain: defaultChain,
          provider: walletConnectProvider.value,
          connectorId: "walletconnect",
        });
      }
      initOptions.value = initializeOptions;
      initialized.value = true;
    }
  };

  const subscribeEvent = () => {
    if (provider.value) {
      provider.value.on("accountsChanged", (accounts: string[]) => {
        if (accounts && accounts.length !== 0) {
          if (address.value === accounts[0]) return;
          if (initOptions.value?.onAccountChanged) {
            initOptions.value?.onAccountChanged(accounts[0]);
          }
          address.value = accounts[0];
          return;
        }
        resetState();
      });
      provider.value.on("chainChanged", (networkId: string) => {
        const networkIdParsed = Number(networkId);
        if (networkIdParsed === Number(chainId.value)) return;
        if (supportedChainIds.value.includes(networkIdParsed)) {
          chainId.value = networkIdParsed;
          handleSwitchChain(networkIdParsed);
        } else {
          resetState();
        }
      });

      provider.value.on("disconnect", (error: Error) => {
        if (savedConnector.value === "metamask") return;
        console.error(error);
        if (initOptions.value?.onDisconnect) {
          initOptions.value?.onDisconnect();
        }
        resetState();
      });
    }
  };
  const addEthereumChain = async (params: {
    provider: any;
    option: ChainOption;
    chain: number;
  }) => {
    try {
      const { provider, option, chain } = params;
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: toHex(chain),
            chainName: option.name,
            nativeCurrency: {
              ...option.nativeCurrency,
            },
            rpcUrls: [option.rpcUrl],
            blockExplorerUrls: [option.explorer],
          },
        ],
      });
    } catch (error) {
      console.debug(error);
      throw error;
    }
  };
  const connectToCorrectChain = async (params: {
    provider: any;
    option: ChainOption;
    chain: number;
  }) => {
    const { provider, chain } = params;

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(chain) }],
      });
    } catch (error) {
      const switchError = error as any;
      const code = switchError.code;
      // eslint-disable-next-line
      if (code === 4902 || code === -32603) {
        // Error switch chain
        await addEthereumChain(params);
      } else {
        throw error;
      }
    }
  };
  const connectMetamask = async (params: {
    option: ChainOption;
    chain: number;
  }) => {
    const { option, chain } = params;
    if (!window.ethereum) {
      throw new Error("No provider was found");
    }
    const provider = window.ethereum as Provider;
    const chainId = Number(
      await provider.request<string>({ method: "eth_chainId" })
    );
    if (chainId !== chain) {
      await connectToCorrectChain({ option, chain, provider });
    }
    const [account] = await provider.request<string[]>({
      method: "eth_requestAccounts",
    });
    return {
      account,
      provider,
      chain,
    };
  };
  const connectWalletConnect = async () => {
    if (initialized.value) {
      if (!walletConnectProvider.value) {
        throw new Error("No provider was found");
      }
      await walletConnectProvider.value.connect();
      return {
        account: walletConnectProvider.value.accounts[0],
        provider: walletConnectProvider.value,
        chain: walletConnectProvider.value.chainId,
      };
    }
  };
  const connectToWallet = async (id: string) => {
    if (loading.value) return;
    try {
      loading.value = true;
      const connectors = {
        metamask: connectMetamask,
        walletconnect: connectWalletConnect,
      } as Record<string, Function>;
      const connectorFunc = connectors[id]; // eslint-disable-line
      if (chainId.value && supportedChains.value) {
        const chainOption = supportedChains.value[chainId.value];
        const response = await connectorFunc({
          chain: chainId.value,
          option: chainOption,
        });
        onConnectResponse({ ...response, connectorId: id });
      } else {
        throw new Error("Cannot find chainId and supportedChains");
      }
    } catch (error) {
      console.error(error);
      if (initOptions.value?.onError) {
        initOptions.value?.onError(error);
      }
      errors.value = error as Error;
    } finally {
      loading.value = false;
    }
  };
  const handleSwitchChain = (chain: number) => {
    if (supportedChains.value) {
      const chainOption = supportedChains.value[chain];
      const response = connectToCorrectChain({
        chain,
        option: chainOption,
        provider: provider.value,
      });
      return response;
    } else {
      throw new Error(`Cannot find target chain data, chainId: ${chain}`);
    }
  };
  const disconnect = () => {
    if (typeof provider.value === "undefined") {
      throw new Error("provider is not initialized");
    }
    if (typeof provider.value.disconnect === "function") {
      provider.value.disconnect();
    }

    resetState();
  };
  if (initializeOptions) {
    initialize();
  }
  return {
    handleSwitchChain,
    connectToWallet,
    setChain,
    setAddress,
    onConnectResponse,
    disconnect,
    address,
    chainId,
    provider,

    loadingConnect: loading,
    savedConnector,
  };
};
