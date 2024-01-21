const isTabAdded = (tabUrl: string, bookmarkGroups: StoreBookmarkGroups) => {
  let tabAdded = false
  let tabAtGroup = ""
  if (!tabUrl) {
    return { tabAdded, tabAtGroup }
  }

  Object.values(bookmarkGroups).forEach((group) => {
    const bookmarks = group.bookmarks || {}
    if (bookmarks[tabUrl]) {
      tabAdded = true
      tabAtGroup = group.name
      return
    }
  })

  return { tabAdded, tabAtGroup }
}

export default isTabAdded
