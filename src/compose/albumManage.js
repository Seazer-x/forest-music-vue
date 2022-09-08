import {computed, onMounted, ref} from "vue";
import {Notify, useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";
import albumApi from "../api/album.js";

export const albumManage = () => {
    const rows = ref([])
    const $q = useQuasar()
    const router = useRouter()
    const loading = ref(true)
    const pathId = useRoute().params.id
    const selectedAlbums = ref([])
    const selectedMusics = ref([])
    const pagination = ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 11,
    })

    function reverseRecommend(id, status) {
        if (status === false) {
            albumApi.openRecommend(id).then(res => {
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
            albumApi.closeRecommend(id).then(res => {
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
        if (status === 'BLOCKED' || status === 'DRAFT') {
            albumApi.publishAlbum(id).then(res => {
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
            albumApi.closeAlbum(id).then(res => {
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
        albumApi.getAll().then(res => {
            rows.value = res.data.data
            loading.value = false
        })
    }

    const pagesNumber = computed(() => {
        return Math.ceil(rows.value.length / pagination.value.rowsPerPage)
    });
    const filter = ref('')

    function addAlbum() {
        router.push('/album/add')
    }

    function removeAlbum(id) {
        if (id == null) {
            if (selectedAlbums.value.length === 0) {
                $q.notify({
                    color: 'warning',
                    icon: 'fa-solid fa-triangle-exclamation',
                    timeout: 500,
                    position: 'top',
                    group: false,
                    message: '请选择要删除的专辑'
                })
            }
            const selectedIds = selectedAlbums.value.map(item => item.id)
            albumApi.deleteAlbums(selectedIds).then(() => {
                $q.notify({
                    color: 'teal',
                    icon: 'fa-solid fa-circle-check',
                    timeout: 500,
                    position: 'top',
                    group: false,
                    message: `成功删除${selectedIds.length}张专辑`
                })
                fetchData()
                selectedAlbums.value = []
            })
        }
        albumApi.deleteAlbums(id).then(() => {
            $q.notify({
                color: 'teal',
                icon: 'fa-solid fa-circle-check',
                timeout: 500,
                position: 'top',
                group: false,
                message: "删除成功"
            })
            fetchData()
        })
    }

    function updateAlbum(album, id) {
        albumApi.updateAlbum(album, id).then(() => {
            Notify.create({
                color: 'teal',
                group: false,
                timeout: 600,
                message: `专辑《${album.name}》更新成功`,
                position: "top"
            })
            fetchData()
        })
        fetchData()
    }

    function editAlbum(id) {
        router.push(`/album/${id}`)
    }

    onMounted(fetchData);
    return {
        rows,
        loading, pathId,
        pagination,
        pagesNumber,
        filter,
        selectedAlbums, selectedMusics,
        fetchData,
        updateAlbum,
        addAlbum,
        reverseStatus,
        reverseRecommend,
        removeAlbum,
        editAlbum
    }
}
