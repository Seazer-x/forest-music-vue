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
      <q-breadcrumbs-el label="音乐管理" icon="fa-solid fa-music" to="/musicManage"/>
      <q-breadcrumbs-el :label="musicId!=null?'修改音乐信息':'发布音乐'"
                        :icon="musicId!=null?'fa-solid fa-pen-to-square':'fa-solid fa-bullhorn'"/>
    </q-breadcrumbs>
  </div>
  <div class="row user-form">
    <q-card bordered flat style="width: 50vw;margin: 45px auto auto;">
      <q-card-section v-if="musicId">
        <div class="text-h6">修改音乐信息</div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h6">发布音乐</div>
      </q-card-section>

      <q-separator inset/>


      <q-card-section>
        <q-form style="width: 45vw">
          <q-input v-model="musicInfo.name" :loading="loading" class="input-form" label="歌曲名"
                   standout="bg-teal text-white" type="text"/>
          <q-select v-model="musicInfo.singer"
                    :loading="loading"
                    class="input-form"
                    label="歌手"
                    filled
                    use-input
                    @filter="filterFn"
                    :option-value="opt=>opt.id"
                    :options="artists"
                    :option-label="opt => opt.name"/>
          <div class="row">
            <div class="column">
              <q-uploader
                  auto-upload
                  hide-upload-btn
                  label="歌词"
                  field-name="file"
                  accept=".lrc"
                  bordered
                  :factory="upload"
                  @removed="removeFile('lyricUrl')"
                  max-files="1"
              >
                <template v-slot:header="scope">
                  <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                    <q-spinner v-if="scope.isUploading" class="q-uploader__spinner"/>
                    <div class="col">
                      <div class="q-uploader__title">上传歌词文件</div>
                      <div class="q-uploader__subtitle">{{ musicInfo.lyricUrl ? "已有" : "未上传" }}</div>
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
                          {{ file.name.slice(-25) }}
                        </q-item-label>
                        <q-item-label caption>
                          状态:
                          <q-icon v-if="lyricOK" name='fa-solid fa-circle-check' color='primary'/>
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
              <div style="height: 10px"/>
              <q-uploader
                  auto-upload
                  hide-upload-btn
                  label="歌曲"
                  field-name="file"
                  accept=".acc, .flac, .mp3, "
                  bordered
                  :factory="upload"
                  @removed="removeFile('url')"
                  max-files="1"
              >
                <template v-slot:header="scope">
                  <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                    <q-spinner v-if="scope.isUploading" class="q-uploader__spinner"/>
                    <div class="col">
                      <div class="q-uploader__title">上传歌曲文件</div>
                      <div class="q-uploader__subtitle">{{ musicInfo.url ? "已有" : "未上传" }}</div>
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
                          {{ file.name.slice(-25) }}
                        </q-item-label>
                        <q-item-label caption>
                          状态:
                          <q-icon v-if="audioOK" name='fa-solid fa-circle-check' color='primary'/>
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
                  @removed="removeFile('cover')"
                  max-files="1"
              >
                <template v-slot:header="scope">
                  <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                    <q-spinner v-if="scope.isUploading" class="q-uploader__spinner"/>
                    <div class="col">
                      <div class="q-uploader__title">上传封面</div>
                      <div class="q-uploader__subtitle">{{ musicInfo.cover ? "已有" : "未上传" }}</div>
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
            <q-img v-if="musicInfo.cover!==''" class="rounded-borders" spinner-color="primary" :src="musicInfo.cover"
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
          <q-input v-model="musicInfo.description" :loading="loading" class="input-form" label="简介" outlined standout
                   type="textarea"/>
          <q-toggle v-model="musicInfo.status"
                    :label="`${musicInfo.status==='CLOSE'?'关闭':(musicInfo.status==='PUBLISH'?'发布':'草稿')}`"
                    checked-icon="fa-solid fa-cloud-arrow-up"
                    class="input-form"
                    color="blue"
                    false-value="CLOSE"
                    true-value="PUBLISH"
                    unchecked-icon="fa-solid fa-ban"/>
          <br>
          <q-btn v-if="musicId" size="20px" color="primary" label="修改" push type="submit"
                 @click="onSubmit"/>
          <q-btn v-else size="20px" color="primary" label="发布" push type="submit"
                 @click="onSubmit"/>
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
import musicApi from "../../api/music.js"
import fileUpload from "../../api/fileUpload.js";
import router from "../../router";
import artistApi from "../../api/artist.js"

