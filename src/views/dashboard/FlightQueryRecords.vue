<template>
  <div class="flight-query-records-container">
    <div class="header">
      <h2>网站搜索历史</h2>
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <el-input
          v-model="flightDate"
          placeholder="航班日期(YYYY-MM-DD)"
          clearable
          style="width: 180px"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="flightNumber"
          placeholder="航班号"
          clearable
          style="width: 160px"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="userId"
          placeholder="用户ID"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="sessionId"
          placeholder="Session ID"
          clearable
          style="width: 220px"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>

    <el-table :data="records" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column label="查询时间" width="180">
        <template #default="{ row }">{{ formatDateTime(row.queryTime) }}</template>
      </el-table-column>
      <el-table-column prop="flightDate" label="航班日期" width="130" />
      <el-table-column prop="flightNumber" label="航班号" width="120" />
      <el-table-column prop="airlineCode" label="航司" width="90" />
      <el-table-column prop="departureAirport" label="出发" width="100" />
      <el-table-column prop="arrivalAirport" label="到达" width="100" />
      <el-table-column prop="userId" label="用户ID" width="110" />
      <el-table-column prop="sessionId" label="Session" min-width="200" />
      <el-table-column prop="ipAddress" label="IP" width="140" />
      <el-table-column prop="countryCode" label="国家/地区" width="200">
        <template #default="{ row }">
          <CountryDisplay :code="row.countryCode" />
        </template>
      </el-table-column>
      <el-table-column prop="delayMinutes" label="延误(分钟)" width="110" />
      <el-table-column label="可赔" width="80">
        <template #default="{ row }">
          <el-tag :type="row.isEligible ? 'success' : 'info'">{{ row.isEligible ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="resultStatus" label="结果状态" width="120" />
      <el-table-column prop="claimId" label="ClaimID" width="110" />
      <el-table-column label="UA" min-width="240">
        <template #default="{ row }">
          <el-tooltip :content="row.userAgent" placement="top">
            <span class="ua-text">{{ truncate(row.userAgent, 80) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { pageFlightQueryRecords, type FlightQueryRecord } from '@/api/flightQueryRecord'
import CountryDisplay from '@/components/common/CountryDisplay.vue'
import { formatDateTime } from '@/utils/date'

const loading = ref(false)
const records = ref<FlightQueryRecord[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const flightDate = ref('')
const flightNumber = ref('')
const userId = ref('')
const sessionId = ref('')

const truncate = (text?: string | null, len = 80) => {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '…' : text
}

const parseUserId = (): number | undefined => {
  const raw = userId.value?.trim()
  if (!raw) return undefined
  const n = Number(raw)
  return Number.isFinite(n) ? n : undefined
}

const fetchPage = async () => {
  loading.value = true
  try {
    const res = await pageFlightQueryRecords({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      flightDate: flightDate.value?.trim() || undefined,
      flightNumber: flightNumber.value?.trim() || undefined,
      userId: parseUserId(),
      sessionId: sessionId.value?.trim() || undefined
    })
    if (res.code === 0 && res.data) {
      records.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取搜索历史失败')
    }
  } catch (e) {
    ElMessage.error('获取搜索历史失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  pageNum.value = 1
  fetchPage()
}

const handleCurrentChange = (page: number) => {
  pageNum.value = page
  fetchPage()
}

const handleSearch = () => {
  pageNum.value = 1
  fetchPage()
}

const handleReset = () => {
  flightDate.value = ''
  flightNumber.value = ''
  userId.value = ''
  sessionId.value = ''
  pageNum.value = 1
  fetchPage()
}

onMounted(() => {
  fetchPage()
})
</script>

<style scoped lang="scss">
.flight-query-records-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}
.ua-text {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
