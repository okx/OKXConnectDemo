<script src="./script.ts" lang="ts"></script>
<style src="./styles.css"></style>
<template>
    <el-container>
        <el-main>
            <el-col class="change-chain-col">
                <el-button
                    class="change-chain-btn"
                    text
                    @click="changeChain()"
                    :disabled="isCorrectChain && isConnected"
                >
                    {{ isCorrectChain ? "Change chain" : "Switch to connected chain" }}
                </el-button>
                <p v-if="isCorrectChain && isConnected">To change chains, please disconnect first.</p>
                <p v-if="!isCorrectChain && isConnected">You are not connected to this chain. Please switch to the connected chain or disconnect.</p>
            </el-col>

            <el-card class="wallet-info">
                <template #header>
                    <div>Wallet Info</div>
                </template>
                <el-col :span="24">
                    <p><strong>Status :</strong> {{ isConnected ? connectStatusStr : disconnectStatusStr }}</p>
                </el-col>
            </el-card>

            <ConfigurationCard
                v-if="isCorrectChain"
                :onClickUiCheckbox="onClickUiCheckbox"
                :showModal="showModal"
                :setShowModal="setShowModal"
                :qrValue="qrValue"
            />

            <!-- 连接钱包 -->
            <el-card class="wallet-actions">
                <template #header>
                    <div>Connect actions</div>
                </template>
                <el-row v-if="tonProofValue !== undefined">
                    <div class="input-label">Ton proof:</div>
                    <el-input 
                        v-model="computedTonProof" 
                        type="textarea" 
                        :rows="1" 
                        placeholder="ton proof"
                        :disabled="!onEditTonProof"
                    />
                </el-row>
                <el-col :span="24">
                    <el-button
                        type="primary"
                        @click="onConnectClick"
                        :disabled="isConnected"
                    >
                        {{ connectStr }}
                    </el-button>
                    <el-button
                        type="danger"
                        @click="onDisconnectClick"
                        :disabled="!isConnected"
                    >
                        {{ disconnectStr }}
                    </el-button>
                </el-col>
            </el-card>

            <slot v-if="isCorrectChain"></slot>

            <el-card class="transaction-actions" v-if="isCorrectChain">
                <template #header>
                    <div>Transaction actions</div>
                </template>
                <el-row :xs="24" :sm="12" v-if="computedMethod !== undefined">
                    <div class="input-label">Method:</div>
                    <el-input 
                        v-model="computedMethod" 
                        type="textarea" 
                        :rows="1" 
                        placeholder="method"
                        :disabled="!onEditMethod"
                    />
                </el-row>
                <el-row :xs="24" :sm="12" v-if="computedTransaction !== undefined">
                    <div class="input-label">Data:</div>
                    <el-input 
                        v-model="computedTransaction" 
                        type="textarea" 
                        :rows="5" 
                        placeholder="data"
                        :disabled="!onEditTransaction"
                    />
                </el-row>
                <el-row :xs="24" :sm="12" v-if="transactionResult !== undefined">
                    <div class="input-label">Result:</div>
                    <el-input 
                        v-model="transactionResult" 
                        type="textarea" 
                        :rows="5" 
                        placeholder="result"
                        :disabled="true"
                    />
                </el-row>
                <el-col :span="24" v-if="sendTransaction">
                    <el-button type="primary" @click="onSendTransaction()">
                        {{ sendTransactionStr }}
                    </el-button>
                </el-col>
            </el-card>
            
        </el-main>
    </el-container>
</template>
