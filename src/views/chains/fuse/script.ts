import { defineComponent } from "vue";
import EvmBaseView from "../../chain-base/evm/View.vue";

export default defineComponent({
  components: {
    EvmBaseView,
  },
  setup() {
    return {
      chainId: "eip155:122",
      chainName: "Fuse",
      chainMethods: ["eth_sendTransaction_swap"],
    };
  },
});
