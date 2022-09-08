import {api} from "../boot/axios";

const api_name = '/admin/album'

export default {
    getAll() {
        return api(
            {
                url: `${api_name}/getAll`,
                method: 'get'
            }
        )
    },
    getAlbumMusics(id) {
        return api(
            {
                url: `${api_name}/getAlbumMusics/${id}`,
                method: 'get'
            }
        )
    },
    updateAlbumMusics(albums, id) {
        return api(
            {
                url: `${api_name}/updateAlbumMusics/${id}`,
                method: 'post',
                data: albums
            }
        )
    },
    getAlbumById(id) {
        return api(
            {
                url: `${api_name}/get/${id}`,
                method: 'get',
            }
        )
    },
    updateAlbum(album, id) {
        return api(
            {
                url: `${api_name}/updateAlbum/${id}`,
                method: 'post',
                data: album
            }
        )
    },
    addAlbum(album) {
        return api(
            {
                url: `${api_name}/addAlbum`,
                method: 'post',
                data: album
            }
        )
    },
    deleteAlbums(selectedIds) {
        return api(
            {
                url: `${api_name}/delAlbum`,
                method: 'post',
                data: selectedIds
            }
        )
    },
    publishAlbum(id) {
        return api(
            {
                url: `${api_name}/publishAlbum/${id}`,
                method: 'post',
            }
        )
    },
    closeAlbum(id) {
        return api(
            {
                url: `${api_name}/closeAlbum/${id}`,
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
    }
}
