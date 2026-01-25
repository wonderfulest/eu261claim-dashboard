<template>
  <div class="utms-url-editor">
    <el-form label-width="90px" class="utms-form" :model="state">
      <el-form-item label="基础链接" required>
        <el-input
          v-model="state.basePath"
          placeholder="例如：landing 或 landing/eu261"
          @change="emitUrl"
        >
          <template #prepend>
            <span>https://www.eu261claim.com/</span>
          </template>
          <template #append>
            <el-button type="primary" @click="emitUrl">应用</el-button>
          </template>
        </el-input>
      </el-form-item>

      <div class="utms-row">
        <el-form-item label="utm_source" required>
          <el-select v-model="state.utm_source" placeholder="流量平台" clearable @change="emitUrl">
            <el-option v-for="opt in sourceOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="utm_medium" required>
          <el-select v-model="state.utm_medium" placeholder="触达方式" clearable @change="emitUrl">
            <el-option v-for="opt in mediumOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
      </div>

      <div class="utms-row">
        <el-form-item label="utm_campaign" required>
          <el-select
            v-model="state.utm_campaign"
            placeholder="投放批次/主题"
            filterable
            allow-create
            default-first-option
            @change="onCampaignChange"
          >
            <el-option v-for="opt in campaignOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="utm_content">
          <el-select v-model="state.utm_content" placeholder="创意/话术" clearable filterable @change="emitUrl">
            <el-option v-for="opt in contentOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
      </div>

      <div class="utms-row">
        <el-form-item label="utm_term">
          <el-select
            v-model="state.utm_term"
            placeholder="目标人群（可自定义）"
            filterable
            allow-create
            default-first-option
            @change="emitUrl"
          >
            <el-option v-for="opt in termOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="预览">
        <el-input :model-value="fullUrl" readonly>
          <template #append>
            <el-button type="primary" @click="copyUrl">复制</el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const state = reactive({
  basePath: '',
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_content: '',
  utm_term: '',
})

const BASE_PREFIX = 'https://www.eu261claim.com/'

const sourceOptions = [
  { label: 'YouTube', value: 'youtube' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Google Maps', value: 'google_maps' },
  { label: 'Email', value: 'email' },
  { label: '官网', value: 'website' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Telegram', value: 'telegram' },
]

const mediumOptions = [
  { label: 'Shorts 短视频', value: 'shorts' },
  { label: '长视频', value: 'long_video' },
  { label: '主页链接', value: 'bio' },
  { label: '冷邮件', value: 'outreach' },
  { label: '邮件回复', value: 'reply' },
  { label: '私信', value: 'dm' },
  { label: 'Banner', value: 'banner' },
  { label: '页脚', value: 'footer' },
]

const campaignOptions = [
  { label: 'Q1 认知', value: 'eu261_2026q1_awareness' },
  { label: 'Q1 Shorts 系列', value: 'eu261_2026q1_shortvideo' },
  { label: 'Q1 旅行社外联', value: 'eu261_2026q1_agency_outreach' },
  { label: 'Q1 London 专项', value: 'eu261_2026q1_london' },
]

const contentOptions = [
  { label: '吐槽型', value: 'sarcasm' },
  { label: '数据型', value: 'fact' },
  { label: '解释型', value: 'explainer' },
  { label: '权威背书', value: 'authority' },
  { label: '案例', value: 'testimonial' },
  { label: '风险提醒', value: 'warning' },
  { label: '清单', value: 'checklist' },
]

const termOptions = [
  { label: '伦敦旅行社', value: 'agency_uk_london' },
  { label: '巴黎旅行社', value: 'agency_fr_paris' },
  { label: '柏林企业客户', value: 'corporate_de_berlin' },
  { label: '英国旅客', value: 'passenger_uk' },
  { label: '德国旅客', value: 'passenger_de' },
]

const normalize = (v: string): string => v.trim().toLowerCase().replace(/\s+/g, '_')

const buildUrl = (): string => {
  const cleanPath = state.basePath.trim().replace(/^\//, '')
  const base = BASE_PREFIX + cleanPath
  const url = new URL(base)
  const params = url.searchParams
  params.delete('utm_source')
  params.delete('utm_medium')
  params.delete('utm_campaign')
  params.delete('utm_content')
  params.delete('utm_term')

  if (state.utm_source) params.set('utm_source', normalize(state.utm_source))
  if (state.utm_medium) params.set('utm_medium', normalize(state.utm_medium))
  if (state.utm_campaign) params.set('utm_campaign', normalize(state.utm_campaign))
  if (state.utm_content) params.set('utm_content', normalize(state.utm_content))
  if (state.utm_term) params.set('utm_term', normalize(state.utm_term))

  url.search = params.toString()
  return url.toString()
}

const fullUrl = computed(() => buildUrl())

const emitUrl = () => {
  emit('update:modelValue', fullUrl.value)
}

const parseUrl = (value: string) => {
  if (!value) {
    state.basePath = ''
    state.utm_source = ''
    state.utm_medium = ''
    state.utm_campaign = ''
    state.utm_content = ''
    state.utm_term = ''
    return
  }
  try {
    const url = new URL(value)
    const full = url.origin + url.pathname
    if (full.startsWith(BASE_PREFIX)) {
      state.basePath = full.slice(BASE_PREFIX.length)
    } else {
      // 其他域名的链接，尽量保留路径部分作为 basePath，前缀仍然强制为 eu261claim 域名
      state.basePath = url.pathname.replace(/^\//, '')
    }
    const params = url.searchParams
    state.utm_source = params.get('utm_source') || ''
    state.utm_medium = params.get('utm_medium') || ''
    state.utm_campaign = params.get('utm_campaign') || ''
    state.utm_content = params.get('utm_content') || ''
    state.utm_term = params.get('utm_term') || ''
  } catch {
    // 无法解析时，只把原始值当成路径部分处理
    state.basePath = value.replace(/^https?:\/\//, '')
    state.utm_source = ''
    state.utm_medium = ''
    state.utm_campaign = ''
    state.utm_content = ''
    state.utm_term = ''
  }
}

watch(
  () => props.modelValue,
  (val) => {
    parseUrl(val)
  },
  { immediate: true }
)

const onCampaignChange = (val: string) => {
  if (val && !/^eu261_\d{4}q[1-4]_[a-z0-9_]+$/.test(val)) {
    ElMessage.warning('建议使用 eu261_年月_主题 的命名，例如 eu261_2026q1_london')
  }
  emitUrl()
}

const copyUrl = async () => {
  if (!fullUrl.value) {
    ElMessage.warning('没有可复制的链接')
    return
  }
  try {
    await navigator.clipboard.writeText(fullUrl.value)
    ElMessage.success('已复制')
  } catch {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.utms-url-editor {
  width: 100%;
}

.utms-form {
  margin-bottom: 4px;
}

.utms-row {
  display: flex;
  gap: 16px;
}

.utms-row .el-form-item {
  flex: 1;
}
</style>
