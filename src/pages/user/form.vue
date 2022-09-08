<template>
  <div class="row user-form">
    <q-card bordered flat style="width: 40vw">
      <q-card-section v-if="userId">
        <div class="text-h6">编辑用户</div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h6">添加用户</div>
      </q-card-section>

      <q-card-section class="q-pt-none">

      </q-card-section>

      <q-separator inset/>

      <q-card-section>
        <q-form style="width: 35vw">
          <q-input v-model="userInfo.username" :loading="loading" class="input-form" label="用户名"
                   standout="bg-teal text-white" type="text"/>
          <q-input v-model="userInfo.nickname" :loading="loading" class="input-form" label="昵名" outlined standout
                   type="text"/>
          <q-input v-model="userInfo.password" :loading="loading" class="input-form" label="密码" outlined standout
                   type="password"/>
          <q-toggle v-model="userInfo.gender"
                    :label="`${userInfo.gender==='FEMALE'?'女':(userInfo.gender==='UNKNOWN'?'未设置':'男')}`"
                    checked-icon="fa-solid fa-venus"
                    class="input-form"
                    color="red"
                    false-value="MALE"
                    true-value="FEMALE"
                    unchecked-icon="fa-solid fa-mars"/>
          <q-space/>
          <q-toggle v-model="userInfo.locked"
                    :label="`${userInfo.locked==='0'?'未锁定':'锁定'}`"
                    checked-icon="fa-solid fa-lock"
                    class="input-form"
                    color="negative"
                    false-value='0'
                    true-value='1'
                    unchecked-icon="fa-solid fa-lock-open"/>
          <q-space/>
          <q-toggle v-model="userInfo.role[0]"
                    :label="`${userInfo.role[0]==='user'?'普通用户':'VIP'}`"
                    checked-icon="fa-solid fa-user-astronaut"
                    class="input-form"
                    color="negative"
                    false-value="user"
                    true-value="vip"
                    unchecked-icon="fa-solid fa-user"/>
          <br>
          <q-btn v-if="userId" color="primary" label="修改" push type="submit" @click="onSubmit"/>
          <q-btn v-else color="primary" label="添加" push type="submit" @click="onSubmit"/>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import {ref} from "vue";
import adminApi from "../../api/adminrequest.js";
import {Notify} from "quasar";
import router from "../../router";

export default {
  name: "userForm",
  setup() {
    const userId = useRoute().params.id || null
    const timer = ref(0)
    const loading = ref(true)
    const userInfo = ref({
      username: '',
      nickname: '',
      gender: 'MALE',
      locked: '0',
      password: '',
      role: ['user']
    })

    function fetchData(userId) {
      if (userId == null) {
        loading.value = false
        return
      }
      adminApi.getUser(userId).then(res => {
        userInfo.value = res.data.data
        loading.value = false
      })
    }

    function onSubmit() {
      const id = userId || null
      const user = userInfo.value
      if (id) {
        adminApi.updateUser(id, user).then(response => {
          Notify.create({
            color: 'teal',
            group: false,
            timeout: 600,
            message: response.data.message,
            position: "top"
          })
          setTimeout(() => {
            //需要延迟的代码 :3秒后延迟跳转到首页，可以加提示什么的
            router.push('/userManage')
            //延迟时间：3秒
          }, 1500)
        })
      } else {
        adminApi.addUser(user).then(response => {
          if (response.data === false)
            return false
          Notify.create({
            color: 'teal',
            group: false,
            timeout: 600,
            message: response.data.message,
            position: "top"
          })
          setTimeout(() => {
            //需要延迟的代码 :3秒后延迟跳转到首页，可以加提示什么的
            router.push('/userManage');
            //延迟时间：3秒
          }, 1500)
        })
      }
    }

    fetchData(userId);

    return {
      timer,
      userId,
      userInfo,
      loading,
      onSubmit
    }
  }
}
</script>

<style scoped>
.user-form {
  width: 90vw;
  height: 90vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.input-form {
  padding-bottom: 10px;
}
</style>
