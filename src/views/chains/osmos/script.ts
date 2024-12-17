import { defineComponent } from "vue";
import CosmosBaseView from "../../chain-base/cosmos/View.vue";

export default defineComponent({
  components: {
    CosmosBaseView,
  },
  setup() {
    return {
      chainId: "cosmos:osmosis-1",
      chainName: "Osmos",
    };
  },
});
