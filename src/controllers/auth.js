const models = require('../models/users')
const response = require('../helpers/response')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function genToken(id, email, role) {
    const payload = {
        user_id: id,
        email: email,
        role: role,
    }

    const token = jwt.sign(payload, process.env.JWT_KEYS, { expiresIn: 3600 })

    return {
        token,
        message: 'Token berhasil dibuat',
    }
}

async function Login(req, res) {
    try {
        const password_db = await models.getByEmail(req.body.email)
        if (password_db.length <= 0) {
            return response(res, 404, 'Email tidak ditemukan')
        }

        if (!password_db[0].verified) {
            return response(res, 401, 'Please verification your email')
        }

        const password_user = req.body.password
        const check = await bcrypt.compare(password_user, password_db[0].password)
        const { user_id, email, role } = password_db[0]
        if (check) {
            const token = genToken(user_id, email, role)
            return response(res, 200, token)
        } else {
            return response(res, 401, 'Password anda salah')
        }
    } catch (error) {
        throw error
    }
}

module.exports = Login
