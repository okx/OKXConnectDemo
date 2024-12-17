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
                <div>{{ chainName || "Aptos" }} methods</div>
            </template>

            <el-button type="primary" @click="aptos_signMessage()">aptos_signMessage</el-button>

            <el-button type="primary" @click="aptos_signTransaction()" v-if="usesAptosChain">
                aptos_signTransaction
            </el-button>

            <el-button type="primary" @click="aptos_signAndSubmitTransaction()" v-if="usesAptosChain">
                aptos_signAndSubmitTransaction
            </el-button>

            <el-button type="primary" @click="move_signTransaction()" v-if="usesMovementChain">
                move_signTransaction
            </el-button>

            <el-button type="primary" @click="move_signAndSubmitTransaction()" v-if="usesMovementChain">
                move_signAndSubmitTransaction
            </el-button>
        </el-card>
    </ConnectLayout>
</template>

<style src="./styles.css"></style>