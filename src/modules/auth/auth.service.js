import Apierror from "../../common/utils/api-error.js"
import Apiresponse from "../../common/utils/api-response.js"
import {genearteResetToken, generateAccessToken, generateRefreshToken, verifyRefreshToken} from "../../common/utils/jwt.utils.js"
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

const login = async ({email, password}) => {
    //create hashed tokens method
    const hashedToken = (token) => {
        crypto.createHash("sha256").update(token).digest("hex")
    }
    // take email and find the user in DB

    const user = await User.findOne({email}).select("+password")
    if (!user) throw new Apierror.unauthorized("Invalid Email or password")

    //then check password is correct
    //check if verified or not
    if(!user.isVerified) {
        throw Apierror.forbidden("Please verify your email")
    }

    //giving accessToken and refreshToken to the user
    const accessToken =  generateAccessToken({id: user._id, role: user.role})

    const refreshToken = generateRefreshToken({id: user._id})

    //save the  users tokens
    user.refreshToken = hashedToken(refreshToken)
    await user.save({validateBeforeSave: false})
 
    userObject = user.toObject()
    delete userObject.password
    delete userObject.refreshToken

    // send tokens to the users cookies [only for web app not avail for the mpn app]
    
    return {user: userObject, accessToken, refreshToken}

}

const refresh = async (token) => {
    if (!token) throw Apierror.unauthorized("Refresh token is missing")
        const decoded = verifyRefreshToken(token)

        const user = await User.findById(decoded.id).select("+refreshToken")
        if(!user) throw  Apierror.unauthorized("User not found")
        
        if(user.refreshToken !== hashedToken(token)){
            throw Apierror.unauthorized("Invalid  refresh token")
        }

        const accessToken = generateAccessToken({id : user._id, role : user.role })
        const refreshToken = generateRefreshToken({id : user._id})

        user.refreshToken = hashedToken(refreshToken)
        await user.save({validateBeforeSave: false})
 
        userObject = user.toObject()
        delete userObject.password
        delete userObject.refreshToken
        
        
        return{user: userObject, accessToken, refreshToken}
}

const logout = async (userId) => {
    await User.findByIdAndUpdate(userId, {refreshToken: null})
} 

const forgotPassword = async (email) => {
    const user =  await User.findOne({email})

    if(!user) throw Apierror.notFound("user not found")

    const {rawToken, hashedToken} = genearteResetToken()

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpiresToken = Date.now() + 15*60*10000

    await user.save()
}

export {register,refresh}