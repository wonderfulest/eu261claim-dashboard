<template>
  <div class="airlines-page">
    <h2>航司管理</h2>

    <div class="filters">
      <el-input
        v-model="query.code"
        placeholder="航司代码 (IATA)"
        clearable
        style="width: 160px; margin-right: 8px;"
        @keyup.enter.native="handleSearch"
      />
      <el-input
        v-model="query.countryCode"
        placeholder="国家/地区代码 (ISO-2)"
        clearable
        style="width: 180px; margin-right: 8px;"
        @keyup.enter.native="handleSearch"
      />
      <el-select
        v-model="query.eu261Eligible"
        placeholder="EU261 适用"
        clearable
        style="width: 160px; margin-right: 8px;"
      >
        <el-option :value="1" :label="''" />
        <el-option :value="0" :label="''" />
      </el-select>
      <el-select
        v-model="query.status"
        placeholder="状态"
        clearable
        style="width: 160px; margin-right: 8px;"
      >
        <el-option value="active" label="active" />
        <el-option value="inactive" label="inactive" />
        <el-option value="suspended" label="suspended" />
      </el-select>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button type="success" @click="openCreate" style="margin-left: auto;">新增航司</el-button>
    </div>

    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column prop="code" label="IATA" width="100" />
      <el-table-column prop="icaoCode" label="ICAO" width="110" />
      <el-table-column prop="name" label="名称" min-width="180" />
      <el-table-column prop="chineseName" label="中文名称" min-width="160" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="countryCode" label="国家/地区" width="120" />
      <el-table-column prop="eu261Eligible" label="EU261" width="140">
        <template #default="{ row }">
          <el-switch
            :model-value="row.eu261Eligible === 1"
            @change="(val: boolean) => handleToggleEu261(row, val)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="130">
        <template #default="{ row }">
          <el-tag
            :type="
              row.status === 'active'
                ? 'success'
                : row.status === 'inactive'
                  ? 'info'
                  : row.status === 'suspended'
                    ? 'warning'
                    : 'info'
            "
          >
            {{ row.status || '-' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="website" label="官网" min-width="200">
        <template #default="{ row }">
          <a v-if="row.website" :href="row.website" target="_blank" rel="noopener noreferrer">{{ row.website }}</a>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openEdit(row.code)">编辑</el-button>
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑航司' : '新增航司'" width="640px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="IATA 代码" required>
          <el-input v-model="form.code" :disabled="isEdit" maxlength="10" />
        </el-form-item>
        <el-form-item label="ICAO 代码">
          <el-input v-model="form.icaoCode" maxlength="10" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.type" maxlength="50" />
        </el-form-item>
        <el-form-item label="国家/地区代码">
          <el-input v-model="form.countryCode" maxlength="10" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" maxlength="100" />
        </el-form-item>
        <el-form-item label="中文名称">
          <el-input v-model="form.chineseName" maxlength="100" />
        </el-form-item>
        <el-form-item label="多语言 JSON">
          <el-input v-model="form.locales" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="官网地址">
          <el-input v-model="form.website" maxlength="200" />
        </el-form-item>
        <el-form-item label="EU261 适用">
          <el-switch
            :model-value="form.eu261Eligible === 1"
            active-text="适用"
            inactive-text="不适用"
            @change="(val: boolean) => (form.eu261Eligible = val ? 1 : 0)"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 180px;">
            <el-option value="active" label="active" />
            <el-option value="inactive" label="inactive" />
            <el-option value="suspended" label="suspended" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { pageAirlines, getAirline, saveAirline, updateAirlineEu261, type AirlineVO, type AirlinePageRequest, type AirlineUpdateDTO } from '@/api/airlines'

const loading = ref(false)
const list = ref<AirlineVO[]>([])
const total = ref(0)

const pageNum = ref(1)
const pageSize = ref(10)

const query = ref<AirlinePageRequest>({
  pageNum: 1,
  pageSize: 10,
  orderBy: 'code asc',
  code: undefined,
  countryCode: undefined,
  eu261Eligible: undefined,
  status: undefined
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const saving = ref(false)

const form = ref<AirlineUpdateDTO>({
  code: '',
  icaoCode: '',
  type: '',
  countryCode: '',
  name: '',
  chineseName: '',
  locales: '',
  website: '',
  eu261Eligible: 0,
  status: 'active'
})

const fetchPage = async () => {
  loading.value = true
  try {
    query.value.pageNum = pageNum.value
    query.value.pageSize = pageSize.value
    const res = await pageAirlines(query.value)
    if (res.code === 0 && res.data) {
      list.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取航司列表失败')
    }
  } catch (e) {
    ElMessage.error('获取航司列表失败')
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
    orderBy: 'code asc',
    code: undefined,
    countryCode: undefined,
    eu261Eligible: undefined,
    status: undefined
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
    code: '',
    icaoCode: '',
    type: '',
    countryCode: '',
    name: '',
    chineseName: '',
    locales: '',
    website: '',
    eu261Eligible: 0,
    status: 'active'
  }
  dialogVisible.value = true
}

const openEdit = async (code: string) => {
  isEdit.value = true
  try {
    const res = await getAirline(code)
    if (res.code === 0 && res.data) {
      const a = res.data
      form.value = {
        code: a.code,
        icaoCode: a.icaoCode || '',
        type: a.type || '',
        countryCode: a.countryCode || '',
        name: a.name || '',
        chineseName: a.chineseName || '',
        locales: a.locales || '',
        website: a.website || '',
        eu261Eligible: a.eu261Eligible ?? 0,
        status: a.status || 'active'
      }
      dialogVisible.value = true
    } else {
      ElMessage.error(res.msg || '获取航司详情失败')
    }
  } catch (e) {
    ElMessage.error('获取航司详情失败')
  }
}

const handleSave = async () => {
  if (!form.value.code?.trim()) {
    ElMessage.error('IATA 代码不能为空')
    return
  }
  saving.value = true
  try {
    const payload: AirlineUpdateDTO = { ...form.value, code: form.value.code.trim() }
    const res = await saveAirline(payload)
    if (res.code === 0 && res.data) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
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

const handleToggleEu261 = async (row: AirlineVO, val: boolean) => {
  const old = row.eu261Eligible ?? 0
  const next = val ? 1 : 0
  row.eu261Eligible = next
  try {
    const res = await updateAirlineEu261(row.code, next)
    if (!(res.code === 0 && res.data)) {
      row.eu261Eligible = old
      ElMessage.error(res.msg || '更新 EU261 适用状态失败')
    } else {
      ElMessage.success('已更新 EU261 适用状态')
    }
  } catch (e) {
    row.eu261Eligible = old
    ElMessage.error('更新 EU261 适用状态失败')
  }
}

onMounted(() => {
  fetchPage()
})
</script>

<style scoped lang="scss">
.airlines-page {
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
