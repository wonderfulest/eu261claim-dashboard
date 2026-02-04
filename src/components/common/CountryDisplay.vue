<template>
  <span>{{ text }}</span>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCountryStore } from '@/store/country'
import { formatCountryDisplay } from '@/utils/country'

const props = defineProps<{
  code?: string | null
}>()

const countryStore = useCountryStore()
const { list, loaded } = storeToRefs(countryStore)

const text = computed(() => {
  const code = props.code
  if (!code) return '-'
  const upper = code.toUpperCase()
  const found = list.value.find(c => c.alpha2 === upper)
  if (found) {
    return formatCountryDisplay(found.alpha2, found.name, found.chineseName)
  }
  return code
})

onMounted(() => {
  if (!loaded.value) {
    countryStore.fetchCountries().catch(() => {})
  }
})
</script>
