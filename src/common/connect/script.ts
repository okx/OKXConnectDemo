import { useShortLink } from "@okxconnect/core";
import {
  OKXUniversalConnectUI,
  THEME,
  type ConnectNamespaceMap,
  type SessionTypes,
} from "@okxconnect/ui";
import { OKXUniversalProvider } from "@okxconnect/universal-provider";
import router from "../../router";
import { computed, defineComponent, ref, toRef } from "vue";
import type { PropType } from "vue";
import { providerStore } from "@/state/store";
import ConfigurationCard from "./components/configuration/ConfigurationCard.vue";

export default defineComponent({
  components: {
    ConfigurationCard,
  },
  props: {
    chainId: { type: String, required: true },
    chainNamespaces: {
      type: Object as PropType<ConnectNamespaceMap>,
      required: true,
    },
    method: String,
    transaction: Object,
    transactionResult: String,
    sendTransaction: Function as PropType<() => Promise<unknown>>,
    onEditMethod: Function as PropType<(method: string) => void>,
    onEditTransaction: Function as PropType<(transaction: string) => void>,
    tonProofValue: String,
    onEditTonProof: Function as PropType<(proof: string) => void>,
  },
  setup(props) {
    const isConnected = ref(false);
    const isCorrectChain = ref(true);
    const chainNamespaces = toRef(() => props.chainNamespaces);
    const computedMethod = computed({
      get: () => props.method,
      set: (val: string) => props.onEditMethod?.(val),
    });
    const computedTransaction = computed({
      get: () => JSON.stringify(props.transaction),
      set: (val: string) => props.onEditTransaction?.(val),
    });
    const transactionResult = computed(() => props.transactionResult);
    const computedTonProof = computed({
      get: () => JSON.stringify(props.tonProofValue),
      set: (val: string) => props.onEditTonProof?.(val),
    });
    const showModal = ref(false);
    const setShowModal = (val: boolean) => {
      showModal.value = val;
    };
    const qrValue = ref("");

    return {
      chainId: props.chainId,
      chainNamespaces,
      computedMethod,
      computedTransaction,
      transactionResult,
      sendTransaction: props.sendTransaction,
      onEditMethod: props.onEditMethod,
      onEditTransaction: props.onEditTransaction,
      computedTonProof,
      connectReady: false,
      isConnected,
      isCorrectChain,
      connectStr: "Connect",
      disconnectStr: "Disconnect",
      connectStatusStr: "Connected",
      disconnectStatusStr: "Disconnected",
      sendTransactionStr: "Send",
      showModal,
      setShowModal,
      qrValue,
    };
  },
  computed: {
    isUseUi() {
      return localStorage.getItem("autoRefresh") != "false";
    },
  },
  mounted() {
    console.log("connect mounted", providerStore);
    var scriptTag = document.createElement("script");
    scriptTag.src = "https://telegram.org/js/telegram-web-app.js";
    scriptTag.id = "tgsdk";
    document.getElementsByTagName("head")[0].appendChild(scriptTag);

    this.connectReady = true;
    document.title = "OKX Connect";

    if (providerStore.provider) {
      this.addProviderListeners(
        providerStore.provider as OKXUniversalConnectUI | OKXUniversalProvider
      );
      if (providerStore.provider.session) {
        this.connectCallback(providerStore.provider.session);
      } else {
        this.checkIsCorrectChain();
      }
      return;
    }

    let initCall;
    if (this.isUseUi) {
      initCall = OKXUniversalConnectUI.init({
        dappMetaData: {
          icon: "https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png",
          name: "OKX Connect UI Example",
        },
        actionsConfiguration: {
          returnStrategy: "none",
          modals: "all",
        },
        language: "en_US",
        uiPreferences: {
          theme: THEME.LIGHT,
        },
      });
    } else {
      initCall = OKXUniversalProvider.init({
        dappMetaData: {
          icon: "https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png",
          name: "OKX Connect Example",
        },
      });
    }

    initCall.then((provider) => {
      console.log("init finished:", provider);
      console.log("init finished session:", JSON.stringify(provider.session));
      this.addProviderListeners(provider);
      providerStore.provider = provider;
    });
  },
  methods: {
    changeChain: () => router.push("/"),
    onClickUiCheckbox: (val: boolean) => {
      localStorage.setItem("autoRefresh", `${val}`);
      location.reload();
    },
    checkIsCorrectChain() {
      const wrongChain =
        providerStore.connectedChain &&
        providerStore.connectedChain !== this.chainId;
      console.log(
        "check correct chain",
        wrongChain,
        providerStore.connectedChain,
        this.chainId
      );
      if (this.isCorrectChain && wrongChain) {
        this.isCorrectChain = false;
      } else if (!this.isCorrectChain && !wrongChain) {
        this.isCorrectChain = true;
      }
    },
    isPC() {
      const userAgentInfo = navigator.userAgent;
      console.log("current device ua is ===>", userAgentInfo);

      const Agents = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod",
      ];
      let flag = true;
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },

    async onConnectClick() {
      if (providerStore.provider) {
        this.connectUiConnect();
      } else {
        console.log(`connectBtnClicked provider not finish init`);
      }
    },

    async onDisconnectClick() {
      try {
        console.log("get disconnect wallet btn clicked");
        await providerStore.provider?.disconnect();
      } catch (e: unknown) {
        const error = e as Error;
        console.error("Disconnect error: ", error);
      }

      if (!this.isCorrectChain) {
        location.reload();
      }
    },

    async connectUiConnect() {
      console.log(
        "ConnectLayout.connectUiConnect: chainId:",
        this.chainId,
        "chainNamespaces:",
        this.chainNamespaces
      );

      let connectMethod;
      if (providerStore.provider instanceof OKXUniversalConnectUI) {
        connectMethod = providerStore.provider.openModal({
          namespaces: this.chainNamespaces,
        });
      } else {
        connectMethod = (
          providerStore.provider as OKXUniversalProvider
        ).connect({
          namespaces: this.chainNamespaces,
        });
      }

      connectMethod
        .then(() => {
          if (this.isPC()) {
            this.showModal = false;
          }
        })
        .catch((error) => console.error("发生了错误：", error));
    },

    async onSendTransaction() {
      console.log(
        "sendTransaction",
        providerStore.provider,
        this.sendTransaction
      );
      if (!providerStore.provider) {
        console.error("钱包 未初始化完成");
        return;
      }

      this.sendTransaction?.();
    },

    connectCallback(session: SessionTypes.Struct) {
      console.log("connectcallback session", session, session.namespaces);
      if (session.namespaces) {
        const chain = Object.values(session.namespaces)[0].chains[0];
        providerStore.connectedChain = chain;
        console.log("setting chain");
        localStorage.setItem("connectedChain", chain);
      } else {
        providerStore.connectedChain = undefined;
        localStorage.removeItem("connectedChain");
      }
      this.isConnected = true;
      this.checkIsCorrectChain();
    },

    disconnectCallback() {
      providerStore.connectedChain = undefined;
      localStorage.removeItem("connectedChain");
    },

    addProviderListeners(
      provider: OKXUniversalProvider | OKXUniversalConnectUI
    ) {
      provider.on("display_uri", (uri: string) => {
        if (!useShortLink()) {
          if (this.isPC()) {
            if (uri && !this.isUseUi) {
              this.qrValue = uri;
              this.showModal = true;
            }
          }
        }
        console.log("通知>>>display_uri  ==> ", uri);
      });

      provider.on(
        "connect",
        (val: { session: SessionTypes.Struct } | SessionTypes.Struct) => {
          const session = "session" in val ? val.session : val;
          console.log("通知>>>get connect session", session);
          this.connectCallback(session);
        }
      );
      provider.on(
        "reconnect",
        (val: { session: SessionTypes.Struct } | SessionTypes.Struct) => {
          const session = "session" in val ? val.session : val;
          console.log("通知>>>get reconnect session", session);
          this.connectCallback(session);
        }
      );
      provider.on("disconnect", ({ topic }: { topic: string }) => {
        console.log(`通知>>>get disconnect  ${topic}`);
        providerStore.connectedChain = undefined;
        this.isConnected = false;
        this.disconnectCallback();
      });
      provider.on("session_delete", ({ topic }: { topic: string }) => {
        console.log(`通知>>>get session_delete  ${topic}`);
      });
      provider.on("session_update", (session: SessionTypes.Struct) => {
        console.log(`通知>>>get session_update `, JSON.stringify(session));
      });
    },
  },
});
