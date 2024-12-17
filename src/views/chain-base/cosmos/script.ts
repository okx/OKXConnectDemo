import { defineComponent, ref } from "vue";
import { OKXCosmosProvider } from "@okxconnect/universal-provider";
import { OKXUniversalConnectUI } from "@okxconnect/ui";
import { fromBech32 } from "@cosmjs/encoding";
import { verifyADR36Amino } from "@keplr-wallet/cosmos";
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
      cosmos: {
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
      cosmosProvider: undefined as OKXCosmosProvider | undefined,
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

      if (!this.cosmosProvider) {
        this.cosmosProvider = new OKXCosmosProvider(providerStore.provider);
      }
    },

    async cosmos_signArbitrary() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const account = this.cosmosProvider!.getAccount(this.chainId);
      if (!account || !("address" in account)) {
        console.log("cosmos_signArbitrary: no account found");
        return;
      }

      try {
        const message = await this.cosmosProvider!.signArbitrary(
          this.chainId,
          (account as { address: string }).address,
          "test cosmos"
        );
        if (typeof message == "string") {
          this.transactionResult = message;
        } else {
          const isValid = await this.cosmos_verifySignArbitrary(
            (account as { address: string }).address,
            "test cosmos",
            message.signature,
            message.pub_key.value
          );
          console.log("verify", isValid);
          this.transactionResult =
            "verify:" + isValid + JSON.stringify(message);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    async cosmos_verifySignArbitrary(
      signer: string,
      data: string,
      signature: string,
      pubkey: string
    ) {
      try {
        console.log("cosmos_verifySignArbitrary signer:", signer);
        console.log("cosmos_verifySignArbitrary data:", JSON.stringify(data));
        console.log("cosmos_verifySignArbitrary signature:", signature);
        console.log("cosmos_verifySignArbitrary pubkey:", pubkey);

        // 将bech32地址转换为公钥
        const { prefix: prefixStr } = fromBech32(signer);

        const signatureBuffer = Buffer.from(signature, "base64");

        const uint8Signature = new Uint8Array(signatureBuffer); // Convert the buffer to an Uint8Array

        const pubKeyValueBuffer = Buffer.from(pubkey, "base64"); // Decode the base64 encoded value

        const pubKeyUint8Array = new Uint8Array(pubKeyValueBuffer); // Convert the buffer to an Uint8Array

        // 验证签名
        return await verifyADR36Amino(
          prefixStr,
          signer,
          data,
          pubKeyUint8Array,
          uint8Signature
        );
      } catch (err) {
        console.error("Verification failed:", err);
        return false;
      }
    },

    async cosmos_signAmino() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const account = this.cosmosProvider!.getAccount(this.chainId);
      if (!account || !("address" in account)) {
        console.log("cosmos_signAmino: no account found");
        return;
      }

      this.transaction = {
        chain_id: "osmosis-1",
        account_number: "630104",
        sequence: "480",
        fee: { gas: "683300", amount: [{ denom: "uosmo", amount: "2818" }] },
        msgs: [
          {
            type: "osmosis/poolmanager/swap-exact-amount-in",
            value: {
              sender: "osmo1u6lts9ng4etxj0zdaxsada6zgl8dudpgelmuyu",
              routes: [
                {
                  pool_id: "1096",
                  token_out_denom:
                    "ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4",
                },
                {
                  pool_id: "611",
                  token_out_denom:
                    "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                },
              ],
              token_in: { denom: "uosmo", amount: "100" },
              token_out_min_amount: "8",
            },
          },
        ],
        memo: "FE",
        timeout_height: "23603788",
        signOptions: {
          useOneClickTrading: false,
          preferNoSetFee: true,
          fee: { gas: "683300", amount: [{ denom: "uosmo", amount: "2818" }] },
        },
      };

      try {
        const res = await this.cosmosProvider!.signAmino(
          this.chainId,
          (account as { address: string }).address,
          this.transaction
        );
        if (typeof res == "string") {
          this.transactionResult = res;
        } else {
          this.transactionResult = JSON.stringify(res);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    async cosmos_signDirect() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const account = this.cosmosProvider!.getAccount(this.chainId);
      if (!account || !("address" in account)) {
        console.log("cosmos_signAmino: no account found");
        return;
      }

      this.transaction = {
        bodyBytes: this.messageToBuffer(
          "0x0ac1010a292f6962632e6170706c69636174696f6e732e7472616e736665722e76312e4d73675472616e736665721293010a087472616e7366657212096368616e6e656c2d301a0d0a05756f736d6f120431303030222b6f736d6f3175366c7473396e67346574786a307a64617873616461367a676c386475647067656c6d7579752a2d636f736d6f733175366c7473396e67346574786a307a64617873616461367a676c386475647067337967766a773207080410ebe3f90a3880b0bcafd18cec8218"
        ),
        authInfoBytes: this.messageToBuffer(
          "0x0a510a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a2102446e19e94ac0e83ea896d2712507577eb39fbdd2d6ae9f0fc0b9759f1fbaba9012040a02080118e00312140a0e0a05756f736d6f1205323530303010859a11"
        ),
        chainId: "osmosis-1",
        accountNumber: "630104",
      };

      try {
        const res = await this.cosmosProvider!.signDirect(
          this.chainId,
          (account as { address: string }).address,
          this.transaction
        );
        if (typeof res == "string") {
          this.transactionResult = res;
        } else {
          this.transactionResult = JSON.stringify(res);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    messageToBuffer(message: string) {
      try {
        return Buffer.from(message.replace("0x", ""), "hex");
      } catch (err) {
        console.log(`messageToBuffer error: ${err}`);
      }
    },
  },
});
