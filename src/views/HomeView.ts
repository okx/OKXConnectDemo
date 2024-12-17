import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
import { Chains } from ".";

export default defineComponent({
  components: {
    RouterLink,
  },
  setup() {
    return {
      Chains: Chains,
    };
  },
});
