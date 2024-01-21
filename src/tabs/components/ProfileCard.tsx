import { Dialog, Transition } from "@headlessui/react"
import dayjs from "dayjs"
import { Xmark } from "iconoir-react"
import { Fragment } from "react"
import Balancer from "react-wrap-balancer"
import logo from "url:../assets/logo.png"

import { useBookmarkStore } from "../stores/BookmarkStore"
import { ProfileStat } from "./Stat"

type Props = {
  isProfileCardOpen: boolean
  closeProfileCard: () => void
}

const ProfileCard = ({ isProfileCardOpen, closeProfileCard }: Props) => {
  const { firstUsedAt, groups } = useBookmarkStore((state) => ({
    bookmarks: state.bookmarks,
    firstUsedAt: state.firstUsedAt,
    groups: state.groups
  }))

  const daysSinceFirstLogin = dayjs().diff(firstUsedAt, "days")
  const totalGroupsCount = groups.length
  const totalBookmarksCount = groups.reduce(
    (total, group) => total + group.bookmarksCount,
    0
  )
  const totalTagsCount = groups.reduce(
    (total, group) => total + group.tagsCount,
    0
  )

  return (
    <Transition appear show={isProfileCardOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-30 antialiased"
        onClose={closeProfileCard}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-opacity-50 bg-zinc-950 backdrop-brightness-50" />
        </Transition.Child>
        <div className="fixed inset-0">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="flex flex-col items-center justify-center w-full max-w-md gap-4 p-6 overflow-hidden transition-all transform border rounded-lg border-zinc-800 bg-zinc-950/50 backdrop-blur-2xl backdrop-saturate-150 text-zinc-200 selection:bg-zinc-500/20 animate-rotate-y animate-duration-700">
                <div className="absolute h-full w-full bg-[radial-gradient(#71717a,transparent_1px)] [background-size:12px_12px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000000_70%,transparent_100%)] pointer-events-none"></div>
                <button
                  className="absolute duration-200 outline-none top-2 right-2 text-zinc-600 hover:text-zinc-200 animate-fade"
                  onClick={closeProfileCard}>
                  <Xmark />
                </button>
                <img
                  src={logo}
                  className="z-10 w-24 h-24 my-8 select-none"
                  alt="Bookmarks logo"
                />
                <span className="px-3 py-1 text-sm border rounded-full border-zinc-600">
                  bookmarks
                </span>
                <p className="text-sm text-zinc-500">
                  <Balancer>Say goodbye to messy bookmarks !</Balancer>
                </p>
                <div className="flex w-full my-8">
                  <ProfileStat data={daysSinceFirstLogin} description="days" />
                  <ProfileStat data={totalGroupsCount} description="groups" />
                  <ProfileStat
                    data={totalBookmarksCount}
                    description="bookmarks"
                  />
                  <ProfileStat data={totalTagsCount} description="tags" />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ProfileCard
