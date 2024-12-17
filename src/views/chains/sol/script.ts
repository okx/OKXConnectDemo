import { defineComponent } from "vue";
import SolanaBaseView from "../../chain-base/solana/View.vue";

export default defineComponent({
  components: {
    SolanaBaseView,
  },
  setup() {
    return {
      chainId: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
    };
  },
});
