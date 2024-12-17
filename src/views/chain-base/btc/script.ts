import { OKXBtcProvider } from "@okxconnect/universal-provider";
import { OKXUniversalConnectUI } from "@okxconnect/ui";
import { defineComponent, ref, toRef, type PropType } from "vue";
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

    const setTransaction = (val: string) => {
      transaction.value = JSON.parse(val);
    };

    const currentMethod = ref("");
    const nftId = ref("");
    const sendAmount = ref(0.000015);
    const sendSatoshisAmount = ref(17100);
    const psbtHex = ref("");
    const receiver = ref("");

    const methodPrefix = props.chainName?.toLowerCase() || "btc";
    const chainNamespaces = {
      btc: {
        chains: [chainId],
        defaultChain: chainId,
      },
    };

    return {
      chainId,
      chainName: props.chainName,
      methodPrefix,
      chainNamespaces,
      currentMethod,
      transaction,
      transactionResult,
      setTransaction,
      nftId,
      receiver,
      psbtHex,
      sendAmount,
      sendSatoshisAmount,
      btcProvider: undefined as OKXBtcProvider | undefined,
    };
  },
  components: {
    ConnectLayout,
  },
  methods: {
    hexToBase64(hexStr: string) {
      var bytes = [];
      for (var i = 0; i < hexStr.length; i += 2) {
        bytes.push(parseInt(hexStr.substr(i, 2), 16));
      }
      const buffer = new Uint8Array(bytes);
      const blob = new Blob([buffer]);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          if (e.target?.result) {
            var base64Data = (e.target.result as string).split(",")[1];
            resolve(base64Data);
          } else {
            reject("Invalid result");
          }
        };
        reader.onerror = function (e) {
          reject(e);
        };
        reader.readAsDataURL(blob);
      });
    },

    signMessage() {
      this.transaction = {
        from: "bc1p7pgnqe87red4cvd7ml6rh9pl9ufpr522k2y3dpeyrvfc6g2g3r3s3ae9dr",
        signStr:
          "Welcome to UniSat!\n\nClick to sign in and accept the UniSat Terms of Service (https://unisat.io/terms-of-service.html) and Privacy Policy (https://unisat.io/privacy-policy.html).\n    \nThis request will not trigger a blockchain transaction.\n    \nYour authentication status will reset after 24 hours.\n    \nWallet address:\nbc1p7pgnqe87red4cvd7ml6rh9pl9ufpr522k2y3dpeyrvfc6g2g3r3s3ae9dr\n    \nNonce:\n162d70e3-8c21-4cfd-9a22-9bf0a4b7be51\n",
      };
      this.currentMethod = `${this.methodPrefix}_signMessage`;
    },

    send() {
      if (this.sendAmount == 0) {
        alert("不能为零");
        return;
      }
      this.transaction = {
        from: "",
        to: "1NKnZ3uAuQLnmExA3WY44u1efwCgTiAxBn", // pattern测试钱包的legacy地址
        value: `${this.sendAmount}`,
      };
      this.currentMethod = `${this.methodPrefix}_send`;
    },

    sendBitcoin() {
      if (this.sendAmount == 0) {
        alert("不能为零");
        return;
      }

      this.transaction = {
        from: "",
        toAddress: "1NKnZ3uAuQLnmExA3WY44u1efwCgTiAxBn", // pattern测试钱包的legacy地址
        satoshis: this.sendSatoshisAmount,
        options: {
          feeRate: 16,
        },
      };
      this.currentMethod = `${this.methodPrefix}_sendBitcoin`;
    },

    signPsbt_up() {
      if (!this.psbtHex) {
        alert("请输入psbt");
        return;
      }

      this.transaction = {
        psbtHex: this.psbtHex,
        options: {
          autoFinalized: false,
        },
      };
      this.currentMethod = `${this.methodPrefix}_signPsbt`;
    },

    signAndPushPsbt_up() {
      if (!this.psbtHex) {
        alert("请输入psbt");
        return;
      }
      this.transaction = {
        psbtHex: this.psbtHex,
        options: {
          autoFinalized: true,
        },
      };
      this.currentMethod = `${this.methodPrefix}_signAndPushPsbt`;
    },

    sendInscription() {
      if (!this.nftId) {
        alert("请输入NFT ID");
        return;
      }

      if (!this.receiver) {
        alert("请输入接收者地址");
        return;
      }

      this.transaction = {
        address: this.receiver,
        inscriptionId: this.nftId,
        options: {
          feeRate: "15",
        },
      };
      this.currentMethod = `${this.methodPrefix}_sendInscription`;
    },

    async sendTransaction() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      if (!this.transaction || !this.currentMethod) {
        alert("Please select a transaction method first");
        return;
      }

      if (!this.btcProvider) {
        this.btcProvider = new OKXBtcProvider(providerStore.provider);
      }

      let method: () => Promise<unknown>;

      if (this.currentMethod.endsWith("_signMessage")) {
        const currentParams = this.transaction as { signStr: string };
        method = () =>
          this.btcProvider!.signMessage(this.chainId, currentParams["signStr"]);
      } else if (this.currentMethod.endsWith("_send")) {
        method = () => this.btcProvider!.send(this.chainId, this.transaction);
      } else if (this.currentMethod.endsWith("_signPsbt")) {
        const currentParams = this.transaction as {
          psbtHex: string;
          options: Object;
        };
        method = () =>
          this.btcProvider!.signPsbt(
            this.chainId,
            currentParams.psbtHex,
            currentParams.options
          ).then((res) => this.hexToBase64(res as string));
      } else if (this.currentMethod.endsWith("_signPsbts")) {
        const currentParams = this.transaction as {
          psbtHexs: string[];
          options: Object[];
        };
        method = () =>
          this.btcProvider!.signPsbts(
            this.chainId,
            currentParams.psbtHexs,
            currentParams.options
          );
      } else if (this.currentMethod.endsWith("_sendInscription")) {
        const currentParams = this.transaction as {
          address: string;
          inscriptionId: string;
          options: Object;
        };
        method = () =>
          this.btcProvider!.sendInscription(
            this.chainId,
            currentParams.address,
            currentParams.inscriptionId,
            currentParams.options
          );
      } else if (this.currentMethod.endsWith("_signAndPushPsbt")) {
        const currentParams = this.transaction as {
          psbtHex: string;
          options: Object;
        };
        method = () =>
          this.btcProvider!.signAndPushPsbt(
            this.chainId,
            currentParams.psbtHex,
            currentParams.options
          );
      } else if (this.currentMethod.endsWith("_sendBitcoin")) {
        const currentParams = this.transaction as {
          toAddress: string;
          satoshis: number;
          options: Object;
        };
        method = () =>
          this.btcProvider!.sendBitcoin(
            this.chainId,
            currentParams.toAddress,
            currentParams.satoshis,
            currentParams.options
          );
      } else {
        return;
      }

      method()
        .then((res) => {
          this.transactionResult = JSON.stringify(res);
        })
        .catch((e) => {
          this.transactionResult = JSON.stringify(e);
        });
    },
  },
});
