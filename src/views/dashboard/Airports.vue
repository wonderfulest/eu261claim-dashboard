<template>
  <div class="airports-page">
    <h2>机场信息 / EU261 配置</h2>

    <el-tabs v-model="activeTab" class="tabs">
      <el-tab-pane label="基础信息" name="basic">
        <div class="filters">
          <el-input v-model="basicQuery.iataCode" placeholder="IATA 代码" clearable style="width: 140px; margin-right: 8px;" />
          <CountrySelect v-model="basicQuery.countryCode" />
          <el-input v-model="basicQuery.cityName" placeholder="城市名称" clearable style="width: 160px; margin-right: 8px;" />
          <el-select v-model="basicQuery.status" placeholder="状态" clearable style="width: 140px; margin-right: 8px;">
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
          </el-select>
          <el-button type="primary" @click="handleBasicSearch">查询</el-button>
          <el-button @click="handleBasicReset">重置</el-button>
        </div>

        <el-table :data="basicList" style="width: 100%" v-loading="basicLoading">
          <el-table-column prop="iataCode" label="IATA" width="100" />
          <el-table-column prop="icaoCode" label="ICAO" width="110" />
          <el-table-column prop="airportName" label="机场名(EN)" min-width="180" />
          <el-table-column prop="airportNameCn" label="机场名(中文)" min-width="180" />
          <el-table-column prop="countryCode" label="国家" width="200">
            <template #default="{ row }">
              <CountryDisplay :code="row.countryCode" />
            </template>
          </el-table-column>
          <el-table-column prop="cityName" label="城市" min-width="140" />
          <el-table-column prop="timezone" label="时区" width="120" />
          <el-table-column prop="airportType" label="类型" width="100" />
          <el-table-column prop="airportSize" label="规模" width="100" />
          <el-table-column prop="status" label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="openDetail(row.iataCode)">查看</el-button>
              <el-button type="primary" link size="small" @click="openBasicEdit(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="basicPageNum"
            v-model:page-size="basicPageSize"
            :total="basicTotal"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleBasicSizeChange"
            @current-change="handleBasicPageChange"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="EU261 配置" name="config">
        <div class="filters">
          <el-input v-model="configQuery.iataCode" placeholder="IATA 代码" clearable style="width: 140px; margin-right: 8px;" />
          <el-select v-model="configQuery.isInEu" placeholder="在欧盟" clearable style="width: 140px; margin-right: 8px;">
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
          <el-select v-model="configQuery.eu261Applicable" placeholder="EU261 适用" clearable style="width: 160px; margin-right: 8px;">
            <el-option :value="true" label="适用" />
            <el-option :value="false" label="不适用" />
          </el-select>
          <el-select v-model="configQuery.status" placeholder="状态" clearable style="width: 140px; margin-right: 8px;">
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
          </el-select>
          <el-button type="primary" @click="handleConfigSearch">查询</el-button>
          <el-button @click="handleConfigReset">重置</el-button>
        </div>

        <el-table :data="configList" style="width: 100%" v-loading="configLoading">
          <el-table-column prop="iataCode" label="IATA" width="100" />
          <el-table-column label="在欧盟" width="100">
            <template #default="{ row }">
              <el-tag :type="row.isInEu ? 'success' : 'info'">{{ row.isInEu ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="EU261 适用" width="120">
            <template #default="{ row }">
              <el-tag :type="row.eu261Applicable ? 'success' : 'warning'">
                {{ row.eu261Applicable ? '适用' : '不适用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="openDetail(row.iataCode)">查看</el-button>
              <el-button type="primary" link size="small" @click="openConfigEdit(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="configPageNum"
            v-model:page-size="configPageSize"
            :total="configTotal"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleConfigSizeChange"
            @current-change="handleConfigPageChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 机场详情抽屉 -->
    <el-drawer v-model="detailVisible" title="机场详情" size="50%" :with-header="true">
      <div v-loading="detailLoading">
        <h3>基础信息</h3>
        <el-descriptions v-if="detailBasic" :column="2" border style="margin-bottom: 16px;">
          <el-descriptions-item label="IATA">{{ detailBasic.iataCode }}</el-descriptions-item>
          <el-descriptions-item label="ICAO">{{ detailBasic.icaoCode }}</el-descriptions-item>
          <el-descriptions-item label="机场名(EN)">{{ detailBasic.airportName }}</el-descriptions-item>
          <el-descriptions-item label="机场名(中文)">{{ detailBasic.airportNameCn }}</el-descriptions-item>
          <el-descriptions-item label="国家代码">{{ detailBasic.countryCode }}</el-descriptions-item>
          <el-descriptions-item label="国家名称">{{ detailBasic.countryName }}</el-descriptions-item>
          <el-descriptions-item label="城市名称">{{ detailBasic.cityName }}</el-descriptions-item>
          <el-descriptions-item label="时区">{{ detailBasic.timezone }}</el-descriptions-item>
          <el-descriptions-item label="纬度">{{ detailBasic.latitude }}</el-descriptions-item>
          <el-descriptions-item label="经度">{{ detailBasic.longitude }}</el-descriptions-item>
          <el-descriptions-item label="机场类型">{{ detailBasic.airportType }}</el-descriptions-item>
          <el-descriptions-item label="机场规模">{{ detailBasic.airportSize }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="detailBasic.status === 1 ? 'success' : 'info'">{{ detailBasic.status === 1 ? '启用' : '禁用' }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <h3>EU261 配置</h3>
        <el-descriptions v-if="detailConfig" :column="2" border>
          <el-descriptions-item label="IATA">{{ detailConfig.iataCode }}</el-descriptions-item>
          <el-descriptions-item label="在欧盟">
            <el-tag :type="detailConfig.isInEu ? 'success' : 'info'">{{ detailConfig.isInEu ? '是' : '否' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="EU261 适用">
            <el-tag :type="detailConfig.eu261Applicable ? 'success' : 'warning'">
              {{ detailConfig.eu261Applicable ? '适用' : '不适用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="detailConfig.status === 1 ? 'success' : 'info'">{{ detailConfig.status === 1 ? '启用' : '禁用' }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>

    <!-- 基础信息编辑弹窗 -->
    <el-dialog v-model="basicDialogVisible" title="编辑机场基础信息" width="720px">
      <el-form :model="basicForm" label-width="120px">
        <el-form-item label="IATA 代码">
          <el-input v-model="basicForm.iataCode" disabled />
        </el-form-item>
        <el-form-item label="ICAO 代码">
          <el-input v-model="basicForm.icaoCode" />
        </el-form-item>
        <el-form-item label="机场名(EN)">
          <el-input v-model="basicForm.airportName" />
        </el-form-item>
        <el-form-item label="机场名(中文)">
          <el-input v-model="basicForm.airportNameCn" />
        </el-form-item>
        <el-form-item label="国家">
          <CountrySelect v-model="basicForm.countryCode" />
        </el-form-item>
        <el-form-item label="国家名称">
          <el-input v-model="basicForm.countryName" />
        </el-form-item>
        <el-form-item label="城市名称">
          <el-input v-model="basicForm.cityName" />
        </el-form-item>
        <el-form-item label="时区">
          <el-input v-model="basicForm.timezone" />
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model.number="basicForm.latitude" />
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model.number="basicForm.longitude" />
        </el-form-item>
        <el-form-item label="机场类型">
          <el-input v-model="basicForm.airportType" />
        </el-form-item>
        <el-form-item label="机场规模">
          <el-input v-model="basicForm.airportSize" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="basicForm.status" style="width: 180px;">
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="basicDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="savingBasic" @click="handleBasicSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- EU261 配置编辑弹窗 -->
    <el-dialog v-model="configDialogVisible" title="编辑 EU261 配置" width="520px">
      <el-form :model="configForm" label-width="140px">
        <el-form-item label="IATA 代码">
          <el-input v-model="configForm.iataCode" disabled />
        </el-form-item>
        <el-form-item label="在欧盟">
          <el-switch v-model="configForm.isInEu" />
        </el-form-item>
        <el-form-item label="EU261 适用">
          <el-switch v-model="configForm.eu261Applicable" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="configForm.status" style="width: 180px;">
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="savingConfig" @click="handleConfigSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  pageAirportBasic,
  pageAirportConfig,
  updateAirportBasic,
  updateAirportConfig,
  type AirportBasicVO,
  type AirportEu261ConfigVO,
  type AirportBasicUpdateDTO,
  type AirportEu261ConfigUpdateDTO,
  type AirportBasicPageRequest,
  type AirportEu261ConfigPageRequest,
  getAirportBasic,
  getAirportConfig
} from '@/api/airports'
import CountryDisplay from '@/components/common/CountryDisplay.vue'
import CountrySelect from '@/components/common/CountrySelect.vue'

const activeTab = ref<'basic' | 'config'>('basic')

// 基础信息列表
const basicLoading = ref(false)
const basicList = ref<AirportBasicVO[]>([])
const basicPageNum = ref(1)
const basicPageSize = ref(10)
const basicTotal = ref(0)

const basicQuery = ref<AirportBasicPageRequest>({
  pageNum: 1,
  pageSize: 10,
  orderBy: 'iata_code asc',
  iataCode: undefined,
  countryCode: undefined,
  cityName: undefined,
  status: undefined
})

// EU261 配置列表
const configLoading = ref(false)
const configList = ref<AirportEu261ConfigVO[]>([])
const configPageNum = ref(1)
const configPageSize = ref(10)
const configTotal = ref(0)

const configQuery = ref<AirportEu261ConfigPageRequest>({
  pageNum: 1,
  pageSize: 10,
  orderBy: 'iata_code asc',
  iataCode: undefined,
  isInEu: undefined,
  eu261Applicable: undefined,
  status: undefined
})

// 编辑表单
const basicDialogVisible = ref(false)
const savingBasic = ref(false)
const basicForm = ref<AirportBasicUpdateDTO>({
  iataCode: '',
  icaoCode: '',
  airportName: '',
  airportNameCn: '',
  countryCode: '',
  countryName: '',
  cityName: '',
  timezone: '',
  latitude: undefined,
  longitude: undefined,
  airportType: '',
  airportSize: '',
  status: 1
})

const configDialogVisible = ref(false)
const savingConfig = ref(false)
const configForm = ref<AirportEu261ConfigUpdateDTO>({
  iataCode: '',
  isInEu: false,
  eu261Applicable: false,
  status: 1
})

// 详情 Drawer
const detailVisible = ref(false)
const detailLoading = ref(false)
const detailBasic = ref<AirportBasicVO | null>(null)
const detailConfig = ref<AirportEu261ConfigVO | null>(null)

const fetchBasicPage = async () => {
  basicLoading.value = true
  try {
    basicQuery.value.pageNum = basicPageNum.value
    basicQuery.value.pageSize = basicPageSize.value
    const res = await pageAirportBasic(basicQuery.value)
    if (res.code === 0 && res.data) {
      basicList.value = res.data.list
      basicTotal.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取机场基础信息失败')
    }
  } catch (e) {
    ElMessage.error('获取机场基础信息失败')
  } finally {
    basicLoading.value = false
  }
}

const fetchConfigPage = async () => {
  configLoading.value = true
  try {
    configQuery.value.pageNum = configPageNum.value
    configQuery.value.pageSize = configPageSize.value
    const res = await pageAirportConfig(configQuery.value)
    if (res.code === 0 && res.data) {
      configList.value = res.data.list
      configTotal.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取 EU261 配置失败')
    }
  } catch (e) {
    ElMessage.error('获取 EU261 配置失败')
  } finally {
    configLoading.value = false
  }
}

// 基础信息筛选 & 分页
const handleBasicSearch = () => {
  basicPageNum.value = 1
  fetchBasicPage()
}

const handleBasicReset = () => {
  const size = basicPageSize.value
  basicQuery.value = {
    pageNum: 1,
    pageSize: size,
    orderBy: 'iata_code asc',
    iataCode: undefined,
    countryCode: undefined,
    cityName: undefined,
    status: undefined
  }
  basicPageNum.value = 1
  fetchBasicPage()
}

const handleBasicSizeChange = (size: number) => {
  basicPageSize.value = size
  basicPageNum.value = 1
  fetchBasicPage()
}

const handleBasicPageChange = (page: number) => {
  basicPageNum.value = page
  fetchBasicPage()
}

// 配置筛选 & 分页
const handleConfigSearch = () => {
  configPageNum.value = 1
  fetchConfigPage()
}

const handleConfigReset = () => {
  const size = configPageSize.value
  configQuery.value = {
    pageNum: 1,
    pageSize: size,
    orderBy: 'iata_code asc',
    iataCode: undefined,
    isInEu: undefined,
    eu261Applicable: undefined,
    status: undefined
  }
  configPageNum.value = 1
  fetchConfigPage()
}

const handleConfigSizeChange = (size: number) => {
  configPageSize.value = size
  configPageNum.value = 1
  fetchConfigPage()
}

const handleConfigPageChange = (page: number) => {
  configPageNum.value = page
  fetchConfigPage()
}

// 打开编辑弹窗
const openBasicEdit = (row: AirportBasicVO) => {
  basicForm.value = {
    iataCode: row.iataCode,
    icaoCode: row.icaoCode ?? '',
    airportName: row.airportName ?? '',
    airportNameCn: row.airportNameCn ?? '',
    countryCode: row.countryCode ?? '',
    countryName: row.countryName ?? '',
    cityName: row.cityName ?? '',
    timezone: row.timezone ?? '',
    latitude: (row.latitude as number | null) ?? undefined,
    longitude: (row.longitude as number | null) ?? undefined,
    airportType: row.airportType ?? '',
    airportSize: row.airportSize ?? '',
    status: row.status ?? 1
  }
  basicDialogVisible.value = true
}

const openConfigEdit = (row: AirportEu261ConfigVO) => {
  configForm.value = {
    iataCode: row.iataCode,
    isInEu: row.isInEu ?? false,
    eu261Applicable: row.eu261Applicable ?? false,
    status: row.status ?? 1
  }
  configDialogVisible.value = true
}

// 保存
const handleBasicSave = async () => {
  if (!basicForm.value.iataCode) {
    ElMessage.error('IATA 代码不能为空')
    return
  }
  savingBasic.value = true
  try {
    const res = await updateAirportBasic(basicForm.value)
    if (res.code === 0 && res.data) {
      ElMessage.success('保存成功')
      basicDialogVisible.value = false
      fetchBasicPage()
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    savingBasic.value = false
  }
}

const handleConfigSave = async () => {
  if (!configForm.value.iataCode) {
    ElMessage.error('IATA 代码不能为空')
    return
  }
  savingConfig.value = true
  try {
    const res = await updateAirportConfig(configForm.value)
    if (res.code === 0 && res.data) {
      ElMessage.success('保存成功')
      configDialogVisible.value = false
      fetchConfigPage()
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    savingConfig.value = false
  }
}

// 查看详情：同时拉取 Basic 与 Config
const openDetail = async (iataCode: string) => {
  if (!iataCode) return
  detailVisible.value = true
  detailLoading.value = true
  detailBasic.value = null
  detailConfig.value = null
  try {
    const [basicRes, configRes] = await Promise.all([
      getAirportBasic(iataCode),
      getAirportConfig(iataCode)
    ])
    if (basicRes.code === 0 && basicRes.data) {
      detailBasic.value = basicRes.data
    }
    if (configRes.code === 0 && configRes.data) {
      detailConfig.value = configRes.data
    }
  } catch (e) {
    ElMessage.error('获取机场详情失败')
  } finally {
    detailLoading.value = false
  }
}

onMounted(() => {
  fetchBasicPage()
  fetchConfigPage()
})
</script>

<style scoped lang="scss">
.airports-page {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}
.tabs {
  margin-top: 16px;
}
.filters {
  margin: 12px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
