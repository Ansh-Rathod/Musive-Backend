import express from 'express'
import pool from './../db.js'
import asyncHandler from './../methods/async-function.js'

const router = express.Router()

router.get(
	'/songs',
	asyncHandler(async (req, res, next) => {
		const { page } = req.query ?? 0
		const { limit } = req.query ?? 20
		const offset = page * limit
		const { q } = req.query
		const { rows } = await pool.query(
			`select songid,
                  songname,
                  userid,
                  trackid,
                  duration,
                  cover_image_url,
                  first_name,
                  last_name from songs left join songappusers on songs.userid=songappusers.username where LOWER(songname) like '%${q}%' offset $1 limit $2;`,
			[offset, limit]
		)

		res.send({ results: rows })
	})
)

router.get(
	'/artists',
	asyncHandler(async (req, res, next) => {
		const { page } = req.query ?? 0
		const { limit } = req.query ?? 20
		const offset = page * limit
		const { q } = req.query
		const { rows } = await pool.query(
			`select avatar,first_name,last_name,username from songappusers
                  where LOWER(first_name) like '%${q}%'
                  or LOWER(last_name) like '%${q}%'
                  or LOWER(username) like '%${q}'
                  offset $1 limit $2;`,
			[offset, limit]
		)

		res.send({ results: rows })
	})
)

export default router
