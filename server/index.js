import 'dotenv/config'
import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import DOMPurify from 'isomorphic-dompurify'
import path from 'path'
import { fileURLToPath } from 'url'

const { MONGODB_URI, DB_NAME = 'bridge', PORT = 3000, ADMIN_PASSWORD } = process.env

if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD env var is required')
  process.exit(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new MongoClient(MONGODB_URI)
const app = express()

app.use(express.json({ limit: '1mb' }))
app.use(express.static(path.join(__dirname, '..', 'dist')))

let db

function requireAdmin(req, res, next) {
  const provided = req.get('x-admin-password')
  if (provided !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

app.get('/api/posts', async (_req, res) => {
  try {
    const posts = await db.collection('posts').find().toArray()
    res.json(posts)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

app.post('/api/posts', requireAdmin, async (req, res) => {
  try {
    const { title, body } = req.body
    if (!title || !body) {
      return res.status(400).json({ error: 'title and body are required' })
    }
    const cleanBody = DOMPurify.sanitize(body)
    const result = await db.collection('posts').insertOne({
      title,
      body: cleanBody,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    res.json({ _id: result.insertedId, title, body: cleanBody })
  } catch (error) {
    console.error('Failed to create post:', error)
    res.status(500).json({ error: 'Failed to create post' })
  }
})

app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
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
