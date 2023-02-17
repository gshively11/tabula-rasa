import path from 'path'
import { fileURLToPath } from 'url'
import swaggerJsdoc from 'swagger-jsdoc'

// absolute path of the directory in which this file exists
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Tabula Rasa API',
      version: '0.0.1',
      description: 'API for the Tabula Rasa Project',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Grant Shively',
        url: 'https://ihopethis.works',
        email: 'gshively11+ihopethisworks@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [`${__dirname}/**/*.js`],
}

const specs = swaggerJsdoc(options)

export default specs
