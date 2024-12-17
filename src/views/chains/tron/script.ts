import { defineComponent } from "vue";
import TronBaseView from "../../chain-base/tron/View.vue";

export default defineComponent({
  components: {
    TronBaseView,
  },
  setup() {
    return {
      chainId: "tron:mainnet",
    };
  },
});
