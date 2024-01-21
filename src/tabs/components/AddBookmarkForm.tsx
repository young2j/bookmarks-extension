import { Listbox, Transition } from "@headlessui/react"
import { ArrowSeparateVertical, Folder, PasteClipboard } from "iconoir-react"
import { Fragment, useEffect, useRef, useState, type FormEvent } from "react"
import { toast } from "sonner/dist"

import { useBookmarkStore } from "../stores/BookmarkStore"
import Button from "./Button"

const AddBookmarkForm = () => {
  const { addGroupBookmark, loading, currentGroupName } = useBookmarkStore(
    (state) => ({
      addGroupBookmark: state.addGroupBookmark,
      loading: state.loading,
      currentGroupName: state.currentGroupName
    })
  )

  const [url, setUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>()

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await addGroupBookmark(currentGroupName, url)
    if (!response.success) {
      return toast.error(response.data)
    }
    toast.success(response.data)
    setUrl("")
  }

  const handlePaste = async () => {
    const clipboardText = await navigator.clipboard.readText()
    setUrl(clipboardText)
    inputRef.current?.focus()
  }

  return (
    <form
      className="flex items-center justify-center w-full gap-2 mt-8"
      onSubmit={handleCreate}>
      <GroupOptions currentGroupName={currentGroupName} />
      <div className="relative w-full max-w-sm">
        <input
          ref={inputRef}
          className="w-full py-2 pl-4 pr-10 bg-transparent border rounded-md backdrop-blur-lg border-zinc-700 focus:border-zinc-500 focus:outline-none"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
        />
        <PasteClipboard
          className="absolute duration-200 cursor-pointer right-3 top-2 text-zinc-700 hover:text-zinc-400"
          width={18}
          onClick={handlePaste}
        />
      </div>
      <Button type="submit" disabled={loading}>
        Add
      </Button>
    </form>
  )
}

const GroupOptions = ({ currentGroupName }) => {
  const { listGroups, groups, setCurrentGroup, getCurrentGroup } =
    useBookmarkStore((state) => ({
      listGroups: state.listGroups,
      groups: state.groups,
      setCurrentGroup: state.setCurrentGroup,
      getCurrentGroup: state.getCurrentGroup
    }))

  const loadData = async () => {
    await listGroups()
    const { data } = await getCurrentGroup()
    await setCurrentGroup(data)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <>
      <Listbox
        value={currentGroupName}
        onChange={async (value) => {
          await setCurrentGroup(value)
        }}>
        <div className="relative">
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left border rounded-lg shadow-md cursor-default bg-zinc-900 focus:outline-nonesm:text-sm border-zinc-500">
            <span className="flex gap-2">
              <Folder />
              {currentGroupName}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ArrowSeparateVertical className="size-4" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Listbox.Options
              className={`absolute z-50 w-full py-1 mt-1 overflow-auto text-base rounded-md shadow-lg bg-zinc-900 max-h-60 ring-1 ring-black/5 focus:outline-none sm:text-sm
          ${groups.length ? "visible" : "invisible"}`}>
              {groups.map((group, groupIdx) => (
                <Listbox.Option
                  key={groupIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none p-4 ${
                      active ? "bg-sky-500 text-amber-900" : "text-white"
                    }`
                  }
                  value={group.name}>
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}>
                        {group.name}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  )
}

export default AddBookmarkForm
