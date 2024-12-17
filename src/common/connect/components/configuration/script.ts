import {
  OKXUniversalConnectUI,
  THEME,
  type Locales,
  type ReturnStrategy,
} from "@okxconnect/ui";
import { computed, defineComponent, ref, toRef } from "vue";
import type { PropType } from "vue";
import QrcodeVue from "qrcode.vue";
import { providerStore } from "@/state/store";

type ModalType = "before" | "success" | "error";
type ReturnStategyOption = "none" | "back" | "deeplink";
type DeepLinkType = `${string}://${string}`;

export default defineComponent({
  components: {
    QrcodeVue,
  },
  props: {
    onClickUiCheckbox: Function as PropType<(val: boolean) => void>,
    showModal: Boolean,
    setShowModal: Function as PropType<(val: boolean) => void>,
    qrValue: String,
  },
  setup(props) {
    const selectedModals = ref(["before", "success", "error"] as ModalType[]);
    const selectedReturnStrategyOption = ref("none" as ReturnStategyOption);
    const selectedDeepLink = ref("tg://resolve" as DeepLinkType);
    const selectedLanguage = ref("en_US" as Locales);
    const selectedTheme = ref(THEME.LIGHT);
    const selectedRedirectParam = ref("none");
    const selectedRedirectDeepLink = ref("tg://resolve");
    const withUI = ref(localStorage.getItem("autoRefresh") != "false");
    const qrValue = toRef(() => props.qrValue);
    const showModal = computed({
      get: () => props.showModal,
      set: (val: boolean) => props.setShowModal?.(val),
    });

    return {
      selectedModals,
      selectedReturnStrategyOption,
      selectedDeepLink,
      selectedLanguage,
      selectedTheme,
      selectedRedirectParam,
      selectedRedirectDeepLink,
      THEME: THEME,
      locales: [
        "en_US",
        "ru_RU",
        "zh_CN",
        "ar_AE",
        "cs_CZ",
        "de_DE",
        "es_ES",
        "es_LAT",
        "fr_FR",
        "id_ID",
        "it_IT",
        "nl_NL",
        "pl_PL",
        "pt_BR",
        "pt_PT",
        "ro_RO",
        "tr_TR",
        "uk_UA",
        "vi_VN",
        "zh_TW",
      ] as Locales[],
      returnStrategies: ["none", "back", "deeplink"] as ReturnStategyOption[],
      withUI,
      onClickUiCheckbox: props.onClickUiCheckbox,
      showModal,
      qrValue,
    };
  },
  computed: {
    selectedReturnStrategy() {
      if (this.selectedReturnStrategyOption === "deeplink") {
        return this.selectedDeepLink;
      }

      return this.selectedReturnStrategyOption;
    },
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },

    handleModalsSelect(modals: ModalType[]) {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      if (this.withUI) {
        (providerStore.provider as OKXUniversalConnectUI).uiOptions = {
          actionsConfiguration: {
            returnStrategy: this.selectedReturnStrategy,
            modals: modals.length === 3 ? "all" : modals,
          },
          language: this.selectedLanguage,
          uiPreferences: {
            theme: this.selectedTheme,
          },
        };
      }
    },

    handleReturnStrategySelect(returnStrategy: ReturnStategyOption) {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      if (returnStrategy === "deeplink") {
        this.selectedReturnStrategy = this.selectedDeepLink;
      }

      if (this.withUI) {
        (providerStore.provider as OKXUniversalConnectUI).uiOptions = {
          actionsConfiguration: {
            returnStrategy: this.selectedReturnStrategy,
            modals:
              this.selectedModals.length === 3 ? "all" : this.selectedModals,
          },
          language: this.selectedLanguage,
          uiPreferences: {
            theme: this.selectedTheme,
          },
        };
      }
    },

    handleReturnStrategyDeeplink(deeplink: string) {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      if (this.withUI) {
        (providerStore.provider as OKXUniversalConnectUI).uiOptions = {
          actionsConfiguration: {
            returnStrategy: deeplink as ReturnStrategy,
            modals:
              this.selectedModals.length === 3 ? "all" : this.selectedModals,
          },
          language: this.selectedLanguage,
          uiPreferences: {
            theme: this.selectedTheme,
          },
        };
      }
    },

    handleLanguageSelect(language: Locales) {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        return;
      }

      if (this.withUI) {
        (providerStore.provider as OKXUniversalConnectUI).uiOptions = {
          actionsConfiguration: {
            returnStrategy: this.selectedReturnStrategy,
            modals:
              this.selectedModals.length === 3 ? "all" : this.selectedModals,
          },
          language: language,
          uiPreferences: {
            theme: this.selectedTheme,
          },
        };
      }
    },

    handleThemeSelect(theme: THEME) {
      if (this.withUI) {
        (providerStore.provider as OKXUniversalConnectUI).uiOptions = {
          actionsConfiguration: {
            returnStrategy: this.selectedReturnStrategy,
            modals:
              this.selectedModals.length === 3 ? "all" : this.selectedModals,
          },
          language: this.selectedLanguage,
          uiPreferences: {
            theme: theme,
          },
        };
      }
    },
  },
});
