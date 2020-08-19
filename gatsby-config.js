const path = require(`path`)

const config = require(`./src/utils/siteConfig`)
const generateRSSFeed = require(`./src/utils/rss/generate-feed`)

let ghostConfig

try {
    ghostConfig = require(`./.ghost`)
} catch (e) {
    ghostConfig = {
        production: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
    }
} finally {
    const { apiUrl, contentApiKey } = process.env.NODE_ENV === `development` ? ghostConfig.development : ghostConfig.production

    if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
        throw new Error(`GHOST_API_URL and GHOST_CONTENT_API_KEY are required to build. Check the README.`) // eslint-disable-line
    }
}

/**
* This is the place where you can tell Gatsby which plugins to use
* and set them up the way you want.
*
* Further info 👉🏼 https://www.gatsbyjs.org/docs/gatsby-config/
*
*/
module.exports = {
    siteMetadata: {
        siteUrl: config.siteUrl,
    },
    plugins: [
        /**
         *  Content Plugins
         */
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `pages`),
                name: `pages`,
            },
        },
        // Setup for optimised images.
        // See https://www.gatsbyjs.org/packages/gatsby-image/
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `images`),
                name: `images`,
            },
        },
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-source-ghost`,
            options:
                process.env.NODE_ENV === `development`
                    ? ghostConfig.development
                    : ghostConfig.production,
        },
        /**
         *  Utility Plugins
         */
        {
            resolve: `gatsby-plugin-ghost-manifest`,
            options: {
                short_name: config.shortTitle,
                start_url: `/`,
                background_color: config.backgroundColor,
                theme_color: config.themeColor,
                display: `minimal-ui`,
                icon: `static/${config.siteIcon}`,
                legacy: true,
                query: `
                {
                    allGhostSettings {
                        edges {
                            node {
                                title
                                description
                            }
                        }
                    }
                }
              `,
            },
        },
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                {
                    allGhostSettings {
                        edges {
                            node {
                                title
                                description
                            }
                        }
                    }
                }
              `,
                feeds: [
                    generateRSSFeed(config),
                ],
            },
        },
        {
            resolve: `gatsby-plugin-advanced-sitemap`,
            options: {
                query: `
                {
                    allGhostPost {
                        edges {
                            node {
                                id
                                slug
                                updated_at
                                created_at
                                feature_image
                            }
                        }
                    }
                    allGhostPage {
                        edges {
                            node {
                                id
                                slug
                                updated_at
                                created_at
                                feature_image
                            }
                        }
                    }
                    allGhostTag {
                        edges {
                            node {
                                id
                                slug
                                feature_image
                            }
                        }
                    }
                    allGhostAuthor {
                        edges {
                            node {
                                id
                                slug
                                profile_image
                            }
                        }
                    }
                }`,
                mapping: {
                    allGhostPost: {
                        sitemap: `posts`,
                    },
                    allGhostTag: {
                        sitemap: `tags`,
                    },
                    allGhostAuthor: {
                        sitemap: `authors`,
                    },
                    allGhostPage: {
                        sitemap: `pages`,
                    },
                },
                exclude: [
                    `/dev-404-page`,
                    `/404`,
                    `/404.html`,
                    `/offline-plugin-app-shell-fallback`,
                ],
                createLinkInHead: true,
                addUncaughtPages: true,
            },
        },
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        `gatsby-plugin-catch-links`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-force-trailing-slashes`,
        `gatsby-plugin-offline`,
        {
            resolve: 'gatsby-plugin-fathom',
            options: {
                // Fathom server URL. Defaults to `cdn.usefathom.com`
                trackingUrl: 'stats.jcode.me',
                // Unique site id
                siteId: 'BQTMQ'
            }
        },
        {
          resolve: `gatsby-plugin-goatcounter`,
          options: {
            // Either `code` or `selfHostUrl` is required.
            // REQUIRED IF USING HOSTED GOATCOUNTER! https://[my_code].goatcounter.com
            code: 'jcode',
     
            // REQUIRED IF USING SELFHOSTED GOATCOUNTER!
            // selfHostUrl: `https://example.com`,
     
            // ALL following settings are OPTIONAL
     
            // Avoids sending pageview hits from custom paths
            exclude: [],
     
            // Delays sending pageview hits on route update (in milliseconds)
            pageTransitionDelay: 0,
     
            // Defines where to place the tracking script
            // boolean `true` in the head and `false` in the body
            head: true,
     
            // Set to true to include a gif to count non-JS users
            pixel: true,
     
            // Allow requests from local addresses (localhost, 192.168.0.0, etc.)
            // for testing the integration locally.
            // TIP: set up a `Additional Site` in your GoatCounter settings
            // and use its code conditionally when you `allowLocal`, example below
            allowLocal: false,
     
            // Override the default localStorage key more below
            localStorageKey: 'skipgc',
     
            // Set to boolean true to enable referrer set via URL parameters
            // Like example.com?ref=referrer.com or example.com?utm_source=referrer.com
            // Accepts a function to override the default referrer extraction
            // NOTE: No Babel! The function will be passes as is to your websites <head> section
            // So make sure the function works as intended in all browsers you want to support
            referrer: false,
     
            // Setting it to boolean true will clean the URL from
            // `?ref` & `?utm_` parameters before sending it to GoatCounter
            // It uses `window.history.replaceState` to clean the URL in the
            // browser address bar as well.
            // This is to prevent ref tracking ending up in your users bookmarks.
            // All parameters other than `ref` and all `utm_` will stay intact
            urlCleanup: false,
          },
        },
    ],
}
