import { Combobox, Transition } from "@headlessui/react"
import { ArrowSeparateVertical, HomeAlt } from "iconoir-react"
import { Fragment, useEffect, useState } from "react"

import Button from "../tabs/components/Button"

import "./index.css"

import CountUp from "react-countup"
import { toast } from "sonner/dist"

import { store, useBookmarkStore } from "~tabs/stores/BookmarkStore"
import setBadge from "~tabs/utils/setBadge"

const BookmarkPopup = () => {
  const {
    loading,
    groups,
    currentGroupName,
    getCurrentGroup,
    setCurrentGroup,
    addGroupBookmark,
    deleteGroupBookmark,
    getGroupBookmarks,
    listGroups,
    isCurrentTabAdded
  } = useBookmarkStore((state) => ({
    loading: state.loading,
    groups: state.groups,
    currentGroupName: state.currentGroupName,
    getCurrentGroup: state.getCurrentGroup,
    setCurrentGroup: state.setCurrentGroup,
    addGroupBookmark: state.addGroupBookmark,
    deleteGroupBookmark: state.deleteGroupBookmark,
    getGroupBookmarks: state.getGroupBookmarks,
    listGroups: state.listGroups,
    isCurrentTabAdded: state.isCurrentTabAdded
  }))

  const [seletedGroup, setSelectedGroup] = useState(currentGroupName)
  const [inputTabUrl, setInputTabUrl] = useState("")
  const [tabInGroup, setTabInGroup] = useState(false)
  const [query, setQuery] = useState("")

  const filteredGroups =
    query === ""
      ? groups
      : groups.filter((group) =>
          group.name.includes(query.toLowerCase().replace(/\s+/g, ""))
        )

  const loadData = async () => {
    const currentTabUrl: string = await store.get("currentTabUrl")
    setInputTabUrl(currentTabUrl)
    const tabAtGroup: string = await store.get("currentTabAtGroup")
    if (tabAtGroup) {
      await setCurrentGroup(tabAtGroup)
      setSelectedGroup(tabAtGroup)
      setTabInGroup(true)
    } else {
      const { data: groupName } = await getCurrentGroup()
      setSelectedGroup(groupName)
      const { data: bookmarks } = await getGroupBookmarks(groupName)
      const tabInGroup = bookmarks.some(
        (bookmark) => bookmark.url === currentTabUrl
      )
      setTabInGroup(tabInGroup)
    }

    await listGroups()
  }

  useEffect(() => {
    loadData()
  }, [])

  const onChangeGroup = async (groupName: string) => {
    setSelectedGroup(groupName)
    const response = await setCurrentGroup(groupName)
    if (!response.success) {
      toast.error(response.data)
      return
    }
    const { data: bookmarks } = await getGroupBookmarks(groupName)
    const tabInGroup = bookmarks.some(
      (bookmark) => bookmark.url === inputTabUrl
    )
    setTabInGroup(tabInGroup)
  }

  const onClickYes = async () => {
    let response: { success: boolean; data: string }
    if (tabInGroup) {
      response = await deleteGroupBookmark(seletedGroup, inputTabUrl)
    } else {
      response = await addGroupBookmark(seletedGroup, inputTabUrl)
    }

    if (!response.success) {
      toast.error(response.data)
    } else {
      toast.success(response.data)
      setTabInGroup(!tabInGroup)
    }

    const { data: added } = await isCurrentTabAdded(inputTabUrl)
    await setBadge(added)

    window.close()
  }

  return (
    <>
      <div className="z-30 flex flex-col gap-4 p-4 text-black border-1 border-zinc-900 w-96 bg-zinc-200">
        <div className="grid items-center grid-cols-5 text-center">
          <span className="col-span-4 font-mono text-xl italic font-bold text-center text-zinc-950">
            {tabInGroup ? "Remove Boomark" : "Add Bookmark"}
          </span>
          <div
            className="flex flex-col items-center col-span-1 cursor-pointer"
            onClick={() => window.open("/tabs/home.html", "_blank")}>
            <HomeAlt className="size-8" />
            <span className="animate-pulse">Go Home</span>
          </div>
        </div>

        <div className="grid items-center w-full grid-cols-6 gap-4">
          <label className="col-span-1 font-mono text-base text-md justify-self-end">
            url
          </label>
          <input
            className="w-full col-span-5 py-2 pl-4 pr-10 overflow-hidden text-sm text-left text-gray-300 border-none rounded-lg shadow-md focus:ring-teal-300 bg-zinc-800 focus:ring-0 focus:outline-none focus-visible:ring-1 "
            type="text"
            placeholder={inputTabUrl}
            value={inputTabUrl}
            onChange={(e) => {
              setInputTabUrl(e.target.value)
            }}
            disabled={loading}
          />
        </div>
        <div className="grid items-center w-full grid-cols-6 gap-4">
          <label className="col-span-1 font-mono text-base justify-self-end">
            group
          </label>
          <Combobox
            value={seletedGroup}
            disabled={loading}
            onChange={onChangeGroup}>
            <div className="relative z-50 col-span-5 mt-1 ">
              <div>
                <Combobox.Input
                  as="input"
                  className="w-full py-2 pl-4 overflow-hidden text-sm text-gray-300 border-none rounded-lg shadow-md bg-zinc-800 focus:outline-none focus-visible:ring-1 focus:ring-1 focus:ring-teal-300"
                  displayValue={() => seletedGroup}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ArrowSeparateVertical
                    className="w-5 h-5 text-white"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}>
                <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base rounded-md shadow-lg bg-zinc-800 max-h-60 ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {filteredGroups.length === 0 && query !== "" ? (
                    <div className="relative px-4 py-2 cursor-default select-none text-zinc-300">
                      Nothing Found.{" "}
                      <a
                        href="/tabs/home.html"
                        className="italic text-blue-500 underline">
                        Go Home To Add.
                      </a>
                    </div>
                  ) : (
                    filteredGroups.map((group) => (
                      <Combobox.Option
                        key={group.name}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-teal-500 text-black" : "text-white"
                          }`
                        }
                        value={group.name}>
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}>
                              <GroupItem group={group} />
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-black" : "text-teal-600"
                                }`}>
                                <ArrowSeparateVertical
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>
        <hr className="mt-4 border-zinc-900" />
        <div className="flex justify-end w-full gap-8 mx-auto text-zinc-200">
          <Button
            loading={loading}
            onClick={onClickYes}
            className="bg-zinc-800 text-center hover:bg-zinc-900 hover:shadow hover:shadow-zinc-600 min-w-[7rem]">
            {tabInGroup ? "Yes remove !" : "Yes, add !"}
          </Button>
          <Button
            onClick={() => window.close()}
            className="bg-transparent text-center text-zinc-900 hover:shadow hover:shadow-zinc-600 hover:bg-zinc-300 min-w-[7rem]">
            No, cancel !
          </Button>
        </div>
      </div>
    </>
  )
}

const GroupItem = ({ group }: { group: BookmarkGroup }) => {
  return (
    <div className="flex items-center justify-between ">
      <p>{group.name} </p>
      <CountUp end={group.bookmarksCount} />
    </div>
  )
}

export default BookmarkPopup
