import { defineComponent } from "vue";
import BtcBaseView from "../../chain-base/btc/View.vue";

export default defineComponent({
  components: {
    BtcBaseView,
  },
  setup() {
    return {
      chainId: "btc:mainnet",
    };
  },
});
