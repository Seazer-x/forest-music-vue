<template>
  <q-layout>
    <q-header reveal elevated>
      <q-toolbar>
        <q-fab
            :icon="`${leftDrawerOpen?'fa-solid fa-xmark':'fa-solid fa-align-justify'}`"
            unelevated
            flat
            @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <router-link style="text-decoration: none;color: ghostwhite;font-weight: bold" to="/Home">
            Forest Music Admin
          </router-link>
        </q-toolbar-title>
        <q-toggle
            v-model="darkMode"
            checked-icon="fa-solid fa-cloud-moon"
            color="dark"
            size="xl"
            toggle-order="ft"
            unchecked-icon="fa-solid fa-sun"
        />
        <q-separator dark size="2px" style="margin-right: 7px" vertical/>
        <q-btn color="teal-10" flat round @click="logout">
          <q-icon name="fa-solid fa-arrow-right-from-bracket"/>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer
        v-model="leftDrawerOpen"
        :width="200" elevated overlay
        side="left"
    >
      <q-scroll-area class="fit" style="width: 200px; height: 100%; padding-top: 16px; border-right: 1px solid #ddd">
        <q-list class="meun-list">
          <h6 class="sce-title">ADMIN PAGE</h6>
          <q-separator class="sep-line" color="primary"/>
          <q-item v-for="item in menus" :key="item.title" :to="item.path" clickable>
            <q-item-section avatar>
              <q-icon :name=item.icon class="side-icon" size="20px"/>
            </q-item-section>
            <q-item-section class="item-text">
              {{ item.title }}
            </q-item-section>
          </q-item>
          <h6 class="sce-title">PROFILE PAGE</h6>
          <q-separator class="sep-line" color="primary"/>
          <q-item clickable exact href="https://forest-music-doc.vercel.app/" manual-focus>
            <q-item-section avatar class="side-icon">
              <q-icon name="fa-brands fa-vuejs" size="24px" style="margin-top: 4px"/>
            </q-item-section>
            <q-item-section class="item-text">
              Project Docs
            </q-item-section>
          </q-item>
          <h6 class="sce-title">DOCUMENT</h6>
          <q-separator class="sep-line" color="primary"/>
          <q-item clickable exact href="https://quasar.dev/" manual-focus>
            <q-item-section avatar class="side-icon">
              <q-icon name="img:https://cdn.quasar.dev/logo-v2/svg/logo.svg"/>
            </q-item-section>
            <q-item-section class="item-text">
              Quasar
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>
<style lang="less" scoped>
.side-icon {
  color: rgb(116, 118, 122);
}

.sep-line {
  box-shadow: 0 1px 1px 1px #d3d3d3;
}

.meun-list {
  color: rgb(116, 118, 122);
  width: 200px;

  .item-text {
    font-size: 15px;
    margin-bottom: -3px;
    margin-left: -19px;
    font-weight: bold;
  }

  .sce-title {
    color: lightslategray;
    font-weight: bold;
    margin-left: 13px;
    margin-bottom: auto;
    margin-top: auto;
    font-size: .85rem;
  }
}
</style>

<script>
import {defineComponent, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'
import {useQuasar} from "quasar";

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const $q = useQuasar()
    const route = useRoute()
    const leftDrawerOpen = ref(false)
    const store = useStore()
    const darkMode = ref(false)
    const breadcrumbs = route.name
    const menus = [
      {title: '控制台', icon: 'fa-solid fa-gauge-high', path: '/dashBoard'},
      {title: '用户管理', icon: 'fa-solid fa-users', path: '/userManage'},
      {title: '用户权限', icon: 'fa-solid fa-user-shield', path: '/roleManage'},
      {title: '音乐管理', icon: 'fa-solid fa-music', path: '/musicManage'},
      {title: '歌单管理', icon: 'fa-solid fa-guitar', path: '/playlistManage'},
      {title: '艺人管理', icon: 'fa-solid fa-id-card-clip', path: '/artistManage'},
      {title: '专辑管理', icon: 'fa-solid fa-compact-disc', path: '/albumManage'}
    ]
    const darkModeChange = () => {
      $q.dark.set(!darkMode.value)
      $q.dark.toggle()
    }
    darkModeChange();
    return {
      darkMode,
      logout: () => store.dispatch('user/logout').then(() => window.location.reload()),
      leftDrawerOpen,
      menus,
      darkModeChange,
      breadcrumbs,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
  watch: {
    darkMode() {
      this.darkModeChange()
    }
  },
})
</script>
