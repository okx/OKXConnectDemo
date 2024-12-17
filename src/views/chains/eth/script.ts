import { defineComponent } from "vue";
import EvmBaseView from "../../chain-base/evm/View.vue";

export default defineComponent({
  components: {
    EvmBaseView,
  },
  setup() {
    return {
      chainId: "eip155:1",
      chainMethods: [
        "wallet_switchEthereumChain",
        "wallet_addEthereumChain",
        "eth_sendTransaction_transfer",
        "eth_sendTransaction_approve",
        "eth_sendTransaction_mint",
        "wallet_watchAsset",
      ],
    };
  },
});
