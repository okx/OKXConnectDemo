import { defineComponent } from "vue";
import AptosBaseView from "../../chain-base/aptos/View.vue";

export default defineComponent({
  components: {
    AptosBaseView,
  },
  setup() {
    return {
      chainId: "aptos:mainnet",
    };
  },
});
