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
                <div>{{ chainName || "SOL" }} methods</div>
            </template>

            <el-button type="primary" @click="sol_signMessage">solana_signMessage</el-button>

            <el-button type="primary" @click="sol_signTransaction">solana_signTransaction</el-button>

            <el-button type="primary" @click="sol_signVersionedTransaction" v-if="usesSolanaChain">
                solana_signVersionedTransaction
            </el-button>
            
            <el-button type="primary" @click="sol_signAllTransactions">
                solana_signAllTransactions
            </el-button>
        
            <el-button type="primary" @click="sol_signAllVersionedTransactions">
                solana_signAllVersionedTransactions
            </el-button>
        
            <el-button type="primary" @click="sol_signAndSendTransaction">
                solana_signAndSendTransaction
            </el-button>
        
            <el-button type="primary" @click="sol_signAndSendVersionedTransaction" v-if="usesSolanaChain">
                solana_signAndSendVersionedTransaction
            </el-button>
        </el-card>
    </ConnectLayout>
</template>

<style src="./styles.css"></style>