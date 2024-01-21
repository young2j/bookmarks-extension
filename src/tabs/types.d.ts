type Bookmark = {
  title: string
  domain: string
  url: string
  description: string
  image: string
  createdAt: string
  tags: string[]
  pinned: boolean
}

// for state
type BookmarkGroup = {
  name: string
  bookmarksCount: number
  tagsCount: number
  createdAt: string
}

// for store
type StoreBookmarks = {
  [key: string]: Bookmark
}

// for store
type StoreBookmarkGroup = {
  name: string
  bookmarks: StoreBookmarks
  createdAt: string
}

type StoreBookmarkGroups = {
  [key: string]: StoreBookmarkGroup
}
