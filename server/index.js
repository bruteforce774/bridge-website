import 'dotenv/config'
import express from 'express'
import { MongoCLient } from 'mongodb'
import path from 'path'

const { MONGODB_URI, DB_NAME = 'bridge', PORT = 3000 } = process.env

let db

app.get('/api/posts', async (_req, res) => {
  try {
    const posts = await db.collection('posts').find().toArray()
    res.json(posts)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

try {
  await client.connect()
  db = client.db(DB_NAME)
  console.log(`Connected to MongoDB database "${DB_NAME}"`)

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
} catch (error) {
  console.error('Failed to connect to MongoDB:', error)
  process.exit(1)
}
