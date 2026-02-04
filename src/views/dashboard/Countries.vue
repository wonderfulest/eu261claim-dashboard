<template>
  <div class="countries-page">
    <h2>国家码管理</h2>

    <div class="filters">
      <el-input
        v-model="query.alpha2"
        placeholder="国家码 (alpha-2)"
        clearable
        style="width: 160px; margin-right: 8px;"
        @keyup.enter.native="handleSearch"
      />
      <el-input
        v-model="query.name"
        placeholder="名称"
        clearable
        style="width: 200px; margin-right: 8px;"
        @keyup.enter.native="handleSearch"
      />
      <el-input
        v-model="query.region"
        placeholder="大区 (Region)"
        clearable
        style="width: 180px; margin-right: 8px;"
        @keyup.enter.native="handleSearch"
      />
      <el-input
        v-model="query.subRegion"
        placeholder="子区域 (SubRegion)"
        clearable
        style="width: 200px; margin-right: 8px;"
        @keyup.enter.native="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button type="success" @click="openCreate" style="margin-left: auto;">新增国家</el-button>
    </div>

    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column prop="alpha2" label="alpha-2" width="100" />
      <el-table-column prop="alpha3" label="alpha-3" width="100" />
      <el-table-column prop="countryCode" label="电话区号" width="110" />
      <el-table-column label="显示名" min-width="260">
        <template #default="{ row }">
          {{ row.name || row.chineseName ? `${row.alpha2} - ${[row.name, row.chineseName].filter(Boolean).join('/')}` : row.alpha2 }}
        </template>
      </el-table-column>
      <el-table-column prop="region" label="大区" width="160" />
      <el-table-column prop="subRegion" label="子区域" width="180" />
      <el-table-column prop="intermediateRegion" label="中间区域" width="180" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openDetail(row.alpha2)">查看</el-button>
          <el-button type="primary" link size="small" @click="openEdit(row.alpha2)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑国家' : '新增国家'" width="640px">
      <el-form :model="form" label-width="140px">
        <el-form-item label="alpha-2" required>
          <el-input v-model="form.alpha2" :disabled="isEdit" maxlength="2" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" maxlength="100" />
        </el-form-item>
        <el-form-item label="中文名称">
          <el-input v-model="form.chineseName" maxlength="100" />
        </el-form-item>
        <el-form-item label="alpha-3">
          <el-input v-model="form.alpha3" maxlength="3" />
        </el-form-item>
        <el-form-item label="电话区号">
          <el-input v-model="form.countryCode" maxlength="10" />
        </el-form-item>
        <el-form-item label="ISO 3166-2">
          <el-input v-model="form.iso31662" maxlength="20" />
        </el-form-item>
        <el-form-item label="大区 (Region)">
          <el-input v-model="form.region" maxlength="100" />
        </el-form-item>
        <el-form-item label="子区域 (SubRegion)">
          <el-input v-model="form.subRegion" maxlength="100" />
        </el-form-item>
        <el-form-item label="中间区域 (Intermediate)">
          <el-input v-model="form.intermediateRegion" maxlength="100" />
        </el-form-item>
        <el-form-item label="大区代码 (RegionCode)">
          <el-input v-model.number="form.regionCode" maxlength="10" />
        </el-form-item>
        <el-form-item label="子区域代码 (SubRegionCode)">
          <el-input v-model.number="form.subRegionCode" maxlength="10" />
        </el-form-item>
        <el-form-item label="中间区域代码 (IntermediateCode)">
          <el-input v-model.number="form.intermediateRegionCode" maxlength="10" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="detailVisible" title="国家详情" size="40%" :with-header="true">
      <div v-loading="detailLoading">
        <el-descriptions v-if="detail" :column="2" border>
          <el-descriptions-item label="名称">{{ detail.name }}</el-descriptions-item>
          <el-descriptions-item label="中文名称">{{ detail.chineseName }}</el-descriptions-item>
          <el-descriptions-item label="alpha-2">{{ detail.alpha2 }}</el-descriptions-item>
          <el-descriptions-item label="alpha-3">{{ detail.alpha3 }}</el-descriptions-item>
          <el-descriptions-item label="电话区号">{{ detail.countryCode }}</el-descriptions-item>
          <el-descriptions-item label="ISO 3166-2">{{ detail.iso31662 }}</el-descriptions-item>
          <el-descriptions-item label="大区">{{ detail.region }}</el-descriptions-item>
          <el-descriptions-item label="子区域">{{ detail.subRegion }}</el-descriptions-item>
          <el-descriptions-item label="中间区域">{{ detail.intermediateRegion }}</el-descriptions-item>
          <el-descriptions-item label="大区代码">{{ detail.regionCode }}</el-descriptions-item>
          <el-descriptions-item label="子区域代码">{{ detail.subRegionCode }}</el-descriptions-item>
          <el-descriptions-item label="中间区域代码">{{ detail.intermediateRegionCode }}</el-descriptions-item>
          <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  type CountryVO,
  type CountryPageRequest,
  type CountryUpdateDTO,
  pageCountries,
  getCountry,
  saveCountry
} from '@/api/countries'

