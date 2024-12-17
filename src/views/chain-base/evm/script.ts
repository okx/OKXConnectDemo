import { OKXUniversalConnectUI, type RequestArguments } from "@okxconnect/ui";
import { defineComponent, ref } from "vue";
import ConnectLayout from "@/common/connect/ConnectLayout.vue";
import { providerStore } from "@/state/store";

export default defineComponent({
  props: {
    chainId: { type: String, required: true },
    chainName: String,
    chainMethods: { type: Array, required: true },
  },
  setup(props) {
    const chainId = props.chainId;
    const transaction = ref({});
    const transactionResult = ref("");

    const setTransaction = (val: string) => {
      transaction.value = JSON.parse(val);
    };

    const chainNamespaces = {
      eip155: {
        chains: [chainId],
        defaultChain: chainId,
      },
    };

    return {
      chainId,
      chainNamespaces,
      chainName: props.chainName,
      chainMethods: props.chainMethods as string[],
      transaction,
      transactionResult,
      setTransaction,
    };
  },
  components: {
    ConnectLayout,
  },
  computed: {
    hasSwitchEthereumChain() {
      return this.chainMethods.includes("wallet_switchEthereumChain");
    },
    hasAddEthereumChain() {
      return this.chainMethods.includes("wallet_addEthereumChain");
    },
    hasSendTransactionTransfer() {
      return this.chainMethods.includes("eth_sendTransaction_transfer");
    },
    hasSendTransactionApprove() {
      return this.chainMethods.includes("eth_sendTransaction_approve");
    },
    hasSendTransactionMint() {
      return this.chainMethods.includes("eth_sendTransaction_mint");
    },
    hasSendTransactionSwap() {
      return this.chainMethods.includes("eth_sendTransaction_swap");
    },
    hasWatchAsset() {
      return this.chainMethods.includes("wallet_watchAsset");
    },
    hasTestRpc() {
      return this.chainMethods.includes("wallet_testRpc");
    },
  },
  methods: {
    async eth_requestAccounts() {
      this.transaction = { method: "eth_requestAccounts" };
    },

    async eth_chainId() {
      this.transaction = { method: "eth_chainId" };
    },

    async wallet_switchEthereumChain() {
      this.transaction = { method: "wallet_switchEthereumChain" };
    },

    async wallet_addEthereumChain() {
      this.transaction = {
        method: "wallet_addEthereumChain",
        params: {
          blockExplorerUrls: ["https://explorer.fuse.io"],
          chainId: "0x7a",
          chainName: "Fuse",
          nativeCurrency: { name: "Fuse", symbol: "FUSE", decimals: 18 },
          rpcUrls: ["https://rpc.fuse.io"],
        },
      };
    },

    async personal_sign() {
      console.log("evm personal sign", this.chainId);
      if (this.chainId === "eip155:1") {
        if (!providerStore.provider) {
          alert("Please connect a wallet first");
          return;
        }
        console.log("evm", providerStore.provider);
        const accounts: string[] = await providerStore.provider.request({
          method: "eth_requestAccounts",
        });
        console.log("accounts:", accounts);
        var address = accounts[0];
        console.log("签名地址>>>", address, JSON.stringify(accounts));

        this.transaction = {
          method: "personal_sign",
          params: [
            "0x4d7920656d61696c206973206a6f686e40646f652e636f6d202d2031373237353937343537313336",
            address,
          ],
        };
      } else if (
        this.chainId === "eip155:137" ||
        this.chainId === "eip155:122"
      ) {
        this.transaction = {
          method: "personal_sign",
          params: {
            message:
              "0x4d7920656d61696c206973206a6f686e40646f652e636f6d202d2031373237353937353831303437",
          },
        };
      } else if (this.chainId === "eip155:56") {
        this.transaction = {
          method: "personal_sign",
          params: {
            message:
              "0x4d7920656d61696c206973206a6f686e40646f652e636f6d202d2031373237353937353831303437",
          },
        };
      }
    },

    async eth_sendTransaction_swap() {
      this.transaction = {
        method: "eth_sendTransaction",
        chainId: "122",
        params: {
          value: "0x38d7ea4c68000",
          gas: "0x2665f",
          to: "0xf2614A233c7C3e7f08b1F887Ba133a13f1eb2c55",
          from: "0xf2F3e73be57031114dd1f4E75c1DD87658be7F0E",
          data: "0x2646478b000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000038d7ea4c68000000000000000000000000000620fd5fa44be6af63715ef4e65ddfa0387ad13f5000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000f2f3e73be57031114dd1f4e75c1dd87658be7f0e00000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000700301ffff0201602352A9Eb5234466Eac23E59e7B99bCaE79C39c0BE9e53fd7EDaC9F859882AfdDa116645287C629040BE9e53fd7EDaC9F859882AfdDa116645287C62900602352A9Eb5234466Eac23E59e7B99bCaE79C39c01f2F3e73be57031114dd1f4E75c1DD87658be7F0E000bb800000000000000000000000000000000",
        },
      };
    },

    async eth_signTypedData_v4() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      var accounts: string[] = await providerStore.provider.request(
        { method: "eth_requestAccounts" },
        "eip155"
      );
      var address = accounts[0];
      console.log("签名地址>>>", address, JSON.stringify(accounts));

      this.transaction = {
        method: "eth_signTypedData_v4",
        params: [
          address,
          {
            types: {
              EIP712Domain: [
                {
                  name: "name",
                  type: "string",
                },
                {
                  name: "version",
                  type: "string",
                },
                {
                  name: "chainId",
                  type: "uint256",
                },
                {
                  name: "verifyingContract",
                  type: "address",
                },
              ],
              Person: [
                {
                  name: "name",
                  type: "string",
                },
                {
                  name: "wallet",
                  type: "address",
                },
              ],
              Mail: [
                {
                  name: "from",
                  type: "Person",
                },
                {
                  name: "to",
                  type: "Person",
                },
                {
                  name: "contents",
                  type: "string",
                },
              ],
            },
            primaryType: "Mail",
            domain: {
              name: "Ether Mail",
              version: "1",
              chainId: 1,
              verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
            },
            message: {
              from: {
                name: "Cow",
                wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
              },
              to: {
                name: "Bob",
                wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
              },
              contents: "Hello, Bob!",
            },
          },
        ],
      };
    },
    async eth_sendTransaction_transfer() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      var accounts: string[] = await providerStore.provider.request(
        { method: "eth_requestAccounts" },
        "eip155"
      );
      var address = accounts[0];
      console.log("当前钱包地址------", address);

      if (this.chainId === "eip155:1") {
        this.transaction = {
          method: "eth_sendTransaction",
          params: {
            to: address,
            from: address,
            chainId: "0x1",
            value: "0x5af3107a4000",
            maxPriorityFeePerGas: "0x3b9aca00",
            gas: "0x5e56",
            maxFeePerGas: "0x2643b9db8",
          },
        };
      } else if (this.chainId === "eip155:137") {
        this.transaction = {
          method: "eth_sendTransaction",
          params: {
            to: address,
            from: address,
            gasPrice: "0x17003f6530",
            nonce: "0x0d30",
            data: "0x",
            value: "0x00",
            gasLimit: "0x5208",
          },
        };
      } else if (this.chainId === "eip155:56") {
        this.transaction = {
          method: "eth_sendTransaction",
          params: {
            to: address,
            from: address,
            gas: "0x5e56",
            value: "0x5af3107a4000",
            gasPrice: "0x3b9aca00",
            chainId: "0x38",
          },
        };
      }
    },

    async eth_sendTransaction_approve() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      var accounts: string[] = await providerStore.provider.request(
        { method: "eth_requestAccounts" },
        "eip155"
      );
      var address = accounts[0];
      console.log("当前钱包地址------", address);

      if (this.chainId === "eip155:1") {
        this.transaction = {
          method: "eth_sendTransaction",
          params: {
            from: address,
            data: "0x095ea7b3000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba3ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            to: "0x582d872a1b094fc48f5de31d3b73f2d9be47def1",
          },
        };
      } else if (this.chainId === "eip155:137") {
        this.transaction = {
          method: "eth_sendTransaction",
          params: {
            from: address,
            data: "0x095ea7b3000000000000000000000000f2614a233c7c3e7f08b1f887ba133a13f1eb2c5500000000000000000000000000000000000000000000000000f6f8096ac575b0",
            to: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
          },
        };
      } else if (this.chainId === "eip155:56") {
        this.transaction = {
          method: "eth_sendTransaction",
          params: {
            from: address,
            value: "0x0",
            gas: "0xe117",
            gasPrice: "0xb2d05e00",
            data: "0x095ea7b300000000000000000000000031c2f6fcff4f8759b3bd5bf0e1084a055615c768ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            to: "0x5CA42204cDaa70d5c773946e69dE942b85CA6706",
          },
        };
      }
    },

    async eth_sendTransaction_mint() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      var accounts: string[] = await providerStore.provider.request(
        { method: "eth_requestAccounts" },
        "eip155"
      );
      var address = accounts[0];
      console.log("当前钱包地址------", address);

      if (this.chainId === "eip155:1") {
        this.transaction = {
          method: "eth_sendTransaction",
          params: {
            gas: "0x4cacb",
            data: "0xa64dfa75000000000000000000000000ed688002f3797599db8b4feacfe8b1dda0df1c8d000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002e0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000003e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000042000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000052000000000000000000000000000000000000000000000000000000000000005400000000000000000000000000000000000000000000000000000000000000560000000000000000000000000000000000000000000000000000000000000058000000000000000000000000000000000000000000000000000000000000005a000000000000000000000000000000000000000000000000000000000000005c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cecb15396825a895ff8da8fc2d2c77a234dccee00000000000000000000000000000000000000000000000000000000000005e0000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000047697066733a2f2f6261667962656968643737366b6177706e71336f6f6a6635693274787a76617737737164656b34616a776472637472703261366f626b70723773792f7b69647d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078303030303030303030303030303030303030303030303030303030303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
            to: "0x864baa13e01d8f9e26549dc91b458cd15e34eb7c",
            value: "0x0",
            from: address,
          },
        };
      } else if (this.chainId === "eip155:137") {
        this.transaction = {
          method: "eth_sendTransaction",
          params: {
            gas: "0x30795",
            data: "0xa64dfa75000000000000000000000000341b3687f0309778f08f29336b2c4b9c38b9f110000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002e0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000003e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000042000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000052000000000000000000000000000000000000000000000000000000000000005400000000000000000000000000000000000000000000000000000000000000560000000000000000000000000000000000000000000000000000000000000058000000000000000000000000000000000000000000000000000000000000005a000000000000000000000000000000000000000000000000000000000000005c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f2f3e73be57031114dd1f4e75c1dd87658be7f0e00000000000000000000000000000000000000000000000000000000000005e0000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000047697066733a2f2f62616679626569686a6279676b68747a71376b68377434336266686e676e793236337668766f6578716a6d6e377161716166366e717a64743777712f7b69647d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078303030303030303030303030303030303030303030303030303030303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
            to: "0x864baa13e01d8f9e26549dc91b458cd15e34eb7c",
            value: "0x0",
            from: address,
          },
        };
      }

      let str = JSON.stringify(this.transaction);
      console.log("-----长度--->", str.length);
    },

    async wallet_testRpc() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      providerStore.provider.setDefaultChain(
        `eip155:56`,
        `https://eth-mainnet.g.alchemy.com/v2/NxUfYJUr-TQtEpLmSXhhD5pXn70GwsyV`
      );
      this.transaction = {
        method: "eth_getBalance",
        params: ["0x8D97689C9818892B700e27F316cc3E41e17fBeb9", "latest"],
      };
    },

    async wallet_watchAsset() {
      if (this.chainId === "eip155:1") {
        this.transaction = {
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: "0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c",
              symbol: "SPX6900",
              image:
                "https://assets.coingecko.com/coins/images/31401/standard/sticker_%281%29.jpg?1702371083",
              decimals: 8,
            },
          },
        };
      } else if (this.chainId === "eip155:137") {
        this.transaction = {
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: "0xeB51D9A39AD5EEF215dC0Bf39a8821ff804A0F01",
              symbol: "LGNS",
              image: "https://polygonscan.com/token/images/originlgns_32.png",
              decimals: 9,
            },
          },
        };
      } else if (this.chainId === "eip155:56") {
        this.transaction = {
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: "0x031b41e504677879370e9dbcf937283a8691fa7f",
              symbol: "FET",
              image: "https://bscscan.com/token/images/fetch_32.png",
              decimals: 18,
            },
          },
        };
      }
    },

    async sendTransaction() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      console.log("EVM sendTransaction: transaction:", this.transaction);
      providerStore.provider
        .request(this.transaction as RequestArguments, this.chainId)
        .then((res) => {
          this.transactionResult = JSON.stringify(res);
        })
        .catch((e) => {
          this.transactionResult = JSON.stringify(e);
        });
    },
  },
});
