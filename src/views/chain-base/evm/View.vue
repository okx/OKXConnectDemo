<script src="./script.ts" lang="ts"></script>

<template>
    <ConnectLayout
        :chainId="chainId"
        :chainNamespaces="chainNamespaces"
        :transaction="transaction"
        :onEditTransaction="setTransaction"
        :transactionResult="transactionResult"
        :sendTransaction="sendTransaction"
    >
        <el-card>
            <template #header>
                <div>{{ chainName || "EVM" }} methods</div>
                <ol class="subtitle-text">
                    <li>Click on the method's button to fill in the transaction information</li>
                    <li>Then, click "Send" after selecting a transaction</li>
                </ol>
            </template>

            <el-button type="primary" @click="eth_requestAccounts">
                eth_requestAccounts
            </el-button>

            <el-button type="primary" @click="eth_chainId()">eth_chainId</el-button>
        
            <el-button type="primary" @click="personal_sign()">personal_sign</el-button>
        
            <el-button type="primary" @click="eth_signTypedData_v4()">
                eth_signTypedData_v4
            </el-button>
        
            <el-button type="primary" @click="wallet_switchEthereumChain" v-if="hasSwitchEthereumChain">
                wallet_switchEthereumChain
            </el-button>
        
            <el-button type="primary" @click="wallet_addEthereumChain" v-if="hasAddEthereumChain">
                wallet_addEthereumChain
            </el-button>
        
            <el-button type="primary" @click="eth_sendTransaction_transfer" v-if="hasSendTransactionTransfer">
                eth_sendTransaction (transfer)
            </el-button>
        
            <el-button type="primary" @click="eth_sendTransaction_approve" v-if="hasSendTransactionApprove">
                eth_sendTransaction (approve)
            </el-button>
            
            <el-button type="primary" @click="eth_sendTransaction_mint" v-if="hasSendTransactionMint">
                eth_sendTransaction (mint)
            </el-button>
            
            <el-button type="primary" @click="eth_sendTransaction_swap" v-if="hasSendTransactionSwap">
                eth_sendTransaction (swap)
            </el-button>

            <el-button type="primary" @click="wallet_watchAsset()" v-if="hasWatchAsset">
                wallet_watchAsset
            </el-button>

            <el-button type="primary" @click="wallet_testRpc()" v-if="hasTestRpc">
                wallet_testRpc
            </el-button>
        </el-card>
    </ConnectLayout>
</template>

<style src="./styles.css"></style>