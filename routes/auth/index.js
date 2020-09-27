const { Router } = require("express");
const JwtController = require("./../../jwt/index");

const router = Router()
const jwtController = new JwtController()
const initRouter = () => {

    router
        .route('/login')
        .post(login)

    router
        .route('/validate')
        .post(validate)

    router
        .route('/refresh')
        .post(refresh)

    router
        .route('/logout')
        .post(logout)


    return router;
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const response = jwtController.signIn(email)
        res.status(200).json(response)
    }
    catch (err) {
        console.error(err)
        res.status(err.code).json({ message: err.message })
    }
}
const validate = async (req, res) => {
    try {
        if (!req.headers['authorization']) throw { code: 401 }
        let token = req.headers['authorization'].split('Bearer ')[1].trim()
        const response = jwtController.verify(token, process.env.SECRET)
        res.status(200).json(response)
    }
    catch (err) {
        console.error(err)
        res.status(err.code).json({ message: err.message })
    }
}
const refresh = async (req, res) => {
    try {
        let { refreshToken } = req.body
        const response = jwtController.refresh(refreshToken)
        res.status(200).json(response)
    }
    catch (err) {
        console.error(err)
        res.status(err.code).json({ message: err.message })
    }
}
const logout = async (req, res) => {
    try {
        let { refreshToken } = req.body
        const response = jwtController.deleteRefreshToken(refreshToken, process.env.SECRET)
        res.status(200).json(response)
    }
    catch (err) {
        console.error(err)
        res.status(err.code).json({ message: err.message })
    }
}

module.exports = initRouter()