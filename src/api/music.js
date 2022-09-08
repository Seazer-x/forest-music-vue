import {api} from "../boot/axios";

const api_name = '/admin/music'

export default {
    getMusics() {
        return api(
            {
                url: `${api_name}/listMusic`,
                method: 'get'
            }
        )
    },
    listMusicByArtist(id) {
        return api(
            {
                url: `${api_name}/listMusicByArtist/${id}`,
                method: 'get'
            }
        )
    },
    getMusicById(id) {
        return api(
            {
                url: `${api_name}/getMusic/${id}`,
                method: 'get',
            }
        )
    },
    updateMusic(music) {
        return api(
            {
                url: `${api_name}/updateMusic`,
                method: 'post',
                data: music
            }
        )
    },
    delMusics(selectedIds) {
        return api(
            {
                url: `${api_name}/delMusic`,
                method: 'post',
                data: selectedIds
            }
        )
    },
    addMusic(music) {
        return api(
            {
                url: `${api_name}/addMusic`,
                method: 'post',
                data: music
            }
        )
    },
    publishMusic(id) {
        return api(
            {
                url: `${api_name}/publishMusic/${id}`,
                method: 'post',
            }
        )
    },
    closeMusic(id) {
        return api(
            {
                url: `${api_name}/close/${id}`,
                method: 'post'
            }
        )
    }
}
