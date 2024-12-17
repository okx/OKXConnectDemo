import { defineComponent, ref } from "vue";
import { OKXUniversalConnectUI } from "@okxconnect/ui";
import { OKXAptosProvider } from "@okxconnect/aptos-provider";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import ConnectLayout from "@/common/connect/ConnectLayout.vue";
import { providerStore } from "@/state/store";

const APTOS_CHAIN_PREFIX = "aptos";
const MOVEMENT_CHAIN_PREFIX = "movement";

export default defineComponent({
  props: {
    chainId: { type: String, required: true },
    chainName: String,
  },
  setup(props) {
    const chainId = props.chainId;

    const transaction = ref({});
    const transactionResult = ref("");

    const chainNamespaces = {
      aptos: {
        chains: [chainId],
        defaultChain: chainId,
      },
    };

    return {
      chainId,
      chainNamespaces,
      chainName: props.chainName,
      transaction,
      transactionResult,
      aptosProvider: undefined as OKXAptosProvider | undefined,
    };
  },
  components: {
    ConnectLayout,
  },
  computed: {
    usesAptosChain() {
      return this.chainId.startsWith(APTOS_CHAIN_PREFIX);
    },
    usesMovementChain() {
      return this.chainId.startsWith(MOVEMENT_CHAIN_PREFIX);
    },
  },
  methods: {
    getProvider() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        throw Error("No provider");
      }

      if (!this.aptosProvider) {
        this.aptosProvider = new OKXAptosProvider(providerStore.provider);
      }
    },

    async aptos_signMessage() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      this.transaction = {
        address: true,
        application: true,
        chainId: true,
        message: "Hello Aptos",
        nonce: "1234",
      };

      try {
        let message = await this.aptosProvider!.signMessage(
          this.transaction,
          this.chainId
        );
        if (typeof message == "string") {
          this.transactionResult = message;
        } else {
          this.transactionResult = JSON.stringify(message);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    async aptos_signTransaction() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const config = new AptosConfig({ network: Network.MAINNET });
      const aptos = new Aptos(config);
      const account = this.aptosProvider!.getAccount(this.chainId);
      if (!account) {
        console.log("aptos_signTransaction: no account found");
        return;
      }

      this.transaction = await aptos.transaction.build.simple({
        sender: account.address,
        data: {
          // The Move entry-function
          function:
            "0x80273859084bc47f92a6c2d3e9257ebb2349668a1b0fb3db1d759a04c7628855::router::swap_exact_coin_for_coin_x1",
          // typeArguments: [parseTypeTag("0x1::aptos_coin::AptosCoin")],
          typeArguments: [
            "0x1::aptos_coin::AptosCoin",
            "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::stapt_token::StakedApt",
            "0x0163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Uncorrelated",
            "0x80273859084bc47f92a6c2d3e9257ebb2349668a1b0fb3db1d759a04c7628855::router::BinStepV0V05",
          ],
          functionArguments: ["10000", ["9104"], ["5"], ["true"]],
        },
      });

      try {
        const message = await this.aptosProvider!.signTransaction(
          this.transaction,
          this.chainId
        );
        if (typeof message == "string") {
          this.transactionResult = message;
        } else {
          this.transactionResult = JSON.stringify(message);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    async aptos_signAndSubmitTransaction() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const config = new AptosConfig({ network: Network.MAINNET });
      const aptos = new Aptos(config);
      const account = this.aptosProvider!.getAccount(this.chainId);
      if (!account) {
        console.log("aptos_signAndSubmitTransaction: no account found");
        return;
      }

      this.transaction = await aptos.transaction.build.simple({
        sender: account.address,
        data: {
          // The Move entry-function
          function:
            "0x80273859084bc47f92a6c2d3e9257ebb2349668a1b0fb3db1d759a04c7628855::router::swap_exact_coin_for_coin_x1",
          // typeArguments: [parseTypeTag("0x1::aptos_coin::AptosCoin")],
          typeArguments: [
            "0x1::aptos_coin::AptosCoin",
            "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::stapt_token::StakedApt",
            "0x0163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Uncorrelated",
            "0x80273859084bc47f92a6c2d3e9257ebb2349668a1b0fb3db1d759a04c7628855::router::BinStepV0V05",
          ],
          functionArguments: ["10000", ["9104"], ["5"], ["true"]],
        },
      });

      try {
        const message = await this.aptosProvider!.signAndSubmitTransaction(
          this.transaction,
          this.chainId
        );
        if (typeof message == "string") {
          this.transactionResult = message;
        } else {
          this.transactionResult = JSON.stringify(message);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    async move_signTransaction() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const config = new AptosConfig({ network: Network.MAINNET });
      const aptos = new Aptos(config);
      const account = this.aptosProvider!.getAccount(this.chainId);
      if (!account) {
        console.log("move_signTransaction: no account found");
        return;
      }

      this.transaction = await aptos.transaction.build.simple({
        sender: account.address,
        data: {
          // The Move entry-function
          function:
            "0x0163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::scripts::swap",
          // typeArguments: [parseTypeTag("0x1::aptos_coin::AptosCoin")],
          typeArguments: [
            "0x1::aptos_coin::AptosCoin",
            "0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::WBTC",
            "0x0163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Uncorrelated",
          ],
          functionArguments: ["10000", "12"],
        },
      });

      try {
        const message = await this.aptosProvider!.signTransaction(
          this.transaction,
          this.chainId
        );
        if (typeof message == "string") {
          this.transactionResult = message;
        } else {
          this.transactionResult = JSON.stringify(message);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },

    async move_signAndSubmitTransaction() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const config = new AptosConfig({ network: Network.MAINNET });
      const aptos = new Aptos(config);
      const account = this.aptosProvider!.getAccount(this.chainId);
      if (!account) {
        console.log("move_signAndSubmitTransaction: no account found");
        return;
      }

      this.transaction = await aptos.transaction.build.simple({
        sender: account.address,
        data: {
          // The Move entry-function
          function:
            "0x0163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::scripts::swap",
          // typeArguments: [parseTypeTag("0x1::aptos_coin::AptosCoin")],
          typeArguments: [
            "0x1::aptos_coin::AptosCoin",
            "0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::WBTC",
            "0x0163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Uncorrelated",
          ],
          functionArguments: ["10000", "12"],
        },
      });

      try {
        const message = await this.aptosProvider!.signAndSubmitTransaction(
          this.transaction,
          this.chainId
        );
        if (typeof message == "string") {
          this.transactionResult = message;
        } else {
          this.transactionResult = JSON.stringify(message);
        }
      } catch (e) {
        this.transactionResult = JSON.stringify(e);
      }
    },
  },
});
