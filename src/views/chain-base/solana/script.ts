import { defineComponent, ref } from "vue";
import { OKXUniversalConnectUI } from "@okxconnect/ui";
import { OKXSolanaProvider } from "@okxconnect/solana-provider";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import nacl from "tweetnacl";
import ConnectLayout from "@/common/connect/ConnectLayout.vue";
import { providerStore } from "@/state/store";

const SOLANA_CHAIN_PREFIX = "solana";

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
      solana: {
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
      solProvider: undefined as OKXSolanaProvider | undefined,
    };
  },
  components: {
    ConnectLayout,
  },
  computed: {
    usesSolanaChain() {
      return this.chainId.startsWith(SOLANA_CHAIN_PREFIX);
    },
  },
  methods: {
    getProvider() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        throw Error("No provider");
      }

      if (!this.solProvider) {
        this.solProvider = new OKXSolanaProvider(providerStore.provider);
      }
    },

    async prepareTransaction() {
      try {
        this.getProvider();
      } catch (e) {
        throw e;
      }

      const connection = new Connection(this.getSolConnect());

      const account = this.solProvider!.getAccount();
      if (!account) {
        throw Error("No account found");
      }
      const { blockhash } = await connection.getLatestBlockhash();

      return {
        account,
        blockhash,
      };
    },

    async sol_signMessage() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      this.transaction = {
        method: "solana_signMessage",
        params: {
          message: "Hello Solana",
          pubkey: "",
        },
      };

      const message = (await this.solProvider!.signMessage(
        "Hello Solana",
        this.chainId
      )) as { signature: Uint8Array; publicKey: string };

      console.log("sol signMessage message", message);

      const result = nacl.sign.detached.verify(
        new TextEncoder().encode("Hello Solana"),
        message.signature,
        new PublicKey(message.publicKey).toBytes()
      );
      console.log(result);
      this.transactionResult = String(result);
    },

    async sol_signVersionedTransaction() {
      let account;
      let blockhash;
      try {
        const prepItems = await this.prepareTransaction();
        account = prepItems.account;
        blockhash = prepItems.blockhash;
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const versionedTransactionMessage = new TransactionMessage({
        payerKey: account.publicKey,
        recentBlockhash: blockhash,
        instructions: [
          SystemProgram.transfer({
            fromPubkey: account.publicKey,
            toPubkey: account.publicKey,
            lamports: 100,
          }),
        ],
      }).compileToV0Message();

      let transaction = new VersionedTransaction(versionedTransactionMessage);
      this.transaction = transaction;

      let result = await this.solProvider!.signTransaction(
        transaction,
        this.chainId
      );
      console.log("sol_signTransaction result", JSON.stringify(result));
      if (typeof result == "string") {
        this.transactionResult = result;
      } else {
        this.transactionResult = JSON.stringify(result);
      }
    },

    async sol_signAndSendVersionedTransaction() {
      let account;
      let blockhash;
      try {
        const prepItems = await this.prepareTransaction();
        account = prepItems.account;
        blockhash = prepItems.blockhash;
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const versionedTransactionMessage = new TransactionMessage({
        payerKey: account.publicKey,
        recentBlockhash: blockhash,
        instructions: [
          SystemProgram.transfer({
            fromPubkey: account.publicKey,
            toPubkey: account.publicKey,
            lamports: 100,
          }),
        ],
      }).compileToV0Message();

      let transaction = new VersionedTransaction(versionedTransactionMessage);
      this.transaction = transaction;

      let result = await this.solProvider!.signAndSendTransaction(
        transaction,
        this.chainId
      );
      console.log("sol_signTransaction result", JSON.stringify(result));
      if (typeof result == "string") {
        this.transactionResult = result;
      } else {
        this.transactionResult = JSON.stringify(result);
      }
    },

    async sol_signAllVersionedTransactions() {
      let account;
      let blockhash;
      try {
        const prepItems = await this.prepareTransaction();
        account = prepItems.account;
        blockhash = prepItems.blockhash;
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const versionedTransactionMessage = new TransactionMessage({
        payerKey: account.publicKey,
        recentBlockhash: blockhash,
        instructions: [
          SystemProgram.transfer({
            fromPubkey: account.publicKey,
            toPubkey: account.publicKey,
            lamports: 100,
          }),
        ],
      }).compileToV0Message();

      let transaction = new VersionedTransaction(versionedTransactionMessage);
      this.transaction = transaction;

      let result = await this.solProvider!.signAllTransactions(
        [transaction],
        this.chainId
      );
      console.log("sol_signTransaction result", JSON.stringify(result));
      if (typeof result == "string") {
        this.transactionResult = result;
      } else {
        this.transactionResult = JSON.stringify(result);
      }
    },

    async sol_signAndSendTransaction() {
      let account;
      let blockhash;
      try {
        const prepItems = await this.prepareTransaction();
        account = prepItems.account;
        blockhash = prepItems.blockhash;
      } catch (e) {
        console.error((e as Error).message);
        return;
      }
      const transaction = new Transaction({
        feePayer: account.publicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: account.publicKey,
          toPubkey: account.publicKey,
          lamports: 100,
        })
      );
      this.transaction = transaction;

      const result = await this.solProvider!.signAndSendTransaction(
        transaction,
        this.chainId
      );
      this.transactionResult = JSON.stringify(result);
    },

    async sol_signTransaction() {
      let account;
      let blockhash;
      try {
        const prepItems = await this.prepareTransaction();
        account = prepItems.account;
        blockhash = prepItems.blockhash;
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const transaction = new Transaction({
        feePayer: account.publicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: account.publicKey,
          toPubkey: account.publicKey,
          lamports: 1000,
        })
      );

      this.transaction = transaction;
      let result = await this.solProvider!.signTransaction(
        transaction,
        this.chainId
      );
      console.log("sol_signTransaction result", JSON.stringify(result));
      if (typeof result == "string") {
        this.transactionResult = result;
      } else {
        this.transactionResult = JSON.stringify(result);
      }
    },

    async sol_signAllTransactions() {
      let account;
      let blockhash;
      try {
        const prepItems = await this.prepareTransaction();
        account = prepItems.account;
        blockhash = prepItems.blockhash;
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const transaction = new Transaction({
        feePayer: account.publicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: account.publicKey,
          toPubkey: account.publicKey,
          lamports: 100,
        })
      );
      this.transaction = transaction;

      let result = await this.solProvider!.signAllTransactions(
        [transaction],
        this.chainId
      );
      if (typeof result == "string") {
        this.transactionResult = result;
      } else {
        this.transactionResult = JSON.stringify(result);
      }
    },

    getSolConnect() {
      let rpc = "https://www.okx.com/fullnode/sol/discover/rpc";
      if (this.chainId === "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp") {
        rpc = "https://www.okx.com//fullnode/sol/discover/rpc";
      } else if (this.chainId === "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z") {
        rpc = "https://www.okx.com/fullnode/soltestnet/discover/rpc";
      } else if (this.chainId === "svm:70000062") {
        rpc = "https://www.okx.com/fullnode/sonic/testnet/discover/rpc";
      }
      return rpc;
    },
  },
});
