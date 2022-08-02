import {api} from "../boot/axios";

const api_name = '/admin'

export default {
  getUsers() {
    return api(
      {
        url: `${api_name}/user/getUsers`,
        method: 'get'
      }
    )
  }
}
