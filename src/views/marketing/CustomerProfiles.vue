<template>
  <div class="customer-profiles-page">
    <div class="page-header">
      <h2>客户画像</h2>
      <div style="flex:1; display:flex; justify-content:flex-end; gap:8px;">
        <el-button @click="handleRefreshAll" :loading="refreshing">刷新画像</el-button>
      </div>
    </div>

    <div class="filters">
      <el-input
        v-model="query.customerId"
        placeholder="按客户ID搜索"
        clearable
        style="width: 220px; margin-right: 12px;"
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <el-table :data="list" style="width: 100%" :loading="loading" :default-sort="defaultSort" @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="80" sortable="custom" />
      <el-table-column prop="customerId" label="客户ID" width="120" sortable="custom" />
      <el-table-column prop="countryCode" label="国家/地区" min-width="160">
        <template #default="{ row }">
          <CountryDisplay :code="row.countryCode" />
        </template>
      </el-table-column>
      <el-table-column prop="customerValueLevel" label="客户价值等级" min-width="150">
        <template #default="{ row }">
          {{ renderEnumLabel('customer_value_level', row.customerValueLevel) }}
        </template>
      </el-table-column>
      <el-table-column prop="cooperationIntent" label="合作意向" min-width="150">
        <template #default="{ row }">
          {{ renderEnumLabel('cooperation_intent', row.cooperationIntent) }}
        </template>
      </el-table-column>
      <el-table-column prop="decisionSpeed" label="决策速度" min-width="120">
        <template #default="{ row }">
          {{ renderEnumLabel('decision_speed', row.decisionSpeed) }}
        </template>
      </el-table-column>
      <el-table-column prop="priceSensitivity" label="价格敏感度" min-width="140">
        <template #default="{ row }">
          {{ renderEnumLabel('price_sensitivity', row.priceSensitivity) }}
        </template>
      </el-table-column>
      <el-table-column prop="acquisitionCostLevel" label="获客成本等级" min-width="150">
        <template #default="{ row }">
          {{ renderEnumLabel('acquisition_cost_level', row.acquisitionCostLevel) }}
        </template>
      </el-table-column>
      <el-table-column prop="trafficQuality" label="流量质量" min-width="140">
        <template #default="{ row }">
          {{ renderEnumLabel('traffic_quality', row.trafficQuality) }}
        </template>
      </el-table-column>
      <el-table-column prop="leadQualityScore" label="线索质量评分" width="140" sortable="custom" />
      <el-table-column prop="recommendedContactMethod" label="推荐联系渠道" min-width="160">
        <template #default="{ row }">
          {{ renderEnumLabel('recommended_contact_method', row.recommendedContactMethod) }}
        </template>
      </el-table-column>
      <el-table-column prop="recommendedLanguage" label="推荐沟通语言" min-width="150" />
      <el-table-column prop="followUpPriority" label="跟进优先级" min-width="140" />
      <el-table-column prop="followUpCycle" label="跟进周期" min-width="160" />
      <el-table-column prop="updatedAt" label="更新时间" min-width="180" sortable="custom">
        <template #default="{ row }">{{ row.updatedAt }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-popconfirm title="确定删除该客户画像吗？" @confirm="doDelete(row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-bar">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="query.pageNum"
        :page-size="query.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <el-dialog v-model="editVisible" width="800px" title="编辑客户画像">
      <el-form :model="editForm" label-width="150px">
        <el-form-item label="国家/地区">
          <CountrySelect v-model="editForm.countryCode" />
        </el-form-item>
        <el-form-item label="客户价值等级">
          <el-select v-model="editForm.customerValueLevel" clearable placeholder="请选择">
            <el-option
              v-for="opt in getEnumOptions('customer_value_level')"
              :key="opt.value"
              :label="opt.name || opt.value"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合作意向">
          <el-select v-model="editForm.cooperationIntent" clearable placeholder="请选择">
            <el-option
              v-for="opt in getEnumOptions('cooperation_intent')"
              :key="opt.value"
              :label="opt.name || opt.value"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="决策速度">
          <el-select v-model="editForm.decisionSpeed" clearable placeholder="请选择">
            <el-option
              v-for="opt in getEnumOptions('decision_speed')"
              :key="opt.value"
              :label="opt.name || opt.value"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格敏感度">
          <el-select v-model="editForm.priceSensitivity" clearable placeholder="请选择">
            <el-option
              v-for="opt in getEnumOptions('price_sensitivity')"
              :key="opt.value"
              :label="opt.name || opt.value"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="获客成本等级">
          <el-select v-model="editForm.acquisitionCostLevel" clearable placeholder="请选择">
            <el-option
              v-for="opt in getEnumOptions('acquisition_cost_level')"
              :key="opt.value"
              :label="opt.name || opt.value"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流量质量">
          <el-select v-model="editForm.trafficQuality" clearable placeholder="请选择">
            <el-option
              v-for="opt in getEnumOptions('traffic_quality')"
              :key="opt.value"
              :label="opt.name || opt.value"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="线索质量评分">
          <el-input-number v-model="editForm.leadQualityScore" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="推荐联系渠道">
          <el-select v-model="editForm.recommendedContactMethod" clearable placeholder="请选择">
            <el-option
              v-for="opt in getEnumOptions('recommended_contact_method')"
              :key="opt.value"
              :label="opt.name || opt.value"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="推荐沟通语言">
          <el-input v-model="editForm.recommendedLanguage" />
        </el-form-item>
        <el-form-item label="跟进优先级">
          <el-input v-model="editForm.followUpPriority" />
        </el-form-item>
        <el-form-item label="跟进周期">
          <el-input v-model="editForm.followUpCycle" />
        </el-form-item>
        <el-form-item label="画像总结">
          <el-input v-model="editForm.profileSummary" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="风险备注">
          <el-input v-model="editForm.riskNotes" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { pageCustomerProfiles, updateCustomerProfile, deleteCustomerProfile, refreshAllCustomerProfiles, type CustomerProfileVO, type CustomerProfileUpdateDTO } from '@/api/customerProfile'
