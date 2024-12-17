import { defineComponent, ref } from "vue";
import { OKXUniversalConnectUI } from "@okxconnect/ui";
import { OKXTronProvider } from "@okxconnect/universal-provider";
import { TronWeb } from "tronweb";
import ConnectLayout from "@/common/connect/ConnectLayout.vue";
import { providerStore } from "@/state/store";

export default defineComponent({
  props: {
    chainId: { type: String, required: true },
    chainName: String,
  },
  setup(props) {
    const chainId = props.chainId;

    const transaction = ref({});
    const transactionResult = ref("");

    const chainNamespaces = {
      tron: {
        chains: [chainId],
        defaultChain: chainId,
      },
    };

    return {
      chainId,
      chainNamespaces,
      chainName: props.chainName,
      transaction,
      transactionResult,
      tronProvider: undefined as OKXTronProvider | undefined,
    };
  },
  components: {
    ConnectLayout,
  },
  methods: {
    getProvider() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        throw Error("No provider");
      }

      if (!this.tronProvider) {
        this.tronProvider = new OKXTronProvider(providerStore.provider);
      }
    },

    async tron_signMessage() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }
      const account = this.tronProvider!.getAccount(this.chainId);
      if (!account) {
        console.log("tron_signMessage: no account found");
        return;
      }

      const message = "Hello Tron";
      this.transaction = Object.assign({}, message);
      const res = await this.tronProvider!.signMessage(message, "tron:mainnet");
      if (res.code) {
        this.transactionResult = JSON.stringify(res);
        return;
      }
      const tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
        headers: {},
        privateKey: "",
      });

      try {
        const verify = await tronWeb.trx.verifyMessage(
          "0x" + Buffer.from("Hello Tron").toString("hex"),
          res,
          (account as { address: string }).address
        );
        this.transactionResult = "verify:" + verify + "\n" + res;
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    async tron_signMessageV2() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }
      const account = this.tronProvider!.getAccount(this.chainId);
      if (!account) {
        console.log("tron_signMessageV2: no account found");
        return;
      }

      const message = "Hello Tron";
      this.transaction = Object.assign({}, message);

      const res = await this.tronProvider!.signMessageV2(
        "Hello Tron",
        "tron:mainnet"
      );
      if (res.code) {
        this.transactionResult = JSON.stringify(res);
        return;
      }

      const tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
        headers: {},
        privateKey: "",
      });
      const base58Address = await tronWeb.trx.verifyMessageV2(
        "Hello Tron",
        res
      );
      console.log("tron_signMessageV2_base58Address", base58Address);
      console.log(
        "tron_signMessageV2_address",
        (account as { address: string }).address
      );

      try {
        const verify =
          base58Address === (account as { address: string }).address;
        this.transactionResult = "verify:" + verify + "\n" + res;
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    async tron_signTransaction(isOnlySign: boolean) {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }
      const account = this.tronProvider!.getAccount(this.chainId);
      if (!account) {
        console.log("tron_signMessage: no account found");
        return;
      }

      const tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
        headers: {},
        privateKey: "",
      });
      this.transaction = await tronWeb.transactionBuilder.sendTrx(
        "TGBcVLMnVtvJzjPWZpPiYBgwwb7th1w3BF",
        1000,
        (account as { address: string }).address
      );

      try {
        if (isOnlySign) {
          const res = await this.tronProvider!.signTransaction(
            this.transaction,
            this.chainId
          );
          this.transactionResult = JSON.stringify(res);
        } else {
          const tx = await this.tronProvider!.signAndSendTransaction(
            this.transaction,
            this.chainId
          );
          this.transactionResult = JSON.stringify(tx);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    async tron_signAndSendTransactionContract(isOnlySign: boolean) {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }
      const account = this.tronProvider!.getAccount(this.chainId);
      if (!account) {
        console.log("tron_signMessage: no account found");
        return;
      }

      const tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
        headers: {},
        privateKey: "",
      });
      const contractAddress = "41e95812d8d5b5412d2b9f3a4d5a87ca15c5c51f33";

      const parameter = [
        { type: "uint256", value: 1 },
        { type: "uint256", value: 1 },
        { type: "uint256", value: 1 },
      ];
      const ret = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddress,
        "quote(uint256,uint256,uint256)",
        {},
        parameter,
        (account as { address: string }).address
      );

      console.log("=====>transaction: ");
      console.log(ret);
      this.transaction = ret.transaction;

      try {
        if (isOnlySign) {
          let tx = await this.tronProvider!.signTransaction(
            this.transaction,
            this.chainId
          );
          this.transactionResult = JSON.stringify(tx);
        } else {
          let tx = await this.tronProvider!.signAndSendTransaction(
            this.transaction,
            this.chainId
          );
          this.transactionResult = JSON.stringify(tx);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    async tron_signAndSendTransactionApprove(isOnlySign: boolean) {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      this.transaction = {
        visible: false,
        txID: "d1ed31b6abd2c37e248254681d3ee61b2e628fbd776def753b5592712ebd98c5",
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  data: "095ea7b3000000000000000000000000e95812d8d5b5412d2b9f3a4d5a87ca15c5c51f33ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                  owner_address: "4157c140be01fa2bbabf7f055ab879d0c05725293c",
                  contract_address:
                    "41b4a428ab7092c2f1395f376ce297033b3bb446c1",
                },
                type_url: "type.googleapis.com/protocol.TriggerSmartContract",
              },
              type: "TriggerSmartContract",
            },
          ],
          ref_block_bytes: "1bde",
          ref_block_hash: "af71fa1aa01b5bd1",
          expiration: Date.now() + 60000,
          fee_limit: 250000000,
          timestamp: Date.now(),
        },
        raw_data_hex:
          "0a021bde2208af71fa1aa01b5bd140f8b1fa98b4325aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a154157c140be01fa2bbabf7f055ab879d0c05725293c121541b4a428ab7092c2f1395f376ce297033b3bb446c12244095ea7b3000000000000000000000000e95812d8d5b5412d2b9f3a4d5a87ca15c5c51f33ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff70f1e6f698b432900180e59a77",
      };

      try {
        if (isOnlySign) {
          let tx = await this.tronProvider!.signTransaction(
            this.transaction,
            this.chainId
          );
          this.transactionResult = JSON.stringify(tx);
        } else {
          let tx = await this.tronProvider!.signAndSendTransaction(
            this.transaction,
            this.chainId
          );
          this.transactionResult = JSON.stringify(tx);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },
  },
});
