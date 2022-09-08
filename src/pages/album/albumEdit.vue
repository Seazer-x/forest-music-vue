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
      <q-breadcrumbs-el label="专辑管理" icon="fa-solid fa-compact-disc" to="/albumManage"/>
      <q-breadcrumbs-el :label="pathId?'修改专辑信息':'发布专辑'"
                        :icon="pathId?'fa-solid fa-pen-to-square':'fa-solid fa-bullhorn'"/>
    </q-breadcrumbs>
  </div>
  <div class="q-pa-md" v-if="pathId">
    <q-stepper
        v-model="step"
        ref="stepper"
        animated
        done-color="primary"
        active-color="deep-orange"
        inactive-color="gray"
    >
      <q-step
          :name="1"
          title="修改专辑基本信息"
          icon="settings"
          :done="step > 1"
      >
        <albumForm/>
      </q-step>

      <q-step
          :name="2"
          title="关联专辑曲目"
          caption="可选"
          icon="create_new_folder"
          :done="step > 2"
      >
        <link_music/>
      </q-step>

      <q-step
          :name="3"
          title="完成"
          icon="preview"
      >
        <preview/>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn @click="step!==3?$refs.stepper.next() : backAlbum()" color="deep-orange"
                 :label="step === 3 ? '完成' : '下一步'"/>
          <q-btn v-if="step > 1" flat color="deep-orange" @click="$refs.stepper.previous()" label="返回"
                 class="q-ml-sm"/>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
  <album-form v-else/>
</template>

<script>
import {ref} from "vue";
import albumForm from "../../pages/album/editAlbum/form.vue"
import Link_music from "./editAlbum/link_music.vue";
import Preview from "./editAlbum/preview.vue";
import {useRoute, useRouter} from "vue-router";

export default {
  name: "albumEdit",
  components: {
    Preview,
    Link_music,
    albumForm
  },
  setup() {
    const pathId = useRoute().params.id || null
    const router = useRouter()

    function backAlbum() {
      router.push("/albumManage")
    }

    return {
      step: ref(1),
      backAlbum,
      pathId,
    }
  }
}
</script>

<style scoped>

</style>
