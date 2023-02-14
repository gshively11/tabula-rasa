import path from 'path'
import { fileURLToPath } from 'url'

// absolute path to the directory housing this file
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Gets the absolute path to the root directory of the project
 */
export const getProjectRootDir = (): string => {
  const mode = import.meta.env.MODE

  return mode === 'production' ? path.join(__dirname, '../') : path.join(__dirname, '../../')
}

// gets the absolute path to the src directory
const __srcFolder = path.join(getProjectRootDir(), '/src')

/**
 * Converts a file path from absolute to relative
 */
export const getRelativeUrlByFilePath = (filepath: string): string => {
  return filepath.replace(__srcFolder, '')
}
