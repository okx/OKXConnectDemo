import type { OKXUniversalConnectUI } from "@okxconnect/ui";
import type { OKXUniversalProvider } from "@okxconnect/universal-provider";
import { reactive, type Reactive } from "vue";

interface ProviderStore {
  provider?: OKXUniversalProvider | OKXUniversalConnectUI;
  connectedChain?: string;
}

export const providerStore: Reactive<ProviderStore> = reactive({});
