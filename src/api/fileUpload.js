import {api} from '../boot/axios.js'

export default {
    uploadFile(files, cate) {
        return api({
            url: `http://localhost:8333/admin/upload/${cate}`,
            method: 'POST',
            data: files
        })
    }
}