import { getCustomerProfileColumns, type TableColumn } from '@/api/metadata'
import CountrySelect from '@/components/common/CountrySelect.vue'
import CountryDisplay from '@/components/common/CountryDisplay.vue'

const loading = ref(false)
const list = ref<CustomerProfileVO[]>([])
const total = ref(0)

const defaultSort = ref<{ prop: string; order: 'ascending' | 'descending' }>({ prop: 'id', order: 'descending' })

const query = ref({
  pageNum: 1,
  pageSize: 10,
  customerId: undefined as number | undefined,
  orderBy: 'id desc' as string | undefined,
})

const enumColumns = ref<TableColumn[]>([])

const fetchEnumColumns = async () => {
  try {
    const res = await getCustomerProfileColumns()
    enumColumns.value = (res.data || []) as TableColumn[]
  } catch {}
}

const findEnumColumn = (field: string): TableColumn | undefined => {
  if (!field) return undefined
  return enumColumns.value.find(c => c.field === field && c.type === 'enum')
}

const getEnumOptions = (field: string) => {
  const col = findEnumColumn(field)
  if (!col || !Array.isArray(col.enumOptions)) return []
  return col.enumOptions
}

const renderEnumLabel = (field: string, value?: string | null) => {
  if (!value) return ''
  const opts = getEnumOptions(field)
  const found = opts.find(o => o.value === value)
  return found ? (found.name || found.value) : value
}

const fetchPage = async () => {
  loading.value = true
  try {
    const payload = { ...query.value }
    if (!payload.customerId) delete (payload as any).customerId
    const res = await pageCustomerProfiles(payload)
    if (res.code === 0 && res.data) {
      list.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取客户画像列表失败')
    }
  } catch (e) {
    ElMessage.error('获取客户画像列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.value.pageNum = 1
  fetchPage()
}

const handleReset = () => {
  const size = query.value.pageSize
  query.value = { pageNum: 1, pageSize: size, customerId: undefined, orderBy: 'id desc' }
  fetchPage()
}

const handlePageChange = (page: number) => {
  query.value.pageNum = page
  fetchPage()
}

const handleSizeChange = (size: number) => {
  query.value.pageSize = size
  query.value.pageNum = 1
  fetchPage()
}

const handleSortChange = (payload: { column: any; prop: string; order: 'ascending' | 'descending' | null }) => {
  const { prop, order } = payload || ({} as any)
  if (!order || !prop) {
    query.value.orderBy = undefined
  } else {
    const dir = order === 'ascending' ? 'asc' : 'desc'
    query.value.orderBy = `${prop} ${dir}`
  }
  query.value.pageNum = 1
  fetchPage()
}

const editVisible = ref(false)
const saving = ref(false)
const currentRow = ref<CustomerProfileVO | null>(null)
const editForm = ref<CustomerProfileUpdateDTO>({})

const openEdit = (row: CustomerProfileVO) => {
  currentRow.value = row
  editForm.value = {
    countryCode: row.countryCode || undefined,
    customerValueLevel: row.customerValueLevel || undefined,
    cooperationIntent: row.cooperationIntent || undefined,
    decisionSpeed: row.decisionSpeed || undefined,
    priceSensitivity: row.priceSensitivity || undefined,
    acquisitionCostLevel: row.acquisitionCostLevel || undefined,
    trafficQuality: row.trafficQuality || undefined,
    leadQualityScore: row.leadQualityScore ?? undefined,
    recommendedContactMethod: row.recommendedContactMethod || undefined,
    recommendedLanguage: row.recommendedLanguage || undefined,
    followUpPriority: row.followUpPriority || undefined,
    followUpCycle: row.followUpCycle || undefined,
    profileSummary: row.profileSummary || undefined,
    riskNotes: row.riskNotes || undefined,
  }
  editVisible.value = true
}

const handleSave = async () => {
  if (!currentRow.value) return
  saving.value = true
  try {
    const res = await updateCustomerProfile(currentRow.value.customerId, editForm.value)
    if (res.code === 0) {
      ElMessage.success('保存成功')
      editVisible.value = false
      fetchPage()
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const doDelete = async (row: CustomerProfileVO) => {
  try {
    const res = await deleteCustomerProfile(row.id)
    if (res.code === 0) {
      ElMessage.success('删除成功')
      fetchPage()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

const refreshing = ref(false)
const handleRefreshAll = async () => {
  refreshing.value = true
  try {
    const res = await refreshAllCustomerProfiles()
    if (res.code === 0) {
      ElMessage.success('已触发全量画像刷新')
    } else {
      ElMessage.error(res.msg || '触发画像刷新失败')
    }
  } catch (e) {
    ElMessage.error('触发画像刷新失败')
  } finally {
    refreshing.value = false
  }
}

onMounted(() => {
  fetchEnumColumns()
  fetchPage()
})
</script>

<style scoped>
.customer-profiles-page {
  padding: 16px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.filters {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.pagination-bar {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
