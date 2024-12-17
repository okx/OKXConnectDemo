import { defineComponent, ref } from "vue";
import { OKXSuiProvider } from "@okxconnect/sui-provider";
import { OKXUniversalConnectUI, type RequestArguments } from "@okxconnect/ui";
import { SuiClient } from "@mysten/sui/client";
import { Transaction as SuiTransaction } from "@mysten/sui/transactions";
import { verifyPersonalMessageSignature } from "@mysten/sui/verify";
import ConnectLayout from "@/common/connect/ConnectLayout.vue";
import { providerStore } from "@/state/store";

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
      sui: {
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
      suiProvider: undefined as OKXSuiProvider | undefined,
    };
  },
  components: {
    ConnectLayout,
  },
  methods: {
    getProvider() {
      if (!providerStore.provider) {
        alert("Please connect a wallet first");
        throw Error("No provider");
      }

      if (!this.suiProvider) {
        this.suiProvider = new OKXSuiProvider(providerStore.provider);
      }
    },

    async sui_verifySignature(signatureResult: { signature: string }) {
      let result = false;
      let msg = "";
      try {
        const account = this.suiProvider!.getAccount();
        console.log(`Account中获取的address：${account?.address}`);

        /// 验证签名
        let pubKey = await verifyPersonalMessageSignature(
          (this.transaction as { message: Uint8Array }).message,
          signatureResult.signature
        );
        let address = pubKey.toSuiAddress();
        console.log(`验签结果计算得到address：${address}`);

        /// 对比pubKey
        console.log(`account pubkey: ${account?.publicKey}`);
        console.log(`result pubkey: ${pubKey.toBase64()}`);
        result =
          account?.address === address &&
          account?.publicKey === pubKey.toBase64();

        msg = `address verify: ${
          account?.address === address
        }\npublicKey verify: ${account?.publicKey === pubKey.toBase64()}`;
        console.log("signature verify success: ", pubKey);
      } catch (e) {
        console.log("signature verify failed: ", e);
      }
      return {
        result,
        msg,
      };
    },

    sui_getAccount() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      try {
        const result = this.suiProvider!.getAccount();
        this.transactionResult = result ? JSON.stringify(result) : "";
      } catch (e) {
        console.log("Sui error:", e);
        this.transactionResult = JSON.stringify(e);
      }
    },

    //对单个交易签名（不发送)
    async sui_signMessage() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const data = [
        76, 111, 103, 105, 110, 32, 119, 105, 116, 104, 32, 66, 108, 117, 101,
        109, 111, 118, 101,
      ];
      const uint8Array = new Uint8Array(data);
      this.transaction = {
        message: uint8Array,
      };

      try {
        const result = await this.suiProvider!.signMessage(this.transaction);
        this.transactionResult = result ? JSON.stringify(result) : "";

        if (result && "signature" in result) {
          this.sui_verifySignature(result).then((res) => {
            this.transactionResult = JSON.stringify(res);
          });
        }
      } catch (e) {
        console.log("Sui error:", e);
        this.transactionResult = JSON.stringify(e);
      }
    },

    async sui_signPersonalMessage() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      const data = [
        76, 111, 103, 105, 110, 32, 119, 105, 116, 104, 32, 66, 108, 117, 101,
        109, 111, 118, 101,
      ];
      const uint8Array = new Uint8Array(data);
      this.transaction = {
        message: uint8Array,
      };

      try {
        const result = await this.suiProvider!.signPersonalMessage(
          this.transaction
        );
        this.transactionResult = result ? JSON.stringify(result) : "";

        if (result && "signature" in result) {
          this.sui_verifySignature(result).then((res) => {
            this.transactionResult = JSON.stringify(res);
          });
        }
      } catch (e) {
        console.log("Sui error:", e);
        this.transactionResult = JSON.stringify(e);
      }
    },

    async sui_signTransaction2() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      // 定义要转移的金额和目标地址
      const amount = 109; // 需要转移的金额
      /// Rally Tiger钱包地址
      const recipientAddress =
        "0x72f798f8b709902453d4bb55c65661e9e04154a506765f2333dfb7e7834056d2"; // 目标地址

      /// 构造一个转账的交易
      const tx = new SuiTransaction();
      const [coin] = tx.splitCoins(tx.gas, [amount]);
      tx.transferObjects([coin], recipientAddress);
      const data = {
        transactionBlock: tx,
        account: {},
        chain: "sui:mainnet",
        options: {
          showEffects: true,
        },
      };

      this.transaction = {
        ...data,
        transactionBlock: JSON.stringify(tx),
      };

      try {
        const result = await this.suiProvider!.signTransaction(data);
        this.transactionResult = result ? JSON.stringify(result) : "";
      } catch (e) {
        console.log("Sui error:", e);
        this.transactionResult = JSON.stringify(e);
      }
    },

    async sui_requestRpc() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      providerStore.provider!.setDefaultChain(
        `sui:mainnet`,
        `https://fullnode.mainnet.sui.io:443`
      );

      this.transaction = {
        method: "suix_getBalance",
        params: [
          "0x51ceab2edc89f74730e683ebee65578cb3bc9237ba6fca019438a9737cf156ae",
          "0x168da5bf1f48dafc111b0a488fa454aca95e0b5e::usdc::USDC",
        ],
      };

      try {
        const result = await providerStore.provider!.request(
          this.transaction as RequestArguments,
          this.chainId
        );
        this.transactionResult = result ? JSON.stringify(result) : "";
      } catch (e) {
        console.log("Sui error:", e);
        this.transactionResult = JSON.stringify(e);
      }
    },

    /// 预执行，提前生成txBytes和txSerizalize
    async sui_signTransaction_pre_execution() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      // 定义要转移的金额和目标地址
      const amount = 102; // 需要转移的金额
      /// Rally Tiger钱包地址
      const recipientAddress =
        "0x72f798f8b709902453d4bb55c65661e9e04154a506765f2333dfb7e7834056d2"; // 目标地址

      /// 构造一个转账的交易
      const tx = new SuiTransaction();
      const [coin] = tx.splitCoins(tx.gas, [amount]);
      tx.transferObjects([coin], recipientAddress);
      const data = {
        transactionBlock: tx,
        options: {
          showEffects: true,
        },
      };

      /// 预执行，生成txBytes和txSerialize
      const [txBytes, txSerialize] = await this.generateTsBytesAndSerialize(
        data
      );

      Object.assign(data, {
        txBytes: txBytes,
        txSerialize: txSerialize,
      });

      this.transaction = {
        ...data,
        transactionBlock: JSON.stringify(tx),
      };

      try {
        const result = await this.suiProvider!.signTransaction(data);
        this.transactionResult = result ? JSON.stringify(result) : "";
      } catch (e) {
        console.log("Sui error:", e);
        this.transactionResult = JSON.stringify(e);
      }
    },

    /// 预执行，提前生成txBytes和txSerizalize
    async sui_signAndExecuteTransaction_pre_execution() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      // 定义要转移的金额和目标地址
      const amount = 115; // 需要转移的金额
      /// Rally Tiger钱包地址
      const recipientAddress =
        "0x72f798f8b709902453d4bb55c65661e9e04154a506765f2333dfb7e7834056d2"; // 目标地址

      /// 构造一个转账的交易
      const tx = new SuiTransaction();
      const [coin] = tx.splitCoins(tx.gas, [amount]);
      tx.transferObjects([coin], recipientAddress);

      const data = {
        transactionBlock: tx,
        options: {
          showEffects: true,
        },
      };

      /// 预执行，生成txBytes和txSerialize
      const [txBytes, txSerialize] = await this.generateTsBytesAndSerialize(
        data
      );

      Object.assign(data, {
        txBytes: txBytes,
        txSerialize: txSerialize,
      });

      this.transaction = {
        ...data,
        transactionBlock: JSON.stringify(tx),
      };

      try {
        const result = await this.suiProvider!.signAndExecuteTransaction(data);
        this.transactionResult = result ? JSON.stringify(result) : "";
      } catch (e) {
        console.log("Sui error:", e);
        this.transactionResult = JSON.stringify(e);
      }
    },

    // generate txBytes and txSerialize
    async generateTsBytesAndSerialize(input: {
      transactionBlock: SuiTransaction;
      options: {
        showEffects: boolean;
      };
    }): Promise<String[]> {
      let resultTuple = ["", ""];

      // A transactionBlock parameter is required.
      if (!("transactionBlock" in input)) {
        return new Promise((resolve) => {
          resolve(resultTuple);
        });
      }
      const senderAccounts =
        providerStore.provider!.requestAccountsWithNamespace("sui");
      if (senderAccounts.length == 0) {
        return new Promise((resolve) => {
          resolve(resultTuple);
        });
      }

      try {
        const rpcUrl = "https://www.okx.com/fullnode/sui/discover/rpc";
        const suiClient = new SuiClient({ url: rpcUrl });

        /// sender is required
        input.transactionBlock.setSender(senderAccounts[0]);
        const result = await input.transactionBlock.build({
          client: suiClient,
        });
        const txBytes = Buffer.from(result).toString("base64");
        const txSerialize = await SuiTransaction.from(txBytes).toJSON();
        resultTuple = [txBytes, txSerialize];
      } catch (error) {
        return new Promise((resolve) => {
          resolve(resultTuple);
        });
      }

      return new Promise((resolve) => {
        resolve(resultTuple);
      });
    },

    async sui_signAndExecuteTransaction() {
      try {
        this.getProvider();
      } catch (e) {
        console.error((e as Error).message);
        return;
      }

      // 定义要转移的金额和目标地址
      const amount = 115; // 需要转移的金额
      /// Rally Tiger钱包地址
      const recipientAddress =
        "0x72f798f8b709902453d4bb55c65661e9e04154a506765f2333dfb7e7834056d2"; // 目标地址

      /// 构造一个转账的交易
      const tx = new SuiTransaction();
      const [coin] = tx.splitCoins(tx.gas, [amount]);
      tx.transferObjects([coin], recipientAddress);
      const data = {
        transactionBlock: tx,
        account: {},
        chain: "sui:mainnet",
        options: {
          showEffects: true,
        },
      };

      this.transaction = {
        ...data,
        transactionBlock: JSON.stringify(tx),
      };

      try {
        const result = await this.suiProvider!.signAndExecuteTransaction(data);
        this.transactionResult = result ? JSON.stringify(result) : "";
      } catch (e) {
        console.log("Sui error:", e);
        this.transactionResult = JSON.stringify(e);
      }
    },
  },
});
