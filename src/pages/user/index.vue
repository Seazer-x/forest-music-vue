<template>
  <div class="q-pa-md">
    <q-table
        v-model:pagination="pagination"
        v-model:selected="selectedUsers"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :rows="rows"
        :visible-columns="visibleColumns"
        @row-click="fetchData"
        color="primary"
        hide-pagination
        no-data-label="没有数据（或服务器错误）"
        no-results-label="没有搜索结果"
        row-key="id"
        selection="multiple"
    >
      <div class="row justify-center q-mt-md">
        <q-pagination
            v-model="pagination.page"
            :max="pagesNumber"
            direction-links
        />
      </div>
      <template v-slot:header-selection="scope">
        <q-toggle v-model="scope.selected"/>
      </template>

      <template v-slot:body-selection="scope">
        <q-toggle v-model="scope.selected"/>
      </template>
      <template v-slot:loading>
        <q-inner-loading color="primary" showing/>
      </template>

      <template v-slot:top>
        <q-btn :disable="loading" color="primary" label="添加用户" @click="addUser"/>
        <q-btn :disable="loading" class="q-ml-sm" color="primary" label="删除用户" @click="removeUsers"/>
        <q-space/>
        <q-select
            v-model="visibleColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns.filter(item=>item.name!=='username')"
            option-value="name"
            options-cover
            style="min-width: 150px"
        />
        <q-input v-model="filter" class="q-ml-md" debounce="300"
                 dense placeholder="Search" standout>
          <template v-slot:append>
            <q-icon v-if="filter === ''" name="search"/>
            <q-icon v-else class="cursor-pointer" name="clear" @click="filter = ''"/>
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-gender="props">
        <q-td class="text-center">
          {{ props.value === 'FEMALE' ? '女' : (props.value === 'UNKNOWN' ? '未填写' : '男') }}
        </q-td>
      </template>

      <template v-slot:body-cell-locked="props">
        <q-td :props="props">
          <div>
            <q-btn
                :label="props.value===0?'未封禁':'已封禁'"
                :color="props.value===0?'primary':'deep-orange'"
                flat
                @click="reverseLock(props.row.id)"
                style="font-weight: bolder;font-size: 10px"/>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-operation="props">
        <q-td :props="props">
          <q-btn color="primary" icon="edit" @click="onEdit(props.key)" style="margin-right: 10px"/>
          <q-btn color="dark" icon="delete" @click="removeUsers([props.key])"/>
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon color="primary" name="fa-solid fa-face-meh" size="2em"/>
          <span style="color: #207f4c">
            {{ message }}
          </span>
          <q-icon :name="filter ? 'fa-solid fa-filter' : icon" color="primary" size="2em"/>
        </div>
      </template>
    </q-table>
    <div class="row justify-center q-ml-lg-md">
      <q-pagination
          v-model="pagination.page"
          :max="pagesNumber"
          color="deep-orange"
          icon-first="fa-solid fa-angles-left"
          icon-last="fa-solid fa-angles-right"
          input
          input-class="text-blue-10"
          size="sm"
      />
    </div>
  </div>
</template>

<script>

import {userManage} from "../../compose/userManage.js";
import adminApi from "../../api/adminrequest.js"
import {Notify} from "quasar";
import {ref} from "vue";

export default {
  name: "index",
  setup() {
    const columns = [
      {
        name: 'username',
        required: true,
        label: '用户名',
        align: 'left',
        field: row => row.username,
        sortable: true
      },
      {name: 'nickname', align: 'left', label: '昵名', field: 'nickname', sortable: true},
      {name: 'gender', align: 'center', label: '性别', field: 'gender'},
      {name: 'locked', align: 'center', label: '是否锁定', field: 'locked'},
      {name: 'lastLoginIp', align: 'center', label: '最后登录IP', field: 'lastLoginIp'},
      {name: 'lastLoginTime', align: 'center', label: '最后登录时间', field: 'lastLoginTime'},
      {
        name: 'createdTime',
        align: 'center',
        label: '创建时间',
        field: 'createdTime',
        sortable: true,
        sort: (a, b) => new Date(a) - new Date(b)
      },
      {
        name: 'updatedTime',
        align: 'center',
        label: '更新时间',
        field: 'updatedTime',
        sortable: true,
        sort: (a, b) => new Date(a) - new Date(b)
      },
      {name: 'operation', align: 'center', label: '操作'}
    ];

    function reverseLock(id) {
      adminApi.reverseLock(id).then(res => {
        if (res.data.code === 200)
          Notify.create({
            color: 'teal',
            icon: 'fa-solid fa-circle-check',
            timeout: 500,
            position: 'top',
            message: res.data.message
          })
        else
          Notify.create({
            color: 'warring',
            icon: 'fa-solid fa-xmark',
            timeout: 500,
            position: 'top',
            message: res.data.message
          })
      })
    }

    return {
      columns,
      visibleColumns: ref(['nickname', 'gender', 'locked', 'lastLoginIp', 'lastLoginTime', 'createdTime', 'updatedTime', 'operation']),
      reverseLock,
      ...userManage()
    }
  }
}
</script>

<style scoped>
</style>
