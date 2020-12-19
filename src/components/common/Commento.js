// https://itnext.io/adding-commento-to-react-apps-like-gatsby-871824fb57ae

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const insertScript = (src, id, parentElement) => {
    const script = window.document.createElement(`script`)
    script.async = true
    script.setAttribute(`data-auto-init`, `false`)
    script.src = src
    script.id = id
    parentElement.appendChild(script)
    return script
}

const removeScript = (id, parentElement) => {
    const script = window.document.getElementById(id)
    if (script) {
        parentElement.removeChild(script)
    }
}

const Commento = ({ id }) => {
    useEffect(() => {
        if (!window) {
            return
        }
        const document = window.document

        removeScript(`commento-script`, document.body)

        if (document.getElementById(`commento`)) {
            insertScript(`/js/commento.js`, `commento-script`, document.body)
        }
    }, [id])
    return <div id={`commento`} />
}

Commento.propTypes = {
    id: PropTypes.string,
}

export default Commento
