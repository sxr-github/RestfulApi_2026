import Apierror from "../../common/utils/api-error.js"
import {genearteResetToken} from "../../common/utils/jwt.utils.js"
import User from "./auth.model.js"

const register = async ({name, email, password, role}) => {
    
    const existingUser = await User.findOne({email})
    if(existingUser) throw Apierror.conflict("Email already exists")
    
    
    const {rawToken, hashedToken} =genearteResetToken()

    const user = await User.create({
        name,
        email,
        password,
        role,
        verification: hashedToken
    })

    // send email to user {rawToken}

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.verification

}

export {register}