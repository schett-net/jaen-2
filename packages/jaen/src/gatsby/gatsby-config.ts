import {readFile} from '../services/jaen-data/internal'
import {GatsbyConfig as GatsbyConfigType} from 'gatsby'

const internalJaenData = readFile()

console.log('internalJaenData', internalJaenData)

const GatsbyConfig: GatsbyConfigType = {
  jsxRuntime: 'automatic',
  jsxImportSource: '@emotion/react',
  siteMetadata: internalJaenData.site.siteMetadata
}

const internalPlugins = [
  require.resolve('../internal-plugins/pages'),
  require.resolve('../internal-plugins/notify')
]

GatsbyConfig.plugins = [
  ...internalPlugins,
  {
    resolve: `gatsby-plugin-compile-es6-packages`,
    options: {
      modules: [
        `@jaenjs/jaen`,
        `@chakra-ui/gatsby-plugin`,
        'gatsby-plugin-image'
      ]
    }
  },
  {
    resolve: `gatsby-plugin-sharp`,
    options: {
      defaults: {
        formats: [`auto`, `webp`],
        placeholder: `dominantColor`,
        quality: 50,
        breakpoints: [750, 1080, 1366, 1920],
        backgroundColor: `transparent`,
        tracedSVGOptions: {},
        blurredOptions: {},
        jpgOptions: {},
        pngOptions: {},
        webpOptions: {},
        avifOptions: {}
      }
    }
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-image`
]

export default GatsbyConfig
