import {computed, onMounted, ref} from "vue";
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import adminApi from "../api/adminrequest.js";

export const userManage = () => {
    const rows = ref([])
    const $q = useQuasar()
    const router = useRouter()
    const loading = ref(true)
    const selectedUsers = ref([])
    const pagination = ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 11,
    })

    function fetchData() {
        adminApi.getUsers().then(res => {
            rows.value = res.data.data
            loading.value = false
        })
    }

    const pagesNumber = computed(() => {
        return Math.ceil(rows.value.length / pagination.value.rowsPerPage)
    });
    const filter = ref('')

    function addUser() {
        router.push('/user/add')
    }

    function removeUsers(id) {
        if (id == null) {
            if (selectedUsers.value.length === 0) {
                $q.notify({
                    color: 'warning',
                    icon: 'fa-solid fa-triangle-exclamation',
                    timeout: 500,
                    position: 'top',
                    group: false,
                    message: '请选择要删除的用户'
                })
                return
            }
            const selectedIds = selectedUsers.value.map(item => item.id)
            adminApi.removeUsers(selectedIds).then(() => {
                $q.notify({
                    color: 'teal',
                    icon: 'fa-solid fa-circle-check',
                    timeout: 500,
                    position: 'top',
                    group: false,
                    message: `成功删除${selectedIds.length}名用户`
                })
                fetchData()
                selectedUsers.value = []
            })
        }
        adminApi.removeUsers(id).then(() => {
            $q.notify({
                color: 'teal',
                icon: 'fa-solid fa-circle-check',
                timeout: 500,
                position: 'top',
                group: false,
                message: '删除成功'
            })
            fetchData()
        })
    }

    function onEdit(id) {
        router.push(`/edit/${id}`)
    }

    onMounted(fetchData);
    return {
        rows,
        loading,
        pagination,
        pagesNumber,
        filter,
        selectedUsers,
        fetchData,
        addUser,
        removeUsers,
        onEdit
    }
}
