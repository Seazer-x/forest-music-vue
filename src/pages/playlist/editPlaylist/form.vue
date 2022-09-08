<template>
  <div class="row user-form">
    <q-card bordered flat style="width: 50vw;margin: 45px auto auto;">
      <q-card-section v-if="pathId">
        <div class="text-h6">修改歌单信息</div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h6">创建歌单</div>
      </q-card-section>

      <q-separator inset/>

      <q-card-section>
        <q-form style="width: 45vw">
          <q-input v-model="playlistInfo.name" :loading="loading" class="input-form" label="歌单名"
                   standout="bg-teal text-white" type="text"/>
          <q-toggle v-model="playlistInfo.recommended"
                    :label="`${playlistInfo.recommended===false?'未推荐':'开启推荐'}`"
                    checked-icon="fa-solid fa-fire"
                    class="input-form"
                    color="red"
                    unchecked-icon="fa-regular fa-snowflake"/>
          <br>
          <q-badge v-if="playlistInfo.recommended" color="primary"
                   style="font-weight: bold;font-size: 15px;height: 19px">
            推荐因数: {{ playlistInfo.recommendFactor }}
          </q-badge>
          <q-item v-if="playlistInfo.recommended">
            <q-item-section avatar>
              <q-icon color="red" name="fa-brands fa-cloudsmith"/>
            </q-item-section>
            <q-item-section>
              <q-slider
                  v-model="playlistInfo.recommendFactor"
                  color="green"
                  markers
                  snap
                  switch-label-side
                  label
                  label-always
                  :min="1"
                  :max="10"
              />
            </q-item-section>
          </q-item>
          <div class="row" style="padding-top: 10px">
            <div class="column" style="height: 340px">
              <div style="height: 10px"/>
              <q-uploader
                  auto-upload
                  hide-upload-btn
                  label="封面"
                  field-name="file"
                  accept=".jpg, .png, image/*"
                  no-thumbnails
                  bordered
                  :factory="upload"
                  @removed="removeFile()"
                  max-files="1"
              >
                <template v-slot:header="scope">
                  <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                    <q-spinner v-if="scope.isUploading" class="q-uploader__spinner"/>
                    <div class="col">
                      <div class="q-uploader__title">上传封面</div>
                      <div class="q-uploader__subtitle">{{ playlistInfo.cover ? "已有" : "未上传" }}</div>
                    </div>
                    <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                      <q-uploader-add-trigger/>
                      <q-tooltip>选择文件</q-tooltip>
                    </q-btn>
                  </div>
                </template>
                <template v-slot:list="scope">
                  <q-list separator>
                    <q-item v-for="file in scope.files" :key="file.__key">
                      <q-item-section>
                        <q-item-label class="full-width ellipsis">
                          ...{{ file.name.slice(-25) }}
                        </q-item-label>
                        <q-item-label caption>
                          状态:
                          <q-icon v-if="coverOK" name='fa-solid fa-circle-check' color='primary'/>
                          <q-icon v-else name='fa-solid fa-ban'/>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section top side>
                        <q-btn
                            class="gt-xs"
                            size="15px"
                            flat
                            dense
                            round
                            icon="fa-solid fa-xmark"
                            @click="scope.removeFile(file)"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </template>
              </q-uploader>
            </div>
            <div style="padding-left: 10px"/>
            <q-img v-if="playlistInfo.cover!==''" class="rounded-borders" spinner-color="primary"
                   :src="playlistInfo.cover"
                   width="350px" height="330px"
                   style="margin-left: 10px;margin-top: 5px">
              <div class="absolute-bottom-right text-subtitle2">
                封面预览
              </div>
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-yellow-13 text-white">
                  封面加载失败
                </div>
              </template>
            </q-img>
          </div>
          <div style="padding-bottom: 10px"/>
          <q-input v-model="playlistInfo.description" :loading="loading" class="input-form" label="简介" outlined standout
                   type="textarea"/>
          <q-toggle v-model="playlistInfo.status"
                    :label="`${playlistInfo.status==='CLOSE'?'关闭':(playlistInfo.status==='PUBLISH'?'发布':'草稿')}`"
                    checked-icon="fa-solid fa-cloud-arrow-up"
                    class="input-form"
                    color="blue"
                    false-value="CLOSE"
                    true-value="PUBLISH"
                    unchecked-icon="fa-solid fa-ban"/>
          <br>
          <q-btn v-if="pathId" color="primary" label="修改" push type="submit" @click="onSubmit"/>
          <q-btn v-else color="primary" label="添加" push type="submit" @click="onSubmit"/>
        </q-form>
      </q-card-section>
    </q-card>
    <div style="height: 40px"/>
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import {ref} from "vue";
import {Notify} from "quasar";
import playlistApi from "../../../api/playlist.js"
import fileUpload from "../../../api/fileUpload.js";
import router from "../../../router";

export default {
  name: "playlistForm",
  setup() {
    const pathId = useRoute().params.id || null
    const loading = ref(true)
    const coverOK = ref(false)
    let oldCover = ''
    const playlistInfo = ref({
      id: '',
      name: '',
      description: '',
      cover: '',
      status: null,
      recommended: ref(false),
      recommendFactor: 1,
      special: ref(false)
    })

    function upload(files) {
      const fileData = new FormData;
      fileData.set('file', files[0], files.name);
      fileUpload.uploadFile(fileData, 'cover').then(res => {
        Notify.create({
          color: 'teal',
          group: false,
          timeout: 600,
          message: "封面上传成功",
          position: "top"
        })
        coverOK.value = true
        playlistInfo.value.cover = res.data.data.cover
      })
    }

    function removeFile() {
      coverOK.value = false
      playlistInfo.value.cover = oldCover
    }

    function fetchData(pathId) {
      if (pathId == null) {
        loading.value = false
        return
      }
      playlistApi.getPlaylistById(pathId).then(res => {
        playlistInfo.value = res.data.data
        loading.value = false
        oldCover = playlistInfo.value.cover
      })
    }

    function onSubmit() {
      const id = pathId || null
      const playlist = playlistInfo.value
      if (id) {
        playlistApi.updatePlaylist(playlist).then(() => {
          Notify.create({
            color: 'teal',
            group: false,
            timeout: 600,
            message: `歌单《${playlist.name}》更新成功`,
            position: "top"
          })
          if (!pathId)
            setTimeout(() => {
              router.push('/playlistManage')
              //延迟时间：1.5秒
            }, 1500)
        })
      } else {
        playlistApi.addPlaylist(playlist).then(response => {
          if (response.data === false)
            return false
          Notify.create({
            color: 'teal',
            group: false,
            timeout: 600,
            message: `歌单《${playlist.name}》添加成功`,
            position: "top"
          })
          if (!pathId)
            setTimeout(() => {
              //需要延迟的代码 :3秒后延迟跳转到首页，可以加提示什么的
              router.push('/playlistManage');
              //延迟时间：3秒
            }, 1500)
        })
      }
    }

    fetchData(pathId);

    return {
      pathId,
      playlistInfo,
      loading,
      coverOK,
      oldCover,
      upload,
      onSubmit,
      removeFile,
    }
  }
}
</script>

<style scoped>
.user-form {
  width: 90vw;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.input-form {
  margin-bottom: 20px;
}
</style>
