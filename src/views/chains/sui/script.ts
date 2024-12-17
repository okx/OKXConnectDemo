import { defineComponent } from "vue";
import SuiBaseView from "../../chain-base/sui/View.vue";

export default defineComponent({
  components: {
    SuiBaseView,
  },
  setup() {
    return {
      chainId: "sui:mainnet",
    };
  },
});
