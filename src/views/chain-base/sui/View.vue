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
                <div>{{ chainName || "SUI" }} methods</div>
            </template>

            <el-button type="primary" @click="sui_getAccount()">sui_getAccount</el-button>

            <el-button type="primary" @click="sui_signMessage()">sui_signMessage</el-button>

            <el-button type="primary" @click="sui_signPersonalMessage()">
                sui_signPersonalMessage
            </el-button>
            
            <el-button type="primary" @click="sui_signTransaction2()">
                sui_signTransaction
            </el-button>
        
            <el-button type="primary" @click="sui_signAndExecuteTransaction()">
                sui_signAndExecuteTransaction
            </el-button>
        
            <el-col>
                <el-button type="primary" @click="sui_requestRpc">
                    RPC_getBalance
                </el-button>
                <div style="font-size: 12px; color: gray;">get USDC balance of address:</div>
                <div style="font-size: 12px; color: gray">0x51ceab2edc89f74730e683ebee65578cb3bc9237ba6fca019438a9737cf156ae</div>
            </el-col>
        
            <el-button type="primary" @click="sui_signTransaction_pre_execution()">
                sui_signTransaction (prepared data)
            </el-button>
            
            <el-button type="primary" @click="sui_signAndExecuteTransaction_pre_execution()">
                sui_signAndExecuteTransaction (prepared data)
            </el-button>
        </el-card>
    </ConnectLayout>
</template>

<style src="./styles.css"></style>