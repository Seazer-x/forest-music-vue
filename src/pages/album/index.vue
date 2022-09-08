<template>
  <div class="q-pa-md q-gutter-sm" style="padding-left: 20px;padding-top: 20px;padding-bottom: 0">
    <q-breadcrumbs>
      <template v-slot:separator>
        <q-icon
            size="1.5em"
            name="chevron_right"
            color="primary"
        />
      </template>
      <q-breadcrumbs-el icon="fa-solid fa-house" to="/"/>
      <q-breadcrumbs-el label="专辑管理" icon="fa-solid fa-compact-disc"/>
    </q-breadcrumbs>
  </div>
  <div class="q-pa-md">
    <q-table
        v-model:pagination="pagination"
        v-model:selected="selectedAlbums"
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
      <template v-slot:body-cell-cover="props">
        <q-td :props="props">
          <q-avatar size="100px">
            <q-img :src="props.row.cover" width="100px" height="100px"/>
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div>
            <q-btn
                :label="props.row.status==='PUBLISH'?'已发布':(props.row.status==='BLOCKED'?'已封禁':'草稿')"
                :color="props.row.status==='PUBLISH'?'primary':(props.row.status==='BLOCKED'?'deep-orange':'blue')"
                outline
                @click="reverseStatus(props.row.id,props.row.status)"
                style="font-weight: bolder;font-size: 10px"/>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-recommended="props">
        <q-td :props="props">
          <div>
            <q-btn
                :label="props.row.recommended=== false ?'未推荐':'推荐中'"
                :color="props.row.recommended=== false ?'primary':'blue'"
                outline
                @click="reverseRecommend(props.row.id,props.row.recommended)"
                style="font-weight: bolder;font-size: 10px"/>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-recommendFactor="props">
        <q-td :props="props">
          {{ props.row.recommendFactor }}
          <q-popup-edit v-model="props.row.recommendFactor"
                        title="更新推荐因数"
                        buttons
                        label-cancel="取消"
                        label-set="更新"
                        @save="updateAlbum(props.row,props.row.id)"
                        v-slot="scope">
            <q-input type="number" v-model="scope.value" dense
                     @update:model-value="props.row.recommendFactor = scope.value"
                     autofocus/>
          </q-popup-edit>
        </q-td>
      </template>

      <template v-slot:body-cell-operation="props">
        <q-td :props="props">
          <q-btn color="primary" icon="edit" @click="editAlbum(props.key)" style="margin-right: 10px"/>
          <q-btn color="dark" icon="delete" @click="removeAlbum([props.key])"/>
        </q-td>
      </template>
      <template v-slot:top>
        <q-btn :disable="loading" color="primary" label="创建专辑" @click="addAlbum"/>
        <q-btn :disable="loading" class="q-ml-sm" color="primary" label="删除专辑" @click="removeAlbum"/>
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
            :options="columns.filter(item=>item.name!=='name')"
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
          input-class="text-orange-10"
          size="sm"
      />
    </div>
  </div>
</template>

<script>

import {ref} from "vue";
import {albumManage} from "../../compose/albumManage.js";

export default {
  name: "index",
  setup() {
    const columns = [
      {
        name: 'name',
        required: true,
        label: '专辑',
        align: 'left',
        field: row => row.name,
        sortable: true
      },
      {name: 'cover', align: 'center', label: '专辑封面', field: 'cover'},
      {name: 'description', align: 'center', label: '专辑简介', field: 'description'},
      {name: 'status', align: 'center', label: '上架状态', field: 'status'},
      {name: 'recommended', align: 'center', label: '推荐状态', field: 'recommended'},
      {
        name: 'recommendFactor',
        align: 'center',
        label: '推荐因数',
        field: 'recommendFactor',
        sortable: true
      },
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
    ]

    return {
      columns,
      visibleColumns: ref(['cover', 'status', 'photo', '', 'recommended', 'recommendFactor', 'operation']),
      ...albumManage()
    }
  }
}
</script>

<style scoped>
</style>
