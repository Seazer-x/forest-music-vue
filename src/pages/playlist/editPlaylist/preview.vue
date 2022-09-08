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
            :src="playlistInfo.cover"
            height="200px"
        />
        <q-card-section>
          <q-card-section style="margin-left: -15px">
            {{ playlistInfo.name }}<br>
            <q-badge outline color="primary">创建者：{{ playlistInfo.createdUser }}</q-badge>
          </q-card-section>
          {{ playlistInfo.description }}
        </q-card-section>
      </q-card-section>
      <q-separator spaced/>
      <q-card-section horizontal>
        <q-card-section class="col-2"/>
        <q-card-section class="col-10" style="margin-left: -20px">
          <q-list v-for="music in selectedMusics" class="scroll">
            <q-item v-ripple>
              <q-item-section>
                <q-avatar size="100px">
                  <img :src="music.cover" alt="封面" height="100px">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-section style="margin-left: -100px">
                  {{ music.name }}
                </q-item-section>
                <q-item-section style="margin-left: -100px">
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

import {musicManage} from "../../../compose/musicManage.js";
import playlistApi from "../../../api/playlist.js";
import {ref} from "vue";
import {useRoute} from "vue-router";

export default {
  name: "preview",
  setup() {
    const playlistInfo = ref({
      id: '',
      name: '',
      description: '',
      cover: '',
      createdUser: '',
      status: '',
      recommended: ref(false),
      recommendFactor: 0,
      special: ref(false)
    })
    const pathId = useRoute().params.id || null

    function fetchData(pathId) {
      if (pathId == null) {
        return
      }
      playlistApi.getPlaylistById(pathId).then(res => {
        playlistInfo.value = res.data.data
      })
    }

    fetchData(pathId)

    return {
      playlistInfo,
      ...musicManage()
    }
  }
}
</script>
<style scoped>

</style>
