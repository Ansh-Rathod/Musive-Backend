import express from 'express'
import pool from './../db.js'
import asyncHandler from './../methods/async-function.js'

const router = express.Router()

router.get(
	'/:username',
	asyncHandler(async (req, res, next) => {
		const { page } = req.query ?? 0
		const { limit } = req.query ?? 20
		const offset = page * limit
		const { username } = req.params
		const { rows } = await pool.query(
			`select songid,
                  songname,
                  userid,
                  trackid,
                  duration,
                  cover_image_url,
                  first_name,
                  last_name from songs left join songappusers on songs.userid=songappusers.username where userid='${username}' offset $1 limit $2;`,
			[offset, limit]
		)

		res.send({ results: rows })
	})
)

router.get(
	'/one/:name',
	asyncHandler(async (req, res, next) => {
		const { name } = req.params

		const { rows } = await pool.query(
			`select songid,
                  songname,
                  userid,
                  trackid,
                  duration,
                  cover_image_url,
                  first_name,
                  last_name from songs left join songappusers on songs.userid=songappusers.username where songid='${name}';`
		)
		console.log(rows)
		res.send({ results: rows })
	})
)

router.get(
	'/random/all',
	asyncHandler(async (req, res, next) => {
		const { limit } = req.query ?? 20
		const offset = getRandomInt(0, 180)

		const { rows } = await pool.query(
			`select songid,
                  songname,
                  userid,
                  trackid,
                  duration,
                  cover_image_url,
                  first_name,
                  last_name from songs left join songappusers on songs.userid=songappusers.username offset $1 limit $2;`,
			[offset, limit]
		)

		res.send({ results: rows })
	})
)

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export default router
