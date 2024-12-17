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
                <div>{{ chainName || "Tron" }} methods</div>
            </template>

            <el-button type="primary" @click="tron_signMessage()">tron_signMessage</el-button>

            <el-button type="primary" @click="tron_signMessageV2()">tron_signMessageV2</el-button>

            <el-divider/>

            <el-button type="primary" @click="tron_signTransaction(true)">tron_signTransaction(transfer)</el-button>

            <el-button type="primary" @click="tron_signAndSendTransactionContract(true)">
                tron_signTransaction(contract)
            </el-button>
            
            <el-button type="primary" @click="tron_signAndSendTransactionApprove(true)">
                tron_signTransaction(approve)
            </el-button>

            <el-divider/>

            <el-button type="primary" @click="tron_signTransaction(false)">
                tron_signAndSendTransaction(transfer)
            </el-button>

            <el-button type="primary" @click="tron_signAndSendTransactionContract(false)">
                tron_signAndSendTransaction(contract)
            </el-button>

            <el-button type="primary" @click="tron_signAndSendTransactionApprove(false)">
                tron_signAndSendTransaction(approve)
            </el-button>
        </el-card>
    </ConnectLayout>
</template>

<style src="./styles.css"></style>