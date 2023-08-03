import express from 'express'
import { readFile, writeFile } from 'node:fs/promises'
import * as Path from 'node:path'
const router = express.Router()
router.use(express.urlencoded({ extended: true }))

const data = await readFile(
  Path.resolve('server/data/data.json'),
  'utf-8'
).then((data) => JSON.parse(data))

// / route
router.get('/', (req, res) => {
  try {
    res.render('home', data)
  } catch (err) {
    res.send('Something went wrong, come back later')
    console.log(err)
  }
})
// /:id route
router.get('/:id', (req, res) => {
  try {
    const puppyId = Number(req.params.id)
    const pupData = data.puppies.find((el) => el.id === puppyId)

    const viewData = {
      id: pupData.id,
      name: pupData.name,
      breed: pupData.breed,
      owner: pupData.owner,
      image: pupData.image,
    }

    res.render('details', pupData)
  } catch (err) {
    res.send('Something went wrong, come back later')
    console.log(err)
  }
})

// /:id/edit
router.get('/:id/edit', (req, res) => {
  try {
    const puppyId = Number(req.params.id)
    const pupData = data.puppies.find((el) => el.id === puppyId)
    res.render('edit', pupData)
  } catch (err) {
    res.send('Something went wrong, come back later')
    console.log(err)
  }
})

// Post

// I have to use Bard & ChatGPT for POST route, the AI added the index,
// I still dont understand what it is for.

//  Post
router.post('/:id/edit', async (req, res) => {
  try {
    const puppyId = Number(req.params.id)

    const readData = await readFile(
      Path.resolve('server/data/data.json'),
      'utf-8'
    )
    const parseData = JSON.parse(readData)

    const index = parseData.puppies.findIndex((puppy) => puppy.id === puppyId)

    parseData.puppies[index] = {
      id: puppyId,
      name: req.body.name,
      owner: req.body.owner,
      breed: req.body.breed,
      image: req.body.image,
    }

    // Updating data
    const newFileContents = JSON.stringify(parseData, null, 2)
    await writeFile(Path.resolve('server/data/data.json'), newFileContents)

    // Redirect to the GET /puppies/:id route
    res.redirect(`/puppies/${puppyId}`)
  } catch (err) {
    res.send('Something went wrong, come back later')
    console.log(err)
  }
})

export default router
