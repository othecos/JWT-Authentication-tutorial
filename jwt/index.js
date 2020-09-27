const jwt = require( 'jsonwebtoken')
const uuidv4 = require( 'uuid').v4
module.exports = class JwtController {
    constructor() {
        this.refreshTokens = []
    }

    signIn(email) {
        try {
            const refreshToken = uuidv4()
            const token = jwt.sign({ email }, process.env.SECRET, {
                expiresIn: 60,
            })
            this.refreshTokens.push({
                email,
                refreshToken
            })
            return {
                email,
                token,
                refreshToken
            }

        } catch (err) {
            console.error(err);
            throw { code: 500 }
        }

    }
    verify(token, secret) {
        try {
            const payload = jwt.verify(token, secret)
            var expirationDate = new Date(payload.exp * 1000)
            if (expirationDate < new Date()) {
                throw { code: 401, message: 'Token expired' }
            }
            return payload
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                throw { code: 401, message: err.message }
            }
            throw { code: 400 }
        }
    }
    refresh(token) {
        try {
            let refreshToken = this.refreshTokens.find((tk) => tk.refreshToken == token)
            if (refreshToken) {
                let payload = this.signIn(refreshToken.email)
                this.deleteRefreshToken(token)
                return payload
            } else {
                throw { code: 404 }
            }
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                throw { code: 401 }
            }
            throw { code: err.code || 500 }
        }
    }
    deleteRefreshToken(token) {
        try {
            let refreshTokenIndex = this.refreshTokens.findIndex((tk) => tk.refreshToken == token)
            if (refreshTokenIndex != -1) {
                this.refreshTokens.splice(refreshTokenIndex,1)
                return { message: `Refresh Token ${token} deleted` }
            } else {
                throw { code: 404 }
            }
        } catch (err) {
            throw { code: 400 }
        }
    }
}