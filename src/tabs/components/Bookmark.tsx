import { Pin } from "iconoir-react"
import type { SyntheticEvent } from "react"
import fallbackImage from "url:../assets/fallback.png"

import { useBookmarkStore } from "../stores/BookmarkStore"
import BookmarkDropdown from "./BookmarkDropdown"
import BookmarkTags from "./BookmarkTags"
import CardSpotlight from "./CardSpotlight"
import Skeleton from "./Skeleton"

const Bookmark = ({ bookmark }: { bookmark: Bookmark }) => {
  const loading = useBookmarkStore((state) => state.loading)

  const addImageFallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = fallbackImage
  }

  if (loading) return <Skeleton />

  return (
    <CardSpotlight>
      <div className="relative z-10 overflow-hidden rounded-md aspect-video bg-zinc-800">
        <img
          className="object-cover w-full h-full m-auto"
          src={bookmark.image ? bookmark.image : fallbackImage}
          alt={bookmark.title}
          loading="lazy"
          onError={addImageFallback}
        />
        {bookmark.pinned && <PinBadge />}
      </div>
      <div>
        <div className="flex items-center gap-2">
          {!bookmark.icon ? (
            <IconPlaceHolder domain={bookmark.domain} />
          ) : (
            <img
              src={bookmark.icon}
              alt={`${bookmark.title} icon`}
              className="w-4 h-4"
              onError={(e) => {
                e.currentTarget.parentElement.replaceChild(
                  (
                    <IconPlaceHolder domain={bookmark.domain} />
                  ) as unknown as Node,
                  e.currentTarget
                )
              }}
            />
          )}
          <p className="font-medium truncate">{bookmark.title}</p>
          <BookmarkDropdown bookmark={bookmark} />
        </div>
        <a
          href={bookmark.url}
          target="_blank"
          className="inline-block max-w-[75%] mb-2 text-sm truncate outline-none text-zinc-500"
          rel="noreferrer">
          {bookmark.url}
        </a>
        <BookmarkTags bookmark={bookmark} />
        <p className="text-sm">{bookmark.description}</p>
      </div>
    </CardSpotlight>
  )
}

const PinBadge = () => {
  return (
    <div className="absolute flex items-center justify-center w-6 h-6 rounded-full top-2 right-2 bg-zinc-800">
      <Pin width={16} />
    </div>
  )
}

const IconPlaceHolder = ({ domain }: { domain: string }) => {
  const letter = domain?.replace(/^www\./, "")[0]?.toUpperCase() || "B"

  return (
    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-zinc-800">
      {letter}
    </div>
  )
}

export default Bookmark
