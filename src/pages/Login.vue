<template>
  <div class="login-content">
<q-card class="login-card">
  <h5 class="card-title">Forest Music</h5>
    <q-form
      @submit="onSubmit()"
      class="q-gutter-md login-form"
    >
      <q-input
        filled
        v-model="username"
        label="用户名"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入用户名']"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        label="密码"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || '请输入密码',
          val => val.length > 4 && val.length < 32 || '密码格式有误'
        ]"
      />

      <div>
        <q-btn label="登录" type="submit" color="primary" class="full-width"/>
      </div>
    </q-form>
</q-card>
  </div>
</template>

<script>
import {ref} from "vue";
import {useStore} from 'vuex'
import {useRoute, useRouter} from "vue-router";

export default {
  name: "Login",
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const username= ref('')
    const password= ref('')
    const onSubmit = () => {
      store.dispatch('user/login',{username,password}).then(()=>{
            router.push({path:route.query.redirect||'/'})
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

<style scoped lang="less">
.login-content{
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .login-card{
    padding:0 20px 20px 20px;
  }
  .card-title{
    padding-left: 4px;
    font-weight: bold;
    font-size: 30px;
    color: #207f4c;
    margin:30px 0 35px 0;
  }
  .login-form{
      width: 400px;
  }
}
</style>
