import { Menu, Transition } from "@headlessui/react"
import {
  BinMinusIn,
  Copy,
  MediaImage,
  OpenInBrowser,
  Pin,
  RefreshDouble
} from "iconoir-react"
import {
  Fragment,
  useState,
  type MouseEventHandler,
  type ReactNode
} from "react"
import { toast } from "sonner/dist"

import useClipboard from "../hooks/useClipboard"
import { useBookmarkStore } from "../stores/BookmarkStore"
import getMetadata from "../utils/getMetadata"
import DeleteModal from "./DeleteModal"
import DescriptionModal from "./DescriptionModal"
import ThumbnailModal from "./ThumbnailModal"

type Props = {
  bookmark: Bookmark
}

const BookmarkDropdown = ({ bookmark }: Props) => {
  const { currentGroupName, updateGroupBookmark } = useBookmarkStore(
    (state) => ({
      currentGroupName: state.currentGroupName,
      updateGroupBookmark: state.updateGroupBookmark
    })
  )
  const { copy } = useClipboard()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)

  const openInNewTab = (url: string) => window.open(url, "_blank")

  const pinBookmark = async () => {
    if (!currentGroupName) return
    const response = await updateGroupBookmark(currentGroupName, bookmark.url, {
      pinned: !bookmark.pinned
    })
    if (!response.success) return toast.error(response.data)
    if (bookmark.pinned)
      toast("Bookmark unpinned!", {
        style: { backgroundColor: "#18181b", borderColor: "#3f3f46" }
      })
    else
      toast("Bookmark pinned to the top!", {
        style: { backgroundColor: "#18181b", borderColor: "#3f3f46" }
      })
  }

  const copyUrl = (url: string) => {
    copy(url)
    toast("URL copied to clipboard!", {
      style: { backgroundColor: "#18181b", borderColor: "#3f3f46" }
    })
  }

  const refreshMetadata = async (url: string) => {
    const { data: newMetadata, success } = await getMetadata(url)
    if (!success) return toast.error("Failed to retrieve new metadata.")
    const { title, domain, description, image, icon } = newMetadata
    if (
      bookmark.title === title &&
      bookmark.description === description &&
      bookmark.image === image &&
      bookmark.icon === icon
    )
      return toast("No new data found.", {
        style: { backgroundColor: "#18181b", borderColor: "#3f3f46" }
      })
    const response = await updateGroupBookmark(currentGroupName, bookmark.url, {
      title: title || domain,
      description,
      image,
      icon
    })
    if (!response.success) return toast.error(response.data)
    toast.success("Bookmark refreshed successfully!")
  }

  const closeDeleteModal = () => setIsDeleteModalOpen(false)
  const closeThumbnailModal = () => setIsThumbnailModalOpen(false)
  const closeDescriptionModal = () => setIsDescriptionModalOpen(false)

  return (
    <>
      <Menu as="div" className="relative ml-auto">
        <Menu.Button className="px-3 py-1 text-sm font-medium transition-all duration-200 border rounded-md outline-none bg-zinc-900/20 border-zinc-700 hover:border-zinc-500 focus:border-zinc-500">
          Options
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95">
          <Menu.Items className="absolute p-[1px] right-0 w-44 mt-2 origin-top-right bg-zinc-200 rounded-md text-sm z-30 shadow-xl focus:outline-non will-change-transform">
            <MenuItem onClick={() => openInNewTab(bookmark.url)}>
              <OpenInBrowser width={16} />
              Open in new tab
            </MenuItem>
            <MenuItem onClick={() => copyUrl(bookmark.url)}>
              <Copy width={16} />
              Copy URL
            </MenuItem>
            <MenuItem onClick={pinBookmark}>
              <Pin width={16} />
              {bookmark.pinned ? "Unpin" : "Pin to top"}
            </MenuItem>
            <MenuItem onClick={() => refreshMetadata(bookmark.url)}>
              <RefreshDouble width={16} />
              Refresh metadata
            </MenuItem>
            <MenuItem onClick={() => setIsThumbnailModalOpen(true)}>
              <MediaImage width={16} />
              Change thumbnail
            </MenuItem>
            <MenuItem onClick={() => setIsDescriptionModalOpen(true)}>
              <MediaImage width={16} />
              Change description
            </MenuItem>
            <MenuItem onClick={() => setIsDeleteModalOpen(true)}>
              <BinMinusIn width={16} className="text-red-600" />
              <span className="text-red-600">Delete</span>
            </MenuItem>
          </Menu.Items>
        </Transition>
      </Menu>
      {isDeleteModalOpen && (
        <DeleteModal
          isDeleteModalOpen={isDeleteModalOpen}
          closeDeleteModal={closeDeleteModal}
          bookmark={bookmark}
        />
      )}
      {isThumbnailModalOpen && (
        <ThumbnailModal
          isThumbnailModalOpen={isThumbnailModalOpen}
          closeThumbnailModal={closeThumbnailModal}
          bookmark={bookmark}
        />
      )}
      {isDescriptionModalOpen && (
        <DescriptionModal
          isDescriptionModalOpen={isDescriptionModalOpen}
          closeDescriptionModal={closeDescriptionModal}
          bookmark={bookmark}
        />
      )}
    </>
  )
}

type MenuItemProps = {
  onClick: MouseEventHandler<HTMLButtonElement>
  children: ReactNode
}

const MenuItem = ({ onClick, children }: MenuItemProps) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={`${
            active ? "bg-zinc-800 text-zinc-200" : "text-zinc-900"
          } flex gap-2 w-full items-center rounded-[5px] p-2`}>
          {children}
        </button>
      )}
    </Menu.Item>
  )
}

export default BookmarkDropdown
