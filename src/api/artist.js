import {api} from "../boot/axios";

const api_name = '/admin/artist'

export default {
    getAll() {
        return api(
            {
                url: `${api_name}/getAll`,
                method: 'get'
            }
        )
    },
    getArtistById(id) {
        return api(
            {
                url: `${api_name}/get/${id}`,
                method: 'get',
            }
        )
    },
    updateArtist(artist, id) {
        return api(
            {
                url: `${api_name}/updateArtist/${id}`,
                method: 'post',
                data: artist
            }
        )
    },
    addArtist(playlist) {
        return api(
            {
                url: `${api_name}/addArtist`,
                method: 'post',
                data: playlist
            }
        )
    },
    deleteArtists(selectedIds) {
        return api(
            {
                url: `${api_name}/delArtist`,
                method: 'post',
                data: selectedIds
            }
        )
    },
    artistSettled(id) {
        return api(
            {
                url: `${api_name}/artistSettled/${id}`,
                method: 'post',
            }
        )
    },
    banArtist(id) {
        return api(
            {
                url: `${api_name}/banArtist/${id}`,
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
