<script src="./script.ts" lang="ts"></script>

<template>
    <ConnectLayout
        :chainId="chainId"
        :chainNamespaces="chainNamespaces"
        :transaction="transaction"
        :transactionResult="transactionResult"
    >
        <el-card>
            <template #header>
                <div>{{ chainName || "Cosmos" }} methods</div>
            </template>

            <el-button type="primary" @click="cosmos_signArbitrary()">cosmos_signArbitrary</el-button>

            <el-button type="primary" @click="cosmos_signAmino()">cosmos_signAmino</el-button>

            <el-button type="primary" @click="cosmos_signDirect()">cosmos_signDirect</el-button>
        </el-card>
    </ConnectLayout>
</template>

<style src="./styles.css"></style>