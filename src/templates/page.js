import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'
import { cloudinary } from "../utils/helper";

/**
* Single page (/:slug)
*
* This file renders a single page and loads all the content.
*
*/
const Page = ({ data, location }) => {
    const page = data.ghostPage

    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="website"
            />
            <Helmet>
                <style type="text/css">{`${page.codeinjection_styles}`}</style>
            </Helmet>
            <Layout bodyClass={"post-template site-main"}>
              <article className="post-full post page no-image">
                <header className="post-full-header">
                  <h1 className="post-full-title">{page.title}</h1>
                </header>
                <section className="post-full-content">
                  <div className="post-content load-external-scripts"
                       dangerouslySetInnerHTML={{ __html: cloudinary( page.html ) }}>
                  </div>
                </section>
              </article>
            </Layout>
        </>
    )
}

Page.propTypes = {
    data: PropTypes.shape({
        ghostPage: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Page

export const postQuery = graphql`
    query($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`
