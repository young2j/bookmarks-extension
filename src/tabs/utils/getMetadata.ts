import urlMetadata from "url-metadata"

type favicon = {
  type: string
  href: string
  sizes: string
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

    const icons = (metadata.favicons as Array<favicon>) || []
    let icon = ""
    for (let item of icons) {
      if (item.href) {
        const iconHref = new URL(item.href, _url)
        icon = iconHref.href
        break
      }
    }

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
        metadata["twitter:image"].toString(),
      icon
    }

    return { data, success: true }
  } catch (error) {
    return { data: error.message, success: false }
  }
}

export default getMetadata
