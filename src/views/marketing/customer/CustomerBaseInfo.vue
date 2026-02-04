<template>
  <el-descriptions title="基本信息" :column="2" border>
    <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
    <el-descriptions-item label="客户类型">{{ customerTypeText(detail.customerType) }}</el-descriptions-item>
    <el-descriptions-item label="客户名称">{{ detail.companyName }}</el-descriptions-item>
    <el-descriptions-item label="客户类型">{{ companyTypeText(detail.companyType) }}</el-descriptions-item>
    <el-descriptions-item label="国家"><CountryDisplay :code="detail.country" /></el-descriptions-item>
    <el-descriptions-item label="城市">{{ detail.city || '-' }}</el-descriptions-item>
    <el-descriptions-item label="来源渠道">{{ detail.sourceChannel || '-' }}</el-descriptions-item>
    <el-descriptions-item label="官网">{{ detail.website || '-' }}</el-descriptions-item>
    <el-descriptions-item label="主营产品">{{ detail.mainProducts || '-' }}</el-descriptions-item>
    <el-descriptions-item label="细分领域">{{ detail.specialization || '-' }}</el-descriptions-item>
    <el-descriptions-item label="员工规模">{{ detail.employeeSize || '-' }}</el-descriptions-item>
    <el-descriptions-item label="状态">{{ statusText(detail.status) }}</el-descriptions-item>
    <el-descriptions-item label="创建时间">{{ formatDateTime(detail.createdAt || '') }}</el-descriptions-item>
    <el-descriptions-item label="更新时间">{{ formatDateTime(detail.updatedAt || '') }}</el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { formatDateTime } from '@/utils/date'
import CountryDisplay from '@/components/common/CountryDisplay.vue'
import type { CustomerVO, CustomerTypeEnum, CustomerStatusEnum } from '@/types/customer'

const props = defineProps<{
  detail: CustomerVO
  customerTypeText: (v?: CustomerTypeEnum) => string
  statusText: (v?: CustomerStatusEnum) => string
}>()

const detail = props.detail
const customerTypeText = props.customerTypeText
const statusText = props.statusText
const companyTypeText = (v?: string | null) => {
  if (!v) return '-'
  // 保持与详情弹窗中的公司类型映射一致：优先用映射函数处理
  // 实际的映射逻辑在父组件 CustomerDetailDialog 中实现，这里仅作兜底
  return v
}
</script>
