import { Dialog, Disclosure, RadioGroup, Transition } from "@headlessui/react"
import {
  AlignJustify,
  BinMinusIn,
  Check,
  Download,
  Edit,
  Folder,
  FolderPlus,
  Plus
} from "iconoir-react"
import { Fragment, useEffect, useRef, useState } from "react"
import { toast } from "sonner/dist"

import useClickOutside from "../hooks/useClickOutside"
import useDraggable from "../hooks/useDraggable"
import { useBookmarkStore } from "../stores/BookmarkStore"
import Button from "./Button"
import { GroupStat } from "./Stat"

const SideMenu = () => {
  const {
    currentGroupName,
    setCurrentGroup,
    addGroup,
    renameGroup,
    deleteGroup,
    exportData,
    importData,
    getGroupBookmarks,
    listGroups
  } = useBookmarkStore((state) => ({
    currentGroupName: state.currentGroupName,
    setCurrentGroup: state.setCurrentGroup,
    addGroup: state.addGroup,
    renameGroup: state.renameGroup,
    deleteGroup: state.deleteGroup,
    exportData: state.exportData,
    importData: state.importData,
    getGroupBookmarks: state.getGroupBookmarks,
    listGroups: state.listGroups
  }))

  const disclosureRef = useRef<HTMLDivElement>()
  const buttonRef = useRef<HTMLButtonElement>()
  const importRef = useRef<HTMLInputElement>()
  useDraggable(buttonRef, disclosureRef)
  // useClickOutside(disclosureRef, () => {
  //   if (buttonRef.current.className.includes("border-sky-500")) {
  //     buttonRef.current.click()
  //   }
  // })
  const [selectedGroup, setSelectedGroup] = useState(currentGroupName)

  useEffect(() => {
    setSelectedGroup(currentGroupName)
  }, [currentGroupName])

  useEffect(() => {
    const importRefCurrrent = importRef.current
    if (!importRefCurrrent) return
    importRefCurrrent.addEventListener("change", importBookmarks, false)
    return () => {
      importRefCurrrent.removeEventListener("change", importBookmarks, false)
    }
  }, [])

  const onClickAddGroup = async () => {
    const response = await addGroup("new group")
    if (!response.success) {
      toast(response.data)
      return
    }
    setCurrentGroup("new group")
    setSelectedGroup("new group")
  }

  const importBookmarks = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (evt) => {
        const content = evt.target.result.toString()
        const respose = await importData(content)
        if (respose.success) {
          toast.success(respose.data)
          await getGroupBookmarks(currentGroupName)
          await listGroups()
        } else {
          toast.error(respose.data)
        }
      }
      reader.readAsText(file)
    }
  }

  const exportBookmarks = async () => {
    const data = await exportData()
    const blob = new Blob([data], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.style.display = "none"
    a.href = url
    a.download = "bookmarks.json" // 设置下载的文件名
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div ref={disclosureRef} className="fixed z-50 w-10 right-1/4 top-[5rem]">
      <Disclosure>
        {({ open }) => (
          <>
            <div className="flex flex-row items-center justify-between min-w-60">
              <Disclosure.Button
                ref={buttonRef}
                className={`p-3 border rounded-full bg-zinc-900  ${
                  open ? "border-sky-500" : "border-zinc-700"
                }`}>
                <AlignJustify
                  className={`transition ease-in-out duration-200  ${
                    open ? "rotate-90 text-sky-500" : ""
                  }`}
                />
              </Disclosure.Button>
              <span
                className={`flex items-center cursor-pointer justify-between min-w-40 ${
                  open ? "visible" : "invisible"
                }`}>
                <Plus
                  className="size-8 text-sky-500"
                  onClick={onClickAddGroup}
                />
                <span className="flex items-center">
                  <input
                    type="file"
                    className="self-start invisible size-0"
                    ref={importRef}
                  />
                  <FolderPlus
                    className="size-8 text-sky-500"
                    onClick={() => importRef.current?.click()}></FolderPlus>
                </span>
                <Download
                  className="size-8 text-sky-500"
                  onClick={exportBookmarks}
                />
              </span>
            </div>
            <Disclosure.Panel>
              <Groups
                deleteGroup={deleteGroup}
                renameGroup={renameGroup}
                setCurrentGroup={setCurrentGroup}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
              />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}

const Groups = ({
  renameGroup,
  deleteGroup,
  selectedGroup,
  setSelectedGroup,
  setCurrentGroup
}) => {
  const { listGroups, groups, getCurrentGroup, getGroupBookmarks } =
    useBookmarkStore((state) => ({
      listGroups: state.listGroups,
      groups: state.groups,
      getCurrentGroup: state.getCurrentGroup,
      getGroupBookmarks: state.getGroupBookmarks
    }))

  const loadData = async () => {
    await listGroups()
    const { data } = await getCurrentGroup()
    setSelectedGroup(data)
    await getGroupBookmarks(data)
  }

  useEffect(() => {
    loadData()
  }, [])

  const [editing, setEditing] = useState(false)
  const [removing, setRemoving] = useState(false)
  const groupsRootRef = useRef()
  useClickOutside(groupsRootRef, () => setEditing(false))
  const [newGroupName, setNewGroupName] = useState("new group")

  const onClickRenameGroup = async (oldName: string) => {
    setEditing(false)
    const response = await renameGroup(oldName, newGroupName)
    if (!response.success) {
      toast.error(response.data)
      return
    }
    setSelectedGroup(newGroupName)
    setCurrentGroup(newGroupName)
  }

  return (
    <div className="w-full px-2 py-4" ref={groupsRootRef}>
      <div
        className={`w-full max-w-screen-md mx-auto overflow-hidden border rounded-md shadow-lg resize-x  border-zinc-700 min-w-max`}>
        <RadioGroup
          value={selectedGroup}
          onChange={(value) => {
            setSelectedGroup(value)
            setCurrentGroup(value)
            setEditing(false)
          }}>
          {groups.map((group, groupIdx) => (
            <RadioGroup.Option
              key={groupIdx}
              value={group.name}
              className={({ checked }) =>
                `${checked ? "text-sky-500" : "text-white"}
                   bg-zinc-900  hover:bg-zinc-800 relative flex cursor-pointer px-5 py-4 shadow-md focus:outline-none`
              }>
              {({ checked }) => (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center w-full">
                      <div className="w-full text-md">
                        <RadioGroup.Label
                          as="p"
                          className={`w-full flex justify-between items-center font-medium gap-2 cursor-pointer
                          ${checked ? "text-sky-500" : "text-white"}`}>
                          <span className="flex items-center gap-2">
                            <Folder className="size-4" />
                            {editing && checked ? (
                              <input
                                type="text"
                                className="px-2 py-1 text-white rounded-md bg-zinc-700 "
                                defaultValue={group.name}
                                onChange={(e) =>
                                  setNewGroupName(e.target.value)
                                }
                                onKeyDown={async (e) => {
                                  if (e.key == "Enter" && editing) {
                                    await onClickRenameGroup(group.name)
                                  }
                                }}
                              />
                            ) : (
                              <span>{group.name}</span>
                            )}
                          </span>
                          {checked && (
                            <span className="flex items-center gap-5">
                              {editing ? (
                                <Check
                                  className="size-5"
                                  onClick={async () =>
                                    await onClickRenameGroup(group.name)
                                  }
                                />
                              ) : (
                                <Edit
                                  className="size-5"
                                  onClick={() => setEditing(true)}
                                />
                              )}
                              <BinMinusIn
                                className="text-red-600 size-4"
                                onClick={() => setRemoving(true)}
                              />
                            </span>
                          )}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className="flex flex-row justify-start w-full gap-x-2 text-zinc-400">
                          <GroupStat
                            data={group.bookmarksCount}
                            description={"bookmarks"}
                          />
                          <GroupStat
                            data={group.tagsCount}
                            description={"tags"}
                          />
                          <GroupStat
                            isNumeric={false}
                            data={group.createdAt}
                            description={"created"}
                          />
                        </RadioGroup.Description>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </div>
      {removing && (
        <RemoveDialog
          removing={removing}
          setRemoving={setRemoving}
          deleteGroup={deleteGroup}
          selectedGroup={selectedGroup}
        />
      )}
    </div>
  )
}

const RemoveDialog = ({
  removing,
  setRemoving,
  deleteGroup,
  selectedGroup
}) => {
  const onClickDelete = async () => {
    setRemoving(false)
    const response = await deleteGroup(selectedGroup)
    if (!response.success) {
      return toast.error(response.data)
    }
    toast.success("Group deleted successfully")
  }

  return (
    <Transition appear show={removing} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-30 antialiased"
        onClose={() => setRemoving(false)}>
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
              <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform rounded-lg bg-zinc-200 selection:bg-zinc-500/20">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold text-zinc-900">
                  Delete group
                </Dialog.Title>
                <p className="mt-2 text-sm text-zinc-500">
                  You are going to delete all bookmarks under
                  <span className="text-red-500">
                    &nbsp;&quot;{selectedGroup}&quot;&nbsp;
                  </span>
                  group. Are you sure?
                </p>
                <div className="flex gap-2 mt-4 text-zinc-200">
                  <Button
                    onClick={onClickDelete}
                    className="bg-transparent text-zinc-900 hover:bg-zinc-300">
                    Yes, delete!
                  </Button>
                  <Button
                    onClick={() => setRemoving(false)}
                    className="bg-zinc-900 hover:bg-zinc-800">
                    No, keep it!
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SideMenu
