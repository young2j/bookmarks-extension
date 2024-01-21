import { Check } from "iconoir-react"
import { useRef, useState, type FormEvent } from "react"
import { toast } from "sonner/dist"

import useClickOutside from "../hooks/useClickOutside"
import { useBookmarkStore } from "../stores/BookmarkStore"

type Props = {
  bookmark: Bookmark
}
const BookmarkTags = ({ bookmark }: Props) => {
  const { currentGroupName, updateGroupBookmark } = useBookmarkStore(
    (state) => ({
      currentGroupName: state.currentGroupName,
      updateGroupBookmark: state.updateGroupBookmark
    })
  )
  const [editable, setEditable] = useState(false)
  const [newTags, setNewTags] = useState(bookmark.tags.join(", "))

  const formRef = useRef<HTMLFormElement>()
  useClickOutside(formRef, () => setEditable(false))

  const updateTags = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const tagList = newTags
      .replace(/\s/g, "")
      .split(",")
      .filter((tag) => tag)
    const response = await updateGroupBookmark(currentGroupName, bookmark.url, {
      tags: tagList
    })
    if (!response.success) return toast.error(response.data)
    setEditable(false)
  }

  return (
    <div
      className="flex flex-wrap gap-2 mb-2 font-mono text-xs"
      onClick={() => setEditable(true)}>
      {!bookmark.tags.length && !editable && (
        <p className="py-1 border-b border-transparent text-zinc-500">
          add tags...
        </p>
      )}
      {bookmark && editable ? (
        <form onSubmit={updateTags} ref={formRef} className="flex w-full gap-2">
          <input
            type="text"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            autoFocus
            className="max-w-full py-1 bg-transparent border-b border-zinc-600 focus:outline-none"
            style={{ width: `${newTags.length + 1}ch` }}
          />
          <button type="submit">
            <Check
              className="transition-all cursor-pointer text-zinc-400 hover:text-zinc-200"
              width={16}
            />
          </button>
        </form>
      ) : (
        bookmark.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 truncate border-b border-transparent rounded-md bg-zinc-700/50 text-zinc-400">
            {tag}
          </span>
        ))
      )}
    </div>
  )
}

export default BookmarkTags
