import { useBookmarkStore } from "../stores/BookmarkStore"
import Bookmark from "./Bookmark"
import EmptyState from "./EmptyState"

const Bookmarks = () => {
  const { bookmarks, loading, selectedTag } = useBookmarkStore((state) => ({
    bookmarks: state.bookmarks,
    loading: state.loading,
    selectedTag: state.selectedTag
  }))

  if (!bookmarks.length && !loading) return <EmptyState />

  let filteredBookmarks = selectedTag
    ? bookmarks.filter((bookmark) => bookmark.tags?.includes(selectedTag))
    : bookmarks
  filteredBookmarks = filteredBookmarks.sort((a, b) =>
    a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
  )

  return (
    <section className="grid w-full grid-cols-1 gap-4 h-fit md:grid-cols-2 xl:grid-cols-3">
      {filteredBookmarks.map((bookmark) => (
        <Bookmark key={bookmark.url} bookmark={bookmark} />
      ))}
    </section>
  )
}

export default Bookmarks
