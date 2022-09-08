import {computed, onMounted, ref} from "vue";
import {Notify, useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";
import musicApi from "../api/music.js";
import playlistMusic from "../api/playlistmusic.js";

export const musicManage = () => {
    let rows = ref([])
    const $q = useQuasar()
    const router = useRouter()
    const loading = ref(true)
    const pathId = useRoute().params.id
    const selectedMusics = ref([])
    const pagination = ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 11,
    })

    function reverseStatus(id, status) {
        if (status === 'CLOSE' || status === 'DRAFT')
            musicApi.publishMusic(id).then(res => {
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
        if (status === 'PUBLISH')
            musicApi.closeMusic(id).then(res => {
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
        musicApi.getMusics()
    }

    function fetchData() {
        musicApi.getMusics().then(res => {
            rows.value = res.data.data
            loading.value = false
        })
    }

    const pagesNumber = computed(() => {
        return Math.ceil(rows.value.length / pagination.value.rowsPerPage)
    });
    const filter = ref('')

    function addMusic() {
        router.push('/music/add')
    }

    function removeMusics(id) {
        if (id == null) {
            if (selectedMusics.value.length === 0) {
                $q.notify({
                    color: 'warning',
                    icon: 'fa-solid fa-triangle-exclamation',
                    timeout: 500,
                    position: 'top',
                    group: false,
                    message: '请选择要删除的音乐'
                })
            }
            const selectedIds = selectedMusics.value.map(item => item.id)
            musicApi.delMusics(selectedIds).then(() => {
                $q.notify({
                    color: 'teal',
                    icon: 'fa-solid fa-circle-check',
                    timeout: 500,
                    position: 'top',
                    group: false,
                    message: `成功删除${selectedIds.length}首音乐`
                })
                fetchData()
                selectedMusics.value = []
            })
        }
        musicApi.delMusics(id).then(() => {
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

    function editMusic(id) {
        router.push(`/music/${id}`)
    }

    function fetchMusiclist() {
        const id = pathId || 0
        if (id === 0)
            return
        playlistMusic.getListMusicById(id).then(res => {
            selectedMusics.value = res.data.data
        })
    }

    function onSubmit() {
        const id = pathId || 0
        const musiclist = selectedMusics.value
        playlistMusic.updateListMusic(musiclist, id).then((res) => {
            Notify.create({
                color: 'teal',
                group: false,
                timeout: 600,
                message: res.data.message,
                position: "top"
            })
        })
    }


    fetchMusiclist()
    onMounted(fetchData);

    return {
        rows,
        loading,
        pagination,
        pagesNumber,
        filter,
        selectedMusics,
        onSubmit,
        reverseStatus,
        fetchData,
        addMusic,
        removeMusics,
        editMusic
    }
}