const loading = ref(false)
const list = ref<CountryVO[]>([])
const total = ref(0)

const pageNum = ref(1)
const pageSize = ref(10)

const query = ref<CountryPageRequest>({
  pageNum: 1,
  pageSize: 10,
  orderBy: 'alpha2 asc',
  alpha2: undefined,
  name: undefined,
  region: undefined,
  subRegion: undefined
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const saving = ref(false)

const detailVisible = ref(false)
const detailLoading = ref(false)
const detail = ref<CountryVO | null>(null)

const form = ref<CountryUpdateDTO>({
  alpha2: '',
  name: '',
  chineseName: '',
  alpha3: '',
  countryCode: '',
  iso31662: '',
  region: '',
  subRegion: '',
  intermediateRegion: '',
  regionCode: undefined,
  subRegionCode: undefined,
  intermediateRegionCode: undefined
})

const fetchPage = async () => {
  loading.value = true
  try {
    query.value.pageNum = pageNum.value
    query.value.pageSize = pageSize.value
    const { data: res } = await pageCountries(query.value)
    console.log(res)
    list.value = res?.list || []
    total.value = res?.total || 0
  } catch (e) {
    console.error(111, e)
    ElMessage.error('获取国家列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageNum.value = 1
  fetchPage()
}

const handleReset = () => {
  const size = pageSize.value
  query.value = {
    pageNum: 1,
    pageSize: size,
    orderBy: 'alpha2 asc',
    alpha2: undefined,
    name: undefined,
    region: undefined,
    subRegion: undefined
  }
  pageNum.value = 1
  fetchPage()
}

const handlePageChange = (page: number) => {
  pageNum.value = page
  fetchPage()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  pageNum.value = 1
  fetchPage()
}

const openCreate = () => {
  isEdit.value = false
  form.value = {
    alpha2: '',
    name: '',
    chineseName: '',
    alpha3: '',
    countryCode: '',
    iso31662: '',
    region: '',
    subRegion: '',
    intermediateRegion: '',
    regionCode: undefined,
    subRegionCode: undefined,
    intermediateRegionCode: undefined
  }
  dialogVisible.value = true
}

const openDetail = async (alpha2: string) => {
  if (!alpha2) return
  detailVisible.value = true
  detailLoading.value = true
  detail.value = null
  try {
    const { data, code } = await getCountry(alpha2)
    console.log('detail', data)
    if (code === 0 && data) {
      detail.value = data
    }
  } catch (e) {
    ElMessage.error('获取国家详情失败')
  } finally {
    detailLoading.value = false
  }
}

const openEdit = async (alpha2: string) => {
  isEdit.value = true
  try {
    const { data, code } = await getCountry(alpha2)
    if (code === 0 && data) {
      const c = data
      form.value = {
        alpha2: c.alpha2,
        name: c.name || '',
        chineseName: c.chineseName || '',
        alpha3: c.alpha3 || '',
        countryCode: c.countryCode || '',
        iso31662: c.iso31662 || '',
        region: c.region || '',
        subRegion: c.subRegion || '',
        intermediateRegion: c.intermediateRegion || '',
        regionCode: c.regionCode ?? undefined,
        subRegionCode: c.subRegionCode ?? undefined,
        intermediateRegionCode: c.intermediateRegionCode ?? undefined
      }
      dialogVisible.value = true
    } else {
      ElMessage.error('获取国家详情失败')
    }
  } catch (e) {
    ElMessage.error('获取国家详情失败')
  }
}

const handleSave = async () => {
  if (!form.value.alpha2?.trim()) {
    ElMessage.error('alpha-2 代码不能为空')
    return
  }
  saving.value = true
  try {
    const payload: CountryUpdateDTO = {
      ...form.value,
      alpha2: form.value.alpha2.trim()
    }
    const { data, code } = await saveCountry(payload)
    if (code === 0 && data) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      fetchPage()
    } else {
      ElMessage.error('保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchPage()
})
</script>

<style scoped lang="scss">
.countries-page {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

.filters {
  margin: 12px 0 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
