<template>
  <div class="login-content">
    <q-card class="login-card">
      <h5 class="card-title">Forest Music</h5>
      <q-form
          class="q-gutter-md login-form"
          @submit="onSubmit()"
      >
        <q-input
            v-model="username"
            :rules="[ val => val && val.length > 0 || '请输入用户名']"
            filled
            label="用户名"
            lazy-rules
        />

        <q-input
            v-model="password"
            :rules="[
          val => val !== null && val !== '' || '请输入密码',
          val => val.length > 4 && val.length < 32 || '密码格式有误'
        ]"
            filled
            label="密码"
            lazy-rules
            type="password"
        />

        <div>
          <q-btn class="full-width" color="primary" label="登录" type="submit"/>
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import {ref} from "vue";
import {useStore} from 'vuex'
import {useRoute, useRouter} from "vue-router";
import {Notify} from "quasar";

export default {
  name: "Login",
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const username = ref('')
    const password = ref('')
    const onSubmit = () => {
      store.dispatch('user/login', {username, password}).then(() => {
            store.dispatch('user/fetchCurrentUser').then(roles => {
                  if (roles.includes("superadmin") || roles.includes("admin")) {
                    router.push({path: route.query.redirect || '/'})
                  } else {
                    Notify.create({
                      color: 'teal',
                      group: false,
                      icon: 'fa-solid fa-triangle-exclamation',
                      message: '你没有权限访问该页面',
                      position: "top-right",
                      timeout: 2000
                    })
                    store.dispatch('user/logout')
                  }
                }
            )
            store.dispatch('map/addMapData')
          }
      )
    }
    return {
      username,
      password,
      onSubmit
    }
  }
}
</script>

<style lang="less" scoped>
.login-content {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .login-card {
    padding: 0 20px 20px 20px;
  }

  .card-title {
    padding-left: 4px;
    font-weight: bold;
    font-size: 30px;
    color: #207f4c;
    margin: 30px 0 35px 0;
  }

  .login-form {
    width: 400px;
  }
}
</style>
