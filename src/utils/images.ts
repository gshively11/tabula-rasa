/**
 * Retrieves images from disk
 */
const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined

  try {
    images = import.meta.glob('~/assets/images/**')
  } catch (e) {
    // continue regardless of error
  }

  return images
}

let _images

/**
 * Loads images once and caches them in memory
 */
export const fetchLocalImages = async () => {
  _images = _images || load()
  return await _images
}

/**
 * Retrieves an image by its path
 */
export const findImage = async (imagePath?: string) => {
  if (typeof imagePath !== 'string') {
    return null
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // Only consume images using ~/assets alias (or absolute)
  if (!imagePath.startsWith('~/assets')) {
    return null
  }

  const images = await fetchLocalImages()
  const key = imagePath.replace('~/', '/src/')

  return typeof images[key] === 'function' ? (await images[key]())['default'] : null
}
