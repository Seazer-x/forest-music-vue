<template>
  <q-card bordered flat style="width: 90vw;margin: 45px auto auto;">
    <q-card-section>
      <div class="text-h6">关联音乐</div>
    </q-card-section>
    <q-select
        filled
        v-model="albumMusics"
        multiple
        use-chips
        max-values="20"
        hint="最多 20 个"
        counter
        :options="rows"
        :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : '- Null -'"
        :loading="loading"
    />
    <q-separator inset/>
    <q-table
        v-model:pagination="pagination"
        v-model:selected="albumMusics"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :rows="rows"
        color="primary"
        grid
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

      <template v-slot:item="props">
        <div class="q-pa-md col-md-2" :style="props.selected ? 'transform: scale(0.95);' : ''">
          <q-card @click="props.selected ? props.selected=false:props.selected=true"
                  :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section class="text-center">
              <strong>{{ props.row.name }}</strong>
              <div>{{ props.row.singer ? props.row.singer.name : "无" }}</div>
            </q-card-section>
            <q-separator/>
            <q-card-section>
              状态:
              <q-badge flat :color="props.value==='PUBLISH'?'primary':(props.value==='CLOSE'?'deep-orange':'blue')">
                {{ props.row.status === 'PUBLISH' ? '已发布' : (props.value === 'CLOSE' ? '已关闭' : '草稿') }}
              </q-badge>
            </q-card-section>
            <q-card-section>
              <q-avatar size="220px" square>
                <q-img :src="props.row.cover" height="230px"/>
              </q-avatar>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-slot:top>
        <q-space/>
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
    <q-card-section>
      <q-btn v-if="pathId" color="primary" label="修改" push type="submit" @click="subAlbumMusic"/>
      <q-btn v-else color="primary" label="添加" push type="submit" @click="subAlbumMusic"/>
    </q-card-section>
  </q-card>
</template>

<script>
import albumApi from "../../../api/album.js";
import musicApi from "../../../api/music.js"
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {Notify} from "quasar";

export default {
  name: "link_music",
  setup() {
    const pathId = useRoute().params.id
    let rows = ref([])
    const loading = ref(true)
    const selectedMusics = ref([])
    const albumMusics = ref([])
    const filter = ref('')
    const pagesNumber = computed(() => {
      return Math.ceil(rows.value.length / pagination.value.rowsPerPage)
    });
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 11,
    })
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
    ];

    function fetchArtistMusics(id) {
      loading.value = true
      musicApi.listMusicByArtist(id).then(res => {
        rows.value = res.data.data
      })
      loading.value = false
    }

    function fetchAlbumMusics() {
      loading.value = true
      const id = pathId || 0
      if (id === 0)
        return
      albumApi.getAlbumMusics(id).then(res => {
        albumMusics.value = res.data.data
      })
      loading.value = false
    }

    function subAlbumMusic() {
      loading.value = true
      const id = pathId || 0
      const musiclist = albumMusics.value
      albumApi.updateAlbumMusics(musiclist, id).then((res) => {
        Notify.create({
          color: 'teal',
          group: false,
          timeout: 600,
          message: res.data.message,
          position: "top"
        })
        fetchAlbumMusics()
      })
      loading.value = false
    }

    onMounted(fetchAlbumMusics)
    fetchArtistMusics(pathId)
    return {
      columns,
      pathId,
      rows,
      loading,
      pagination,
      pagesNumber,
      filter,
      selectedMusics,
      albumMusics,
      subAlbumMusic
    }
  },
}
</script>

<style scoped>

</style>
