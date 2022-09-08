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
      <q-breadcrumbs-el label="音乐管理" icon="fa-solid fa-music"/>
    </q-breadcrumbs>
  </div>
  <div class="q-pa-md">
    <q-table
        v-model:pagination="pagination"
        v-model:selected="selectedMusics"
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
      <template v-slot:body-cell-operation="props">
        <q-td :props="props">
          <q-btn color="primary" icon="edit" @click="editMusic(props.key)" style="margin-right: 10px"/>
          <q-btn color="dark" icon="delete" @click="removeMusics([props.key])"/>
        </q-td>
      </template>
      <template v-slot:body-cell-cover="props">
        <q-td :props="props">
          <q-img :src="props.value" width="100px" height="100px"/>
        </q-td>
      </template>
      <template v-slot:body-cell-singer="props">
        <q-td :props="props">
          {{ props.row.singer ? props.row.singer.name : '无' }}
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div>
            <q-btn
                :label="props.value==='PUBLISH'?'已发布':(props.value==='CLOSE'?'已关闭':'草稿')"
                :color="props.value==='PUBLISH'?'primary':(props.value==='CLOSE'?'deep-orange':'blue')"
                outline
                @click="reverseStatus(props.row.id,props.value)"
                style="font-weight: bolder;font-size: 10px"/>
          </div>
        </q-td>
      </template>

      <template v-slot:top>
        <q-btn :disable="loading" color="primary" label="发布音乐" @click="addMusic"/>
        <q-btn :disable="loading" class="q-ml-sm" color="primary" label="删除音乐" @click="removeMusics"/>
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

import {musicManage} from "../../compose/musicManage.js";
import {ref} from "vue";

export default {
  name: "index",
  setup() {
    const columns = [
      {
        name: 'name',
        required: true,
        label: '歌曲名',
        align: 'left',
        field: row => row.name,
        sortable: true
      },
      {name: 'singer', align: 'center', label: '演唱歌手', field: 'singer', sortable: true},
      {name: 'status', align: 'center', label: '状态', field: 'status'},
      {name: 'cover', align: 'center', label: '歌曲封面', field: 'cover'},
      {name: 'url', align: 'center', label: '歌曲链接', field: 'url'},
      {name: 'lyricUrl', align: 'center', label: '歌词链接', field: 'lyricUrl'},
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

    return {
      columns,
      visibleColumns: ref(['singer', 'status', 'cover', 'url', 'lyricUrl', 'updatedTime', 'operation']),
      ...musicManage()
    }
  }
}
</script>

<style scoped>
</style>
