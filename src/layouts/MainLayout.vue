<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar>
        <q-btn
            flat
            icon="las la-align-justify"
            aria-label="Menu"
            @click="toggleLeftDrawer"
        />
        <q-toolbar-title >
          <router-link to="/Home" style="text-decoration: none;color: #dddddd;font-weight: bold">
            Forest Music Admin
          </router-link>
        </q-toolbar-title>

        <q-btn color="#207f4c" label="账户设置">
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar size="55px">
                  <img src="../assets/Tree.png" alt="头像">
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">{{nickname}}</div>

                <q-btn
                    color="primary"
                    label="退出"
                    push
                    text-color="white"
                    size="md"
                    @click="logout"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer
        v-model="leftDrawerOpen"
        side="left" overlay elevated
        :width="200"
    >

      <q-scroll-area class="fit" style="width: 200px; height: 100%; padding-top: 16px; border-right: 1px solid #ddd">
        <q-list class="meun-list">
          <h6 class="sce-title">ADMIN PAGE</h6>
          <q-separator color="primary" class="sep-line"/>
          <q-item clickable :to="item.path" v-for="item in menus" :key="item.title">
            <q-item-section avatar>
              <q-icon class="side-icon" :name=item.icon />
            </q-item-section>
            <q-item-section class="item-text">
              {{item.title}}
            </q-item-section>
          </q-item>
          <h6 class="sce-title">PROFILE PAGE</h6>
          <q-separator color="primary" class="sep-line"/>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<style scoped lang="less">
.side-icon{
  color:rgba(203,213,225,1);
}
.sep-line{
  box-shadow: 1px 1px 1px gray;
}
.meun-list{
  width: 200px;
  .item-text{
    font-size: 15px;
    margin-bottom: -3px;
    margin-left: -19px;
    font-weight: bold;
  }
  .sce-title{
    color: lightslategray;
    margin-left: 20px;
    margin-bottom: auto;
    margin-top: auto;
    font-size: .75rem;
  }
}
</style>

<script>
import {defineComponent, ref} from 'vue'

import {computed} from 'vue'
import {useStore} from 'vuex'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    const store = useStore()
    const menus = [
      {title:'控制台',icon:'las la-tachometer-alt',path:'/dashBoard'},
      {title:'用户管理',icon:'las la-user-alt',path:'/userManage'},
      {title:'权限管理',icon:'las la-user-shield',path:'/roleManage'}
    ]
    return {
      nickname: computed(()=> store.state.user.nickname),
      logout:()=>store.dispatch('user/logout').then(()=>window.location.reload()),
      leftDrawerOpen,
      menus,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  }
})
</script>
