<script src="./script.ts" lang="ts"></script>
<style scoped src="./styles.css"></style>

<template>
    <ConnectLayout 
        :chainId="chainId"
        :chainNamespaces="chainNamespaces"
        :method="currentMethod" 
        :transaction="transaction" 
        :onEditTransaction="setTransaction"
        :transactionResult="transactionResult"
        :sendTransaction="sendTransaction"
    >
        <el-card>
            <template #header>
                <div>{{ chainName || "BTC" }} methods</div>
                <ol class="subtitle-text">
                    <li>Click on the method's button to fill in the transaction information</li>
                    <li>Then, click "Send" after selecting a transaction</li>
                </ol>
            </template>
            <el-button type="warning" @click="signMessage()">{{ methodPrefix }}_signMessage</el-button>
            
            <el-divider/>

            <el-col :span="24">
                <p class="subtitle-text">(发送到Pattern测试钱包的legacy地址)</p>
                <el-row>
                    <p>Send amount:</p>
                    <el-input v-model="sendAmount" clearable placeholder="请输入要发送的数量" />
                </el-row>
                <el-button type="warning" @click="send()">{{ methodPrefix }}_send</el-button>
                <el-divider/>
                <el-row>
                    <p>Send amount (in satoshis):</p>
                    <el-input v-model="sendSatoshisAmount" clearable placeholder="请输入要发送的satoshi数量" />
                </el-row>
                <el-button type="warning" @click="sendBitcoin()">{{ methodPrefix }}_sendBitcoin</el-button>
            </el-col>

            <el-divider/>

            <el-col :span="24">
                <el-row>
                    <p>Psbt:</p>
                    <el-input v-model="psbtHex" clearable placeholder="请输入要签名的Psbt" />
                </el-row>
                <el-button type="warning" @click="signPsbt_up()">{{ methodPrefix }}_signPsbt(上架NFT)</el-button>
                <el-button type="warning" @click="signAndPushPsbt_up()">{{ methodPrefix }}_signAndPushPsbt(上架NFT)</el-button>
                <ol class="subtitle-text" style="margin-top: 8px">
                    <li>在OKX App选择要上架的 {{ chainName || "BTC" }} NFT，点击【上架</li>
                    <li>弹出签名面板，点开高级选项，查看</li>
                    <li>单击复制，就可以得到psbt。然后退出上架流程。</li>
                    <li>验证 https://chainquery.com/bitcoin-cli/decodepsbt</li>
                </ol>
            </el-col>

            <el-divider/>
            
            <el-col :span="24">
                <el-row>
                    <p>NFT ID:</p>
                    <el-input v-model="nftId" clearable placeholder="请输入要转移的NFT ID" />
                </el-row>
                <el-row>
                    <p>Receiving address:</p>
                    <el-input v-model="receiver" clearable placeholder="接收者钱包地址" />
                </el-row>
                <el-button type="warning" @click="sendInscription()">{{ methodPrefix }}_sendInscription</el-button>
                <ol class="subtitle-text" style="margin-top: 8px">
                    <li>在web端NFT界面，选择要发送的 {{ chainName || "BTC" }} NFT，打开详情</li>
                    <li>从NFT详情页URL中获取NFT id（url最后一部分）</li>
                    <li>复制到上面输入框中，再点击sendInscription按钮</li>
                </ol>
            </el-col>
        </el-card>
    </ConnectLayout>
</template>