/**
 * This script will generate a ~200 word blog post on a random topic, as well as an image that
 * matches the theme of the blog post. The blog post will be written to disk in markdown format at
 * src/content/post/*.md and the image will be written to disk in png format at
 * src/assets/images/posts/*.png.
 *
 * The blog posts are used by the ai_blog project, located at src/pages/projects/ai_blog
 */
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { Configuration, OpenAIApi } from 'openai'
import slugify from 'limax'
import sharp from 'sharp'

// absolute path of the directory in which this file exists
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// get the client to communicate with OpenAI's api
const openai = getOpenAiClient()
// generate a blog post
const post = await generateBlogPost(openai)
// generate an image for the blog post
const imageB64 = await generateBlogPostImage(openai, post.imageDescription)
// compress the image and return a buffer
const compressedImageBuffer = await compressImage(imageB64)
// write the blog post to a file
writeBlogPostToFile(post, compressedImageBuffer)

/**
 * hoisted functions below
 */

/**
 * Creates the client used to communicate with OpenAI's API
 */
function getOpenAiClient() {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })

  return new OpenAIApi(config)
}

/**
 * Cleans up the response from OpenAI, to make
 * it JSON-parsable.
 */
function cleanOpenAiResponse(text) {
  // sometimes it returns the wrong quote characters
  text = text.replace('“', '"')
  text = text.replace('”', '"')
  // sometimes it has trailing commas
  text = text.replace(/",\s*\}/g, '"}')
  // sometimes there are newlines in values
  text = text.replace(/(": "[^"]+)\n+([^"]+")/g, '$1<br/>$2')
  // sometimes the spacing is wonky
  text = text.replace(/\s{2,}/g, ' ')
  return text.trim()
}

/**
 * Use OpenAI to generate a blog post.
 */
async function generateBlogPost(openai) {
  console.log(`Generating a blog post on a random topic, this may take 10-30 seconds...`)

  const completion = await openai.createChatCompletion({
    max_tokens: 3500,
    model: 'gpt-3.5-turbo',
    temperature: 1.2,
    messages: [
      {
        role: 'user',
        content: `
          Write a roughly 200 word blog post on a random topic.
          The author of the blog post should be a robot that is pretending to be human.
          Your response must be in valid JSON format, and it must contain the following properties: title, description, excerpt, category, tags, body, imageDescription.
          The excerpt should be 1 to 2 contiguous sentences from the blog post.
          The description should be 1 to 2 sentences.
          The imageDescription should be a 1 sentence description for an image that fits the theme of the blog post.
          Use <br/> tags instead of new lines in response values.
          Every key and value in the response should be wrapped in double quotes.
          Category and tags must be all lower-case.
        `,
      },
    ],
  })

  // clean up the response so that we can JSON parse it
  const postText = cleanOpenAiResponse(completion.data.choices[0].message.content)

  try {
    const post = JSON.parse(postText)

    // sometimes tags is a string, but it must be an array
    if (typeof post.tags === 'string') {
      post.tags = post.tags.split(',')
    }

    // sometimes exceprt is empty/undefined, so we fall back to description
    if (!post.excerpt || post.excerpt === 'undefined') {
      post.excerpt = post.description
    }

    // make sure the excerpt does not have any break tags in it
    post.excerpt = post.excerpt.replace('<br/>', '')

    return post
  } catch (err) {
    // throw the error with the response from OpenAI so we can investigate why
    // it failed to parse and then add further remediations
    throw new Error(`
      Unable to JSON parse response from OpenAI.
      ${postText}
    `)
  }
}

/**
 * Generate an image for the blog post using a short image description
 */
async function generateBlogPostImage(openai, imageDescription) {
  console.log(
    `Generating an image with the following description: ${imageDescription}, this may take 10-30 seconds...`
  )
  const response = await openai.createImage({
    // we try to center the image in the frame, because the aspect ratio of the final
    // image that appears in the blog chops off image height
    prompt: `${imageDescription}, centered in the frame`,
    n: 1,
    response_format: 'b64_json',
    size: '1024x1024',
  })
  return response.data.data[0].b64_json
}

/**
 * Resize the image to fit the aspect ratio used by the blog, and compress it to save
 * space in the repo.
 */
async function compressImage(imageB64) {
  return await sharp(Buffer.from(imageB64, 'base64'))
    .resize({ width: 900, height: 503 })
    .png({ compressionLevel: 9, quality: 5 })
    .toBuffer()
}

/**
 * Write the blog post and image to files in markdown format, with a yaml header.
 */
function writeBlogPostToFile(post, imageBuffer) {
  // slugify the title so its safe to use as a filename
  const filename = slugify(post.title)
  const dateToday = new Date()
  // strip the time, because we only care about the date
  dateToday.setHours(0, 0, 0, 0)
  const publishDate = dateToday.toISOString()

  // write the image to disk
  fs.writeFileSync(path.join(__dirname, `../src/assets/images/posts/${filename}.png`), imageBuffer)

  // write markdown blog post to disk
  fs.writeFileSync(
    path.join(__dirname, `../src/content/post/${filename}.md`),
    `---
publishDate: "${publishDate}"
title: "${post.title}"
description: "${post.description}"
excerpt: "${post.excerpt}"
category: "${post.category}"
tags: ${JSON.stringify(post.tags)}
image: "~/assets/images/posts/${filename}.png"
imageDescription: "${post.imageDescription}"
canonical: "https://ihopethis.works/projects/ai_blog/${filename}"
---
${post.body}`
  )
}
