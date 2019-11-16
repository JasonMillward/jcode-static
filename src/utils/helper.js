export function cloudinary(url, size, params) {

  let baseFetch = "https://res.cloudinary.com/jcode/image/fetch/"
  let ghostURL = "/https://ghost.jcode.me/content/images/"
  let defaultParams = "dpr_auto,w_auto,f_auto,q_auto"

  let newParams = params === undefined ? defaultParams : params

  let newSize = size === undefined ? 1000 : parseInt(size)

  return url.replace(
    /https:\/\/ghost.jcode.me\/content\/images\//gi,

    baseFetch + newParams + ghostURL +  "size/w" + newSize + "/"
  )
}

