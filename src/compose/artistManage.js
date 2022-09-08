import {computed, onMounted, ref} from "vue";
import {Notify, useQuasar} from "quasar";
import {useRouter} from "vue-router";
import artistApi from "../api/artist.js";

export const artistManage = () => {
    const rows = ref([])
    const $q = useQuasar()
    const router = useRouter()
    const loading = ref(true)
    const selectedArtists = ref([])
    const pagination = ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 11,
    })

    function reverseRecommend(id, status) {
        if (status === false) {
            artistApi.openRecommend(id).then(res => {
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
            artistApi.closeRecommend(id).then(res => {
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
        if (status === 'BAN' || status === 'DRAFT') {
            artistApi.artistSettled(id).then(res => {
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
        if (status === 'SETTLED') {
            artistApi.banArtist(id).then(res => {
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
        artistApi.getAll().then(res => {
            if (res.data.code === 200)
                rows.value = res.data.data
        })
        loading.value = false
    }

    const pagesNumber = computed(() => {
        return Math.ceil(rows.value.length / pagination.value.rowsPerPage)
    });
    const filter = ref('')

    function addArtist() {
        router.push('/artist/add')
    }

    function removeArtist(id) {
        if (id == null) {
            if (selectedArtists.value.length === 0) {
                $q.notify({
                    color: 'warning',
                    icon: 'fa-solid fa-triangle-exclamation',
                    timeout: 500,
                    position: 'top',
                    group: false,
                    message: '请选择要删除的艺人'
                })
            }
            const selectedIds = selectedArtists.value.map(item => item.id)
            artistApi.deleteArtists(selectedIds).then(() => {
                $q.notify({
                    color: 'teal',
                    icon: 'fa-solid fa-circle-check',
                    timeout: 500,
                    position: 'top',
                    group: false,
                    message: `成功删除${selectedIds.length}位艺人`
                })
                fetchData()
                selectedArtists.value = []
            })
        }
        artistApi.deleteArtists(id).then(() => {
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

    function updateArtist(artist, id) {
        artistApi.updateArtist(artist, id).then(() => {
            Notify.create({
                color: 'teal',
                group: false,
                timeout: 600,
                message: `艺人：${artist.name} 信息更新成功`,
                position: "top"
            })
            fetchData()
        })
        fetchData()
    }

    function editArtist(id) {
        router.push(`/artist/${id}`)
    }

    onMounted(fetchData);
    return {
        rows,
        loading,
        pagination,
        pagesNumber,
        filter,
        selectedArtists,
        fetchData,
        updateArtist,
        addArtist,
        reverseStatus,
        reverseRecommend,
        removeArtist,
        editArtist
    }
}
