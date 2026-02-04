<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder || '国家/地区 (alpha-2)'"
    clearable
    filterable
    style="width: 220px; margin-right: 8px;"
    @update:model-value="onUpdate"
  >
    <el-option
      v-for="c in countries"
      :key="c.alpha2"
      :label="getLabel(c)"
      :value="c.alpha2"
    />
  </el-select>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { CountryVO } from '@/api/countries'
import { countryOptions } from '@/api/countries'
import { formatCountryDisplay } from '@/utils/country'

defineProps<{
  modelValue?: string | null
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void
}>()

const countries = ref<CountryVO[]>([])

const load = async () => {
  try {
    countries.value = await countryOptions()
    console.log('select country', countries.value)
  } catch {
    // 忽略错误
  }
}

const onUpdate = (value: string | undefined) => {
  emit('update:modelValue', value)
}

const getLabel = (c: CountryVO) => {
  return formatCountryDisplay(c.alpha2, c.name, c.chineseName)
}

onMounted(load)
</script>
