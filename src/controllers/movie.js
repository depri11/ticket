const models = require('../models/movies')
const response = require('../helpers/response')
const movies = {}

movies.getData = async (req, res) => {
    try {
        const data = await models.getMovie()
        return response(res, 200, data)
    } catch (error) {
        return response(res, 500, error)
    }
}

// Get all Movies
movies.getAll = async (req, res) => {
    try {
        const query = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
            order: req.query.order,
        }
        const { data, meta } = await models.getAll(query)
        return response(res, 200, data, meta)
    } catch (error) {
        return response(res, 500, error)
    }
}

// Get a Movie
movies.getMovie = async (req, res) => {
    try {
        const id = req.params.id
        const data = await models.getData(id)
        if (!data.length) {
            return response(res, 404, 'Data tidak ditemukan')
        } else {
            return response(res, 200, data)
        }
    } catch (error) {
        return response(res, 500, error)
    }
}

// Create a Movie
movies.createData = async (req, res) => {
    try {
        let images = null
        if (req.file !== undefined) {
            images = req.file.path
        }
        const { title, description, release_date, directed_by, duration, casts, category, price } = req.body
        const data = await models.addData({ title, description, release_date, directed_by, duration, casts, category, price, images })
        return response(res, 201, data)
    } catch (error) {
        return response(res, 500, error)
    }
}

// Update a Movie
movies.updateData = async (req, res) => {
    try {
        let images = null
        if (req.file !== undefined) {
            images = req.file.path
        }

        const { id } = req.params
        const { title, description, release_date, directed_by, duration, casts, price, category } = req.body
        const data = await models.updateData({ id, title, description, release_date, directed_by, duration, casts, price, category, images })

        if (!data.length) {
            return response(res, 404, 'Data tidak ditemukan')
        } else {
            return response(res, 200, data)
        }
    } catch (error) {
        return response(res, 500, error)
    }
}

// Delete a Movie
movies.deleteMovie = async (req, res) => {
    try {
        const { id } = req.params
        const data = await models.deleteData({ id })
        if (data.rowCount < 1) {
            return response(res, 404, 'Data tidak ditemukan')
        } else {
            return response(res, 200, 'Data berhasil di Delete')
        }
    } catch (error) {
        return response(res, 500, error)
    }
}

// Search Movie by Title
movies.getTitle = async (req, res) => {
    try {
        const { title, page } = req.query
        const lowercase = title.toLowerCase()
        const data = await models.searchData({ lowercase, page })
        if (!data.length) {
            return response(res, 404, 'Data tidak ditemukan')
        } else {
            return response(res, 200, data)
        }
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = movies
