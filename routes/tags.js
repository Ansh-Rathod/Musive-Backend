import express from 'express'
import pool from './../db.js'
import asyncHandler from './../methods/async-function.js'

const router = express.Router()

router.get(
	'/:tag',
	asyncHandler(async (req, res, next) => {
		const { page } = req.query ?? 0
		const { limit } = req.query ?? 20
		const offset = page * limit

		const { rows } = await pool.query(
			`select songid,
                  songname,
                  userid,
                  trackid,
                  duration,
                  cover_image_url,
                  first_name,
                  last_name from songs left join songappusers on songs.userid=songappusers.username where '${req.params.tag}'= any(tags) offset $1 limit $2;`,
			[offset, limit]
		)

		res.send({ results: rows })
	})
)
router.get(
	'/artists/:tag',
	asyncHandler(async (req, res, next) => {
		const { page } = req.query ?? 0
		const { limit } = req.query ?? 20
		const offset = page * limit

		let { rows } = await pool.query(
			`select avatar,first_name,last_name,username from songs left join songappusers on songs.userid=songappusers.username where '${req.params.tag}'= any(tags) offset $1 limit $2;`,
			[offset, limit]
		)

		rows = Object.values(
			rows.reduce(
				(acc, cur) => Object.assign(acc, { [cur.first_name]: cur }),
				{}
			)
		)

		res.send({ results: rows })
	})
)

export default router
