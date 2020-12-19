import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { readingTime as readingTimeHelper } from '@tryghost/helpers'
import { cloudinary } from "../../utils/helper"

function postClass(index) {
    if (index % 6 === 0) {
        return `post-card post post-card-large`
    }
    return `post-card post`
}

function postImageSize(index) {
    let size = 300

    if (index % 6 === 0) {
        size = 600
    }

    return size
}

const PostCard = ({ post, idx }) => {
    const url = `/${post.slug}/`
    const readingTime = readingTimeHelper(post)

    const tags = post.tags.filter(function (tag) {
        return tag.visibility === `internal`
    })

    const featured = post.featured ? `featured` : ``

    return (
        <article className={`${postClass(idx)} ${featured}`}>
            <Link to={url} className="post-card-image-link">
                <img className="post-card-image lazy lazyload blur-up"
                    loading="lazy"
                    alt={post.title}
                    src={ cloudinary(post.feature_image, 100, `w_50,e_blur:700`) }
                    data-src={ cloudinary(post.feature_image, postImageSize(idx)) }
                />
            </Link>
            <div className="post-card-content">
                <Link to={url} className="post-card-content-link">
                    <header className="post-card-header">
                        <h2 className="post-card-title">{post.title}</h2>
                    </header>
                    <section className="post-card-excerpt">
                        <p>{post.excerpt && post.excerpt.split(` `).slice(0,39).join(` `)}</p>
                    </section>
                </Link>
                <footer className="post-card-meta">
                    <div className="author-list">
                        { tags.map(tag => <svg key={tag.name}>
                            <use href={ `/icons/${tag.name.replace(`#`, ``)}.svg#icon` }/>
                        </svg>
                        ) }
                    </div>
                    <span className="reading-time">{readingTime}</span>
                </footer>
            </div>
        </article>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        feature_image: PropTypes.string,
        featured: PropTypes.bool,
        tags: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
            })
        ),
        excerpt: PropTypes.string.isRequired,
        primary_author: PropTypes.shape({
            name: PropTypes.string.isRequired,
            profile_image: PropTypes.string,
        }).isRequired,
    }).isRequired,
    idx: PropTypes.id,
}

export default PostCard
