import {computed, onMounted, ref} from "vue";
import {Notify, useQuasar} from "quasar";
import {useRouter} from "vue-router";
import playlistApi from "../api/playlist.js";

export const playListManage = () => {
    const rows = ref([])
    const $q = useQuasar()
    const router = useRouter()
    const loading = ref(true)
    const selectedPlaylists = ref([])
    const pagination = ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 11,
    })

    function reverseSpecial(id, status) {
        if (status === false) {
            playlistApi.openSpecial(id).then(res => {
                if (res.data.code === 200)
                    Notify.create({
                        color: 'teal',
                        timeout: 600,
                        icon: 'fa-solid fa-circle-check',
                        message: res.data.message,
                        position: "top"
                    })
                else
                    Notify.create({
                        color: 'warring',
                        icon: 'fa-solid fa-xmark',
                        timeout: 500,
                        position: 'top',
                        message: res.data.message
                    })
            })
            fetchData()
        }

        if (status === true) {
            playlistApi.closeSpecial(id).then(res => {
                if (res.data.code === 200)
                    Notify.create({
                        color: 'orange',
                        timeout: 600,
                        icon: 'fa-solid fa-circle-check',
                        message: res.data.message,
                        position: "top"
                    })
                else
                    Notify.create({
                        color: 'error',
                        icon: 'fa-solid fa-xmark',
                        timeout: 500,
                        position: 'top',
                        message: res.data.message
                    })
            })
            fetchData()
        }
    }

    function reverseRecommend(id, status) {
        if (status === false) {
            playlistApi.openRecommend(id).then(res => {
                if (res.data.code === 200)
                    Notify.create({
                        color: 'teal',
                        timeout: 600,
                        icon: 'fa-solid fa-circle-check',
                        message: res.data.message,
                        position: "top"
                    })
                else
                    Notify.create({
                        color: 'warring',
                        icon: 'fa-solid fa-xmark',
                        timeout: 500,
                        position: 'top',
                        message: res.data.message
                    })
            })
            fetchData()
        }

        if (status === true) {
            playlistApi.closeRecommend(id).then(res => {
                if (res.data.code === 200)
                    Notify.create({
                        color: 'orange',
                        timeout: 600,
                        icon: 'fa-solid fa-circle-check',
                        message: res.data.message,
                        position: "top"
                    })
                else
                    Notify.create({
                        color: 'error',
                        icon: 'fa-solid fa-xmark',
                        timeout: 500,
                        position: 'top',
                        message: res.data.message
                    })
            })
            fetchData()
        }
    }

    function reverseStatus(id, status) {
        if (status === 'CLOSE' || status === 'DRAFT') {
            playlistApi.publishPlaylist(id).then(res => {
                if (res.data.code === 200)
                    Notify.create({
                        color: 'teal',
                        icon: 'fa-solid fa-circle-check',
                        timeout: 600,
                        message: res.data.message,
                        position: "top"
                    })
                else
                    Notify.create({
                        color: 'error',
                        icon: 'fa-solid fa-xmark',
                        timeout: 500,
                        position: 'top',
                        message: res.data.message
                    })
            })
            fetchData()
        }
        if (status === 'PUBLISH') {
            playlistApi.closePlaylist(id).then(res => {
                if (res.data.code === 200)
                    Notify.create({
                        color: 'orange',
                        timeout: 600,
                        icon: 'fa-solid fa-circle-check',
                        message: res.data.message,
                        position: "top"
                    })
                else
                    Notify.create({
                        color: 'error',
                        icon: 'fa-solid fa-xmark',
                        timeout: 500,
                        position: 'top',
                        message: res.data.message
                    })
            })
        }
        fetchData()
    }

    function fetchData() {
        playlistApi.getAll().then(res => {
            rows.value = res.data.data
            loading.value = false
        })
    }

    const pagesNumber = computed(() => {
        return Math.ceil(rows.value.length / pagination.value.rowsPerPage)
    });
    const filter = ref('')

    function addPlaylist() {
        router.push('/playlist/add')
    }

    function removePlaylist(id) {
        if (id == null) {
            if (selectedPlaylists.value.length === 0) {
                $q.notify({
                    color: 'warning',
                    icon: 'fa-solid fa-triangle-exclamation',
                    timeout: 500,
                    position: 'top',
                    group: false,
                    message: '请选择要删除的歌单'
                })
            }
            const selectedIds = selectedPlaylists.value.map(item => item.id)
            playlistApi.deletePlaylists(selectedIds).then(() => {
                $q.notify({
                    color: 'teal',
                    icon: 'fa-solid fa-circle-check',
                    timeout: 500,
                    position: 'top',
                    group: false,
                    message: `成功删除${selectedIds.length}个歌单`
                })
                fetchData()
                selectedPlaylists.value = []
            })
        }
        playlistApi.deletePlaylists(id).then(() => {
            $q.notify({
                color: 'warring',
                icon: 'fa-solid fa-xmark',
                timeout: 500,
                position: 'top',
                group: false,
                message: "删除成功"
            })
            fetchData()
        })
    }

    function updatePlaylist(playlist) {
        playlistApi.updatePlaylist(playlist).then(() => {
            Notify.create({
                color: 'teal',
                group: false,
                timeout: 600,
                message: `歌单《${playlist.name}》更新成功`,
                position: "top"
            })
            fetchData()
        })
        fetchData()
    }

    function editPlaylist(id) {
        router.push(`/playlist/${id}`)
    }

    onMounted(fetchData);
    return {
        rows,
        loading,
        pagination,
        pagesNumber,
        filter,
        selectedPlaylists,
        fetchData,
        reverseSpecial,
        updatePlaylist,
        addPlaylist,
        reverseStatus,
        reverseRecommend,
        removePlaylist,
        editPlaylist
    }
}
