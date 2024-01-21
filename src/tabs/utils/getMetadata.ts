import urlMetadata from "url-metadata"

type MetaData = {
  url: string
  title: string
  domain: string
  description: string
  image: string
}

const getMetadata = async (url: string) => {
  try {
    const options = {
      // custom request headers
      requestHeaders: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      // `fetch` API cache setting for request
      cache: "no-cache",
      // `fetch` API mode (ex: `cors`, `no-cors`, `same-origin`, etc)
      mode: "cors",
      // timeout in milliseconds, default is 10 seconds
      timeout: 20,
      // number of characters to truncate description to
      descriptionLength: 750,
      // force image urls in selected tags to use https,
      // valid for 'image', 'og:image', 'og:image:secure_url' tags & favicons with full paths
      ensureSecureImageRequest: true,
      // return raw response body as string
      includeResponseBody: false
    }
    const metadata = await urlMetadata(url, options)
    const _url = metadata.url.toString() || metadata["og:url"].toString() || url
    const domain = new URL(_url).hostname
    const data = {
      url: _url,
      title: metadata.title.toString() || metadata["og:title"].toString(),
      domain,
      description:
        metadata.description.toString() ||
        metadata["og:description"].toString(),
      image:
        metadata.image.toString() ||
        metadata["og:image"].toString() ||
        metadata["twitter:image"].toString()
    }

    return { data, success: true }
  } catch (error) {
    return { data: error.message, success: false }
  }
}

export default getMetadata
