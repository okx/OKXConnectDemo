import { defineComponent } from "vue";
import SolanaBaseView from "../../chain-base/solana/View.vue";

export default defineComponent({
  components: {
    SolanaBaseView,
  },
  setup() {
    return {
      chainId: "svm:70000062",
      chainName: "Sonic",
    };
  },
});
