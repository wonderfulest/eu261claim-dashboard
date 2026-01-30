<template>
  <div class="flight-history-container">
    <div class="header">
      <h2>航班历史查询</h2>
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <el-input
          v-model="flightIata"
          placeholder="航班号 (IATA)"
          clearable
          style="width: 180px"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="flightDate"
          placeholder="航班日期 (YYYY-MM-DD)"
          clearable
          style="width: 180px"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="warning" :loading="syncing" @click="handleSync">
          同步最近延误航班
        </el-button>
      </div>
    </div>

    <el-table :data="records" style="width: 100%" v-loading="loading">
      <el-table-column prop="flightNumber" label="航班号" width="130" />
      <el-table-column prop="flightDate" label="航班日期" width="120" />
      <el-table-column label="航司" min-width="180">
        <template #default="{ row }">
          <span>{{ row.airlineName }} ({{ row.airlineCode }})</span>
        </template>
      </el-table-column>
      <el-table-column label="出发机场" min-width="220">
        <template #default="{ row }">
          <span>{{ row.departureAirportIata }} - {{ row.departureAirportName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到达机场" min-width="220">
        <template #default="{ row }">
          <span>{{ row.arrivalAirportIata }} - {{ row.arrivalAirportName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划时间(STD/STA)" min-width="220">
        <template #default="{ row }">
          <div>STD: {{ row.std }}</div>
          <div>STA: {{ row.sta }}</div>
        </template>
      </el-table-column>
      <el-table-column label="实际时间" min-width="160">
        <template #default="{ row }">
          <span>{{ row.actualTime || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="arrivalDelayMinutes" label="到达延误(分钟)" width="150" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag>{{ row.status || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="建议动作" min-width="140" />
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
import {
  pageFlightsHistory,
  syncFlightsHistoryByNumber,
  type FlightSearchResultVO,
  type FlightsHistoryPageRequest
} from '@/api/flightsHistory'

const loading = ref(false)
const syncing = ref(false)
const records = ref<FlightSearchResultVO[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const flightIata = ref('')
const flightDate = ref('')

const buildQuery = (): FlightsHistoryPageRequest => {
  return {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    orderBy: 'flight_date desc',
    flightIata: flightIata.value?.trim() || undefined,
    flightDate: flightDate.value?.trim() || undefined
  }
}

const fetchPage = async () => {
  loading.value = true
  try {
    const res = await pageFlightsHistory(buildQuery())
    if (res.code === 0 && res.data) {
      records.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取航班历史失败')
    }
  } catch (e) {
    ElMessage.error('获取航班历史失败')
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
  flightIata.value = ''
  flightDate.value = ''
  pageNum.value = 1
  fetchPage()
}

const handleSync = async () => {
  syncing.value = true
  try {
    // 同步接口目前仅使用 pageSize 作为每页 limit，pageNum 作为最大页数 N
    // 这里仍然按照 DTO 结构传递 flightIata，便于后端后续按航班号做定向同步
    const syncReq: FlightsHistoryPageRequest = {
      flightIata: flightIata.value?.trim() || undefined,
      pageSize: 50,
      pageNum: 5
    }
    const res = await syncFlightsHistoryByNumber(syncReq)
    if (res.code === 0) {
      ElMessage.success('同步任务已完成，正在刷新列表')
      fetchPage()
    } else {
      ElMessage.error(res.msg || '同步失败')
    }
  } catch (e) {
    ElMessage.error('同步失败')
  } finally {
    syncing.value = false
  }
}

onMounted(() => {
  fetchPage()
})
</script>

<style scoped lang="scss">
.flight-history-container {
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
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
