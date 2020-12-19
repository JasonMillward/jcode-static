import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Moment from 'moment'
import Prism from "prismjs"

import { graphql } from 'gatsby'
import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'
import { cloudinary } from "../utils/helper"

import 'lazysizes'
import "prismjs/components/prism-python"
import "prismjs/components/prism-markup-templating"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-php"
import "prismjs/components/prism-git"
import "prismjs/components/prism-bash"

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/

const Post = ({ data, location }) => {
    const post = data.ghostPost
    const momentTime = Moment(post.published_at)

    useEffect(() => {
        var images = document.querySelectorAll(`.kg-gallery-image img`)
        images.forEach(function (image) {
            var container = image.closest(`.kg-gallery-image`)
            var width = image.attributes.width.value
            var height = image.attributes.height.value
            var ratio = width / height
            container.style.flex = ratio + ` 1 0%`
        })

        Prism.highlightAll()
    }, [])

    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="article"
            />
            <Helmet>
                <style type="text/css">{`${post.codeinjection_styles}`}</style>
            </Helmet>
            <Layout bodyClass={`post-template site-main`} showComments={true} slug={post.slug}>
                <article className="post-full post">
                    <header className="post-full-header">
                        <section className="post-full-meta">
                            <time className="post-full-meta-date" dateTime={momentTime.format(`YYYY-MM-DD`)}>
                                {momentTime.format(`D MMMM Y`)}
                            </time>
                        </section>
                        <h1 className="post-full-title">
                            {post.title}
                        </h1>
                    </header>
                    {post.feature_image ?
                        <figure className="post-full-image">
                            <img
                                className="blur-up lazy lazyload"
                                src={ cloudinary(post.feature_image, 100, `w_50,e_blur:700`) }
                                data-src={ cloudinary(post.feature_image) }
                                alt={post.title}
                            />
                        </figure> : null}
                    <section className="post-full-content">
                        <div className="post-content"
                            dangerouslySetInnerHTML={{ __html: cloudinary(post.html) }}>
                        </div>
                    </section>
                </article>
            </Layout>
        </>
    )
}

Post.propTypes = {
    data: PropTypes.shape({
        ghostPost: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Post

export const postQuery = graphql`
    query($slug: String!) {
        ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
        }
    }
`
