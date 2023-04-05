import axios from "./axios"

export const postRequest = async (url, requstData) =>  {
        const data = await axios.post(url, requstData)
   
        return data;
}