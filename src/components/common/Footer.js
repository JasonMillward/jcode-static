import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { Navigation } from '.'

const Footer = ({ title, navigation }) => {

    return (
        <>
            {/* The footer at the very bottom of the screen */}
            <footer className="site-foot">
                <div className="site-foot-nav container">
                    <div className="site-foot-nav-left">
                        <Link to="/">{title}</Link> © 2019
                    </div>
                    <div className="site-foot-nav-right">
                        <Navigation data={navigation} navClass="site-foot-nav-item"/>
                    </div>
                </div>
            </footer>
        </>
    )
}

Footer.propTypes = {
    title: PropTypes.string,
    navigation: PropTypes.array,
}


export default Footer