export default {
  name: "musicForm",
  setup() {
    const musicId = useRoute().params.id || null
    const timer = ref(0)
    const loading = ref(true)
    const coverOK = ref(false)
    const audioOK = ref(false)
    const lyricOK = ref(false)
    const artists = ref([])
    let artistsTmp = []
    let oldCover = ''
    let oldAudio = ''
    let oldLyric = ''
    const musicInfo = ref({
      id: '',
      name: '',
      description: '',
      status: '',
      url: '',
      cover: '',
      singer: '',
      lyricUrl: ''
    })

    function fetchData(musicId) {
      artistApi.getAll().then(res => {
        artists.value = res.data.data
        artistsTmp = artists.value
      })
      if (musicId == null) {
        loading.value = false
        return
      }
      musicApi.getMusicById(musicId).then(res => {
        musicInfo.value = res.data.data
        loading.value = false
        oldCover = musicInfo.value.cover
        oldAudio = musicInfo.value.url
        oldLyric = musicInfo.value.lyricUrl
      })
    }

    function filterFn(val, update) {
      if (val === '') {
        update(() => {
          artists.value = artistsTmp

          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        })
        return
      }

      update(() => {
        const needle = val
        artists.value = artistsTmp.filter(v => v.name.indexOf(needle) > -1)
      })
    }

    function upload(files) {
      let label = this.label
      let cate = ref("")
      if (label === "封面")
        cate = "cover"
      if (label === "歌词")
        cate = "lyricUrl"
      if (label === "歌曲")
        cate = "url"
      const fileData = new FormData;
      fileData.set('file', files[0], files.name);
      fileUpload.uploadFile(fileData, cate).then(res => {
        Notify.create({
          color: 'teal',
          group: false,
          timeout: 600,
          message: `${label}上传成功`,
          position: "top"
        })
        if (label === "封面") {
          coverOK.value = true
          musicInfo.value.cover = res.data.data.cover
        }
        if (label === "歌词") {
          lyricOK.value = true
          musicInfo.value.lyricUrl = res.data.data.lyricUrl
        }
        if (label === "歌曲") {
          audioOK.value = true
          musicInfo.value.url = res.data.data.url
        }
      })
    }

    function removeFile(label) {
      if (label === "cover") {
        coverOK.value = false
        musicInfo.value.cover = oldCover
      }
      if (label === "lyricUrl") {
        lyricOK.value = false
        musicInfo.value.lyricUrl = oldLyric
      }
      if (label === "url") {
        audioOK.value = false
        musicInfo.value.url = oldAudio
      }
    }

    function onSubmit() {
      const id = musicId || null
      const music = musicInfo.value
      if (id) {
        musicApi.updateMusic(music).then(() => {
          Notify.create({
            color: 'teal',
            group: false,
            timeout: 600,
            message: `歌曲《${music.name}》更新成功`,
            position: "top"
          })
          setTimeout(() => {
            router.push('/musicManage')
            //延迟时间：1.5秒
          }, 1500)
        })
      } else {
        musicApi.addMusic(music).then(response => {
          if (response.data === false)
            return false
          Notify.create({
            color: 'teal',
            group: false,
            timeout: 600,
            message: `歌曲《${music.name}》添加成功`,
            position: "top"
          })
          setTimeout(() => {
            //需要延迟的代码 :3秒后延迟跳转到首页，可以加提示什么的
            router.push('/musicManage');
            //延迟时间：3秒
          }, 1500)
        })
      }
    }

    fetchData(musicId);

    return {
      timer,
      musicId,
      musicInfo,
      loading,
      lyricOK,
      audioOK,
      coverOK,
      artists,
      upload,
      filterFn,
      removeFile,
      onSubmit
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
