import express from 'express'
import pool from './../db.js'
import asyncHandler from './../methods/async-function.js'

const router = express.Router()

router.get(
	'/users',
	asyncHandler(async (req, res, next) => {
		const { page } = req.query ?? 0
		const { limit } = req.query ?? 20
		const offset = page * limit
		const { rows } = await pool.query(
			`select avatar,first_name,last_name,username from songappusers offset $1 limit $2;`,
			[offset, limit]
		)

		res.send({ results: rows })
	})
)
router.get(
	'/user/:id',
	asyncHandler(async (req, res, next) => {
		const { rows } = await pool.query(
			`select * from songappusers where username='${req.params.id}';`
		)

		res.send({ results: rows[0] })
	})
)

export default router
