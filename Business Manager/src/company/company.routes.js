'use strict'

import { Router } from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js'
import { excelGen, get, getA, getZ, save, search, update } from './company.controller.js'

const api = Router()

api.post('/save', [validateJwt], save)
api.put('/update/:id', [validateJwt], update)
api.get('/get', [validateJwt], get)
api.post('/search', [validateJwt],search)
api.get('/getA', [validateJwt], getA )
api.get('/getZ', [validateJwt], getZ)
api.get('/excel', [validateJwt], excelGen)


export default api