<template>
  <q-card bordered flat style="width: 90vw;margin: 45px auto auto;">
    <q-card-section>
      <div class="text-h6">预览信息</div>
    </q-card-section>
    <q-separator inset/>
    <q-card flat bordered>
      <q-card-section horizontal style="margin-bottom: 10px;margin-top: 10px">
        <q-card-section class="col-2"/>
        <q-img
            class="col-2 rounded-borders"
            :src="AlbumInfo.cover"
            height="200px"
        />
        <q-card-section>
          <q-card-section style="margin-left: -15px">
            {{ AlbumInfo.name }}<br>
          </q-card-section>
          {{ AlbumInfo.description }}
        </q-card-section>
      </q-card-section>
      <q-separator spaced/>
      <q-card-section horizontal>
        <q-card-section class="col-2"/>
        <q-card-section class="col-10" style="margin-left: -20px">
          <q-list v-for="music in albumMusics" class="scroll">
            <q-item clickable v-ripple>
              <q-item-section>
                <q-avatar size="100px">
                  <img :src="music.cover" alt="封面" height="100px">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-section style="margin-left: -200px">
                  {{ music.name }}
                </q-item-section>
                <q-item-section style="margin-left: -200px">
                  {{ music.singer ? music.singer.name : '无' }}
                </q-item-section>
              </q-item-section>
            </q-item>
            <q-separator inset/>
          </q-list>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-card>
</template>

<script>

import albumApi from "../../../api/album.js";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

export default {
  name: "preview",
  setup() {
    const albumMusics = ref([])
    const AlbumInfo = ref({
      id: '',
      name: '',
      description: '',
      cover: '',
      status: null,
      recommended: ref(false),
      recommendFactor: 1,
    })
    const pathId = useRoute().params.id || null

    function fetchData(pathId) {
      if (pathId == null) {
        return
      }
      albumApi.getAlbumById(pathId).then(res => {
        AlbumInfo.value = res.data.data
      })
    }

    function fetchAlbumMusics() {
      const id = pathId || 0
      if (id === 0)
        return
      albumApi.getAlbumMusics(id).then(res => {
        albumMusics.value = res.data.data
      })
    }

    onMounted(fetchAlbumMusics)

    fetchData(pathId)
    return {
      AlbumInfo,
      albumMusics,
    }
  }
}
</script>
<style scoped>

</style>
