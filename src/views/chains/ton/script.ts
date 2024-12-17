import { defineComponent } from "vue";
import TonBaseView from "../../chain-base/ton/View.vue";

export default defineComponent({
  components: {
    TonBaseView,
  },
  setup() {
    return {
      chainId: "ton:-239",
    };
  },
});
