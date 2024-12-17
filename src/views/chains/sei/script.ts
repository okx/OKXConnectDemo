import { defineComponent } from "vue";
import CosmosBaseView from "../../chain-base/cosmos/View.vue";

export default defineComponent({
  components: {
    CosmosBaseView,
  },
  setup() {
    return {
      chainId: "cosmos:pacific-1",
      chainName: "SEI",
    };
  },
});
