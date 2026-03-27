import * as authService from "./auth.service"
import Apiresponse from "../../common/utils/api-response"


const register = async (req, res) => {
    const user = await authService.register(req.body)
    Apiresponse.created(res, "Registration created" ,user)
}   


export {register}
