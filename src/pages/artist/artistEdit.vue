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
      <q-breadcrumbs-el label="艺人管理" icon="fa-solid fa-id-card-clip" to="/artistManage"/>
      <q-breadcrumbs-el :label="artistId?'艺人信息修改':'艺人入驻'"
                        :icon="artistId?'fa-solid fa-pen-to-square':'fa-solid fa-bullhorn'"/>
    </q-breadcrumbs>
  </div>
  <div class="row user-form">
    <q-card bordered flat style="width: 50vw;margin: 45px auto auto;">
      <q-card-section v-if="artistId">
        <div class="text-h6">修改艺人信息</div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h6">艺人入住</div>
      </q-card-section>

      <q-separator inset/>

      <q-card-section>
        <q-form style="width: 45vw">
          <q-input v-model="ArtistInfo.name" :loading="loading" class="input-form" label="艺人名"
                   standout="bg-teal text-white" type="text"/>
          <q-toggle v-model="ArtistInfo.recommended"
                    :label="`${ArtistInfo.recommended===false?'未推荐':'开启推荐'}`"
                    checked-icon="fa-solid fa-fire"
                    class="input-form"
                    color="red"
                    unchecked-icon="fa-regular fa-snowflake"/>
          <br>
          <q-badge v-if="ArtistInfo.recommended" color="primary"
                   style="font-weight: bold;font-size: 15px;height: 19px">
            推荐因数: {{ ArtistInfo.recommendFactor }}
          </q-badge>
          <q-item v-if="ArtistInfo.recommended">
            <q-item-section avatar>
              <q-icon color="red" name="fa-brands fa-cloudsmith"/>
            </q-item-section>
            <q-item-section>
              <q-slider
                  v-model="ArtistInfo.recommendFactor"
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
                      <div class="q-uploader__title">上传头像</div>
                      <div class="q-uploader__subtitle">{{ ArtistInfo.photo ? "已有" : "未上传" }}</div>
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
                          <q-icon v-if="photoOK" name='fa-solid fa-circle-check' color='primary'/>
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
            <q-img v-if="ArtistInfo.photo!==''" class="rounded-borders" spinner-color="primary"
                   :src="ArtistInfo.photo"
                   width="350px" height="330px"
                   style="margin-left: 10px;margin-top: 5px">
              <div class="absolute-bottom-right text-subtitle2">
                头像预览
              </div>
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-yellow-13 text-white">
                  封面加载失败
                </div>
              </template>
            </q-img>
          </div>
          <div style="padding-bottom: 10px"/>
          <q-input v-model="ArtistInfo.remark" :loading="loading" class="input-form" label="简介" outlined standout
                   type="textarea"/>
          <q-toggle v-model="ArtistInfo.status"
                    :label="`${ArtistInfo.status==='BAN'?'封禁':(ArtistInfo.status==='SETTLED'?'入驻':'草稿')}`"
                    checked-icon="fa-solid fa-house-chimney-user"
                    class="input-form"
                    color="blue"
                    false-value="BAN"
                    true-value="SETTLED"
                    unchecked-icon="fa-solid fa-ban"/>
          <br>
          <q-btn v-if="artistId" color="primary" label="修改" push type="submit" @click="onSubmit"/>
          <q-btn v-else color="primary" label="添加" push type="submit" @click="onSubmit"/>
        </q-form>
      </q-card-section>
    </q-card>
    <div style="height: 40px"/>
  </div>
</template>

<script>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {Notify} from "quasar";
import artistApi from "../../api/artist.js"
import fileUpload from "../../api/fileUpload.js";

export default {
  name: "playlistForm",
  setup() {
    const artistId = useRoute().params.id || null
    const loading = ref(true)
    const photoOK = ref(false)
    const router = useRouter()
    let oldCover = ''
    const ArtistInfo = ref({
      id: '',
      name: '',
      remark: '',
      photo: '',
      status: null,
      recommended: ref(false),
      recommendFactor: 1,
    })

    function upload(files) {
      const fileData = new FormData;
      fileData.set('file', files[0], files.name);
      fileUpload.uploadFile(fileData, 'photo').then(res => {
        Notify.create({
          color: 'teal',
          group: false,
          timeout: 600,
          message: "封面上传成功",
          position: "top"
        })
        photoOK.value = true
        ArtistInfo.value.photo = res.data.data.photo
      })
    }

    function removeFile() {
      photoOK.value = false
      ArtistInfo.value.photo = oldCover
    }

    function fetchData(artistId) {
      if (artistId == null) {
        loading.value = false
        return
      }
      artistApi.getArtistById(artistId).then(res => {
        ArtistInfo.value = res.data.data
        loading.value = false
        oldCover = ArtistInfo.value.photo
      })
    }

    function onSubmit() {
      const id = artistId || null
      const artist = ArtistInfo.value
      if (id) {
        artistApi.updateArtist(artist, id).then(() => {
          Notify.create({
            color: 'teal',
            group: false,
            timeout: 600,
            message: `艺人：${artist.name} 更新成功`,
            position: "top"
          })
          setTimeout(() => {
            router.push('/artistManage')
            //延迟时间：1.5秒
          }, 1500)
        })
      } else {
        artistApi.addPlaylist(artist).then(response => {
          if (response.data === false)
            return false
          Notify.create({
            color: 'teal',
            group: false,
            timeout: 600,
            message: `艺人：${artist.name} 添加成功`,
            position: "top"
          })
          setTimeout(() => {
            //需要延迟的代码 :3秒后延迟跳转到首页，可以加提示什么的
            router.push('/artistManage');
            //延迟时间：3秒
          }, 1500)
        })
      }
    }

    fetchData(artistId);

    return {
      artistId,
      ArtistInfo,
      loading,
      photoOK,
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
