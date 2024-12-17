<script src="./script.ts" lang="ts"></script>

<template>
    <ConnectLayout
        :chainId="chainId"
        :chainNamespaces="chainNamespaces"
        :transaction="transaction"
        :onEditTransaction="setTransaction"
        :transactionResult="transactionResult"
        :tonProofValue="tonProofValue"
        :onEditTonProof="setTonProofValue"
    >
        <el-card>
            <template #header>
                <div>{{ chainName || "TON" }} methods</div>
            </template>
            <el-button type="primary" @click="ton_getAccount">ton_getAccount</el-button>
            <el-button type="primary" @click="ton_sendTransaction">ton_sendTransaction</el-button>
        </el-card>
    </ConnectLayout>
</template>

<style src="./styles.css"></style>