'use strict'

import { Router } from 'express'
import { deleteU, get, save, search, update } from './category.controller.js';
import { validateJwt } from '../middlewares/validate-jwt.js';

const api = Router()

api.post('/save', [ validateJwt], save)
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleteU)

api.get('/get', [validateJwt], get)
api.post('/search', [validateJwt], search)

export default api