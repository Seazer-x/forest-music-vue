<template>
  <div class="q-pa-md">
    <div class="q-mt-md">
      <q-btn color="primary" label="添加用户" padding="" class="btn-ctl"></q-btn>
      <q-btn color="primary" label="删除用户" padding="" class="btn-ctl"></q-btn>
    </div>
    <q-table
        title="用户表单"
        :rows="rows"
        :columns="columns"
        :pagination="pagination"
        :filter="filter"
        row-key="username"
        no-data-label="没有数据（或服务器错误）"
        no-results-label="没有搜索结果"
        color="primary"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="las la-search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-username="props">
        <q-td :props="props">
          <div>
            <q-badge color="primary" :label="props.value" />
          </div>
          <div class="my-table-details">
            {{ props.row.details }}
          </div>
        </q-td>
      </template>
      <template v-slot:pagination="scope">
        <q-btn
            v-if="scope.pagesNumber > 2"
            icon="first_page"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isFirstPage"
            @click="scope.firstPage"
        />

        <q-btn
            icon="chevron_left"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isFirstPage"
            @click="scope.prevPage"
        />

        <q-btn
            icon="chevron_right"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isLastPage"
            @click="scope.nextPage"
        />

        <q-btn
            v-if="scope.pagesNumber > 2"
            icon="last_page"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isLastPage"
            @click="scope.lastPage"
        />
      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div  class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon color="primary" size="2em" name="las la-meh" />
          <span style="color: #207f4c">
            {{ message }}
          </span>
          <q-icon color="primary" size="2em" :name="filter ? 'las la-filter' : icon" />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import {computed, ref} from "vue";
import adminApi from '../../api/adminrequest.js'

export default {
  name: "index",
  setup(){
    const columns = [
      {
        name: 'username',
        required: true,
        label: '用户名',
        align: 'left',
        field: row => row.username,
        sortable: true
      },
      { name: 'nickname', align: 'center', label: '昵名', field: 'nickname', sortable: true },
      { name: 'gender', label: '性别', field: 'gender' },
      { name: 'locked', label: '是否锁定', field: 'locked' },
      { name: 'lastLoginIp', label: '最后登录IP', field: 'lastLoginIp' },
      { name: 'lastLoginTime', label: '最后登录时间', field: 'lastLoginTime' },
      { name: 'createdTime', label: '创建时间', field: 'createdTime', sortable: true, sort: (a, b) => new Date(a) - new Date(b) },
      { name: 'updatedTime', label: '更新时间', field: 'updatedTime', sortable: true, sort: (a, b) => new Date(a) - new Date(b) }
    ];
    const rows = ref([])
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10,
    })
    function fetchData(){
      adminApi.getUsers().then(res=>{
        rows.value = res.data.data
      });
    }
    fetchData();
    return{
      pagination,
      pagesNumber: computed(() => {
        return Math.ceil(rows.value.length / pagination.value.rowsPerPage)
      }),
      columns,
      rows,
      filter: ref('')
    }
  }
}

</script>

<style scoped>
.btn-ctl{
  margin-right: 10px;
  margin-bottom: 5px;
}
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: break-spaces;
  font-weight: bold;
  color: #555;
  margin-top: 4px;
}
</style>
