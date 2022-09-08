import {api} from "../boot/axios";

const api_name = '/admin/playlist'

export default {
    getAll() {
        return api(
            {
                url: `${api_name}/getAllPL`,
                method: 'get'
            }
        )
    },
    getPlaylistById(id) {
        return api(
            {
                url: `${api_name}/get/${id}`,
                method: 'get',
            }
        )
    },
    updatePlaylist(playlist) {
        return api(
            {
                url: `${api_name}/updatePlaylist`,
                method: 'post',
                data: playlist
            }
        )
    },
    addPlaylist(playlist) {
        return api(
            {
                url: `${api_name}/addPlaylist`,
                method: 'post',
                data: playlist
            }
        )
    },
    deletePlaylists(selectedIds) {
        return api(
            {
                url: `${api_name}/deletePlaylist`,
                method: 'post',
                data: selectedIds
            }
        )
    },
    publishPlaylist(id) {
        return api(
            {
                url: `${api_name}/publishPlaylist/${id}`,
                method: 'post',
            }
        )
    },
    closePlaylist(id) {
        return api(
            {
                url: `${api_name}/closePlaylist/${id}`,
                method: 'post'
            }
        )
    },
    openRecommend(id) {
        return api(
            {
                url: `${api_name}/openRecommend/${id}`,
                method: 'post'
            }
        )
    },
    closeRecommend(id) {
        return api(
            {
                url: `${api_name}/closeRecommend/${id}`,
                method: 'post'
            }
        )
    },
    openSpecial(id) {
        return api(
            {
                url: `${api_name}/openSpecial/${id}`,
                method: 'post'
            }
        )
    },
    closeSpecial(id) {
        return api(
            {
                url: `${api_name}/closeSpecial/${id}`,
                method: 'post'
            }
        )
    }
}
