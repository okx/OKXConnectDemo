import { TONCHAIN } from "@okxconnect/core";
import { OKXTonProvider } from "@okxconnect/universal-provider";
import { OKXUniversalConnectUI } from "@okxconnect/ui";
import { defineComponent, ref } from "vue";
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
    const tonProofValue = ref("");

    const setTransaction = (val: string) => {
      transaction.value = JSON.parse(val);
    };

    const setTonProofValue = (val: string) => {
      tonProofValue.value = val;
    };

    return {
      chainId,
      chainName: props.chainName,
      transaction,
      transactionResult,
      setTransaction,
      tonProofValue,
      setTonProofValue,
    };
  },
  components: {
    ConnectLayout,
  },
  computed: {
    chainNamespaces() {
      let tonParams = {
        ton_addr: {
          name: "ton_addr",
        },
      };

      if (this.tonProofValue) {
        tonParams = Object.assign(tonParams, {
          ton_proof: {
            name: "ton_proof",
            payload: this.tonProofValue,
          },
        });
      }

      return {
        ton: {
          chains: [this.chainId],
          defaultChain: this.chainId,
          params: tonParams,
        },
      };
    },
  },
  methods: {
    ton_getAccount() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      const tonProvider = new OKXTonProvider(providerStore.provider);
      let result = tonProvider.account();
      if (result) {
        this.transactionResult = JSON.stringify(result);
      } else {
        this.transactionResult = "null";
      }
    },

    async ton_sendTransaction() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      const data = {
        messages: [
          {
            address: "EQARULUYsmJq1RiZ-YiH-IJLcAZUVkVff-KBPwEmmaQGH6aC",
            amount: "205000000",
            payload:
              "te6cckEBAgEAhwABbQ+KfqUAAADNgG7tIEATEtAIAO87mQKicbKgHIk4pSPP4k5xhHqutqYgAB7USnesDnCcECwbgQMBAJUlk4VhgBD3JEg1TUr75iTijBghOKm/sxNDXUBl7CD6WMut0Q85x4RafwA/Es89DBXoTxuqxVFxyBbzt9Rav2HBUKl7hmkvLuKHLBCW57aK",
          },
        ],
        validUntil: 1792481054,
        network: TONCHAIN.MAINNET,
      };
      this.transaction = data;

      const tonProvider = new OKXTonProvider(providerStore.provider);
      tonProvider
        .sendTransaction(data)
        .then((res) => {
          this.transactionResult = JSON.stringify(res);
        })
        .catch((e) => {
          console.error("Error:", e);
          this.transactionResult = JSON.stringify(e);
        });
    },
  },
});
