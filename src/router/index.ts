import { createRouter, createWebHistory } from "vue-router";
import { ChainRouteMap, Chains } from "@/views";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: () => {
        const connectedChain = localStorage.getItem("connectedChain");
        if (connectedChain && connectedChain in ChainRouteMap) {
          const chainName = ChainRouteMap[connectedChain];
          alert(
            `You are currently connected to ${chainName.toUpperCase()}. Redirecting to /${chainName}.`
          );
          return { name: chainName, replace: true };
        }

        return true;
      },
    },
    ...Chains.map((chain) => ({
      path: `/${chain}`,
      name: chain,
      component: () => import(`../views/chains/${chain}/View.vue`),
    })),
  ],
});

export default router;
