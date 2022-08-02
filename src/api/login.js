import {api} from "../boot/axios.js";

const api_name = '/api/user'

export const adminLogin = (username,password)=> {
      return api(
        {
          url: `${api_name}/login`,
          method: 'post',
          data:{username, password}
        }
      )
}
