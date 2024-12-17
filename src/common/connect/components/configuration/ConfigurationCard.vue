<script src="./script.ts" lang="ts"></script>
<style src="./styles.css"></style>
<template>
    <el-card>
      <template #header>
        <div>Configuration</div>
      </template>

      <el-row class="info-row" :span="24" style="justify-content: center;">
          <el-checkbox v-model="withUI" @change="onClickUiCheckbox">Use UI</el-checkbox>
      </el-row>

      <teleport to="body">
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <button class="close-button" @click="closeModal">
              &times;
            </button>
            <h2>Scan to connect</h2>
            <qrcode-vue :value="qrValue" :size="350" level="L" />
          </div>
        </div>
      </teleport>

      <el-row style="align-items: center">
        <el-col :span="4">
          <p style="font-size: 11pt">Modals</p>
        </el-col>
        <el-col :span="20">
          <el-select v-model="selectedModals" placeholder="Modals" @change="handleModalsSelect" multiple>
            <el-option label="Before" value="before" />
            <el-option label="Success" value="success" />
            <el-option label="Error" value="error" />
          </el-select>
        </el-col>
      </el-row>

      <el-row style="align-items: center; justify-content: space-between;">
        <el-col :span="4" style="gap: 2px">
          <p style="font-size: 11pt; margin: 0px">Return Strategy</p>
          <p style="font-size: 9pt; margin: 0px">(Mobile only)</p>
        </el-col>
        <el-col :span="10">
          <el-select
            v-model="selectedReturnStrategyOption"
            @change="handleReturnStrategySelect"
            placeholder="Return Strategy"
          >
            <el-option
              v-for="strategy in returnStrategies"
              :key="`return-strategy-select-option-${strategy}`"
              :label="strategy"
              :value="strategy"
            />
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-input
            v-if="selectedReturnStrategyOption === 'deeplink'"
            v-model="selectedDeepLink"
            @change="handleReturnStrategyDeeplink"
            placeholder="Deeplink"
            :disabled="selectedReturnStrategyOption !== 'deeplink'"
            style="margin: 0px"
          />
        </el-col>
      </el-row>

      <el-row style="align-items: center">
        <el-col :span="4">
          <p style="font-size: 11pt">Language</p>
        </el-col>
        <el-col :span="20">
          <el-select v-model="selectedLanguage" @change="handleLanguageSelect" placeholder="Language">
            <el-option v-for="locale in locales" :key="`language-select-option-${locale}`" :label="locale"
              :value="locale" />
          </el-select>
        </el-col>
      </el-row>

      <el-row style="align-items: center">
        <el-col :span="4">
          <p style="font-size: 11pt">Theme</p>
        </el-col>
        <el-col :span="20">
          <el-select v-model="selectedTheme" @change="handleThemeSelect" placeholder="Theme">
            <el-option label="LIGHT" :value="THEME.LIGHT" />
            <el-option label="DARK" :value="THEME.DARK" />
          </el-select>
        </el-col>
      </el-row>
    </el-card>
</template>