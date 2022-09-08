import {api} from "../boot/axios";

const api_name = '/admin/playlist'

export default {
    getListMusicById(id) {
        return api(
            {
                url: `${api_name}/getMusicList/${id}`,
                method: 'get',
            }
        )
    },
    updateListMusic(musiclist, id) {
        return api(
            {
                url: `${api_name}/updateMusicList/${id}`,
                method: 'post',
                data: musiclist
            }
        )
    }
}
