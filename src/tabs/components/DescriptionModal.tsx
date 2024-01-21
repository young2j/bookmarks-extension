import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState, type FormEvent } from "react"
import { toast } from "sonner/dist"

import { useBookmarkStore } from "../stores/BookmarkStore"
import Button from "./Button"

type Props = {
  isDescriptionModalOpen: boolean
  closeDescriptionModal: () => void
  bookmark: Bookmark
}

const DescriptionModal = ({
  isDescriptionModalOpen,
  closeDescriptionModal,
  bookmark
}: Props) => {
  const { currentGroupName, updateGroupBookmark } = useBookmarkStore(
    (state) => ({
      currentGroupName: state.currentGroupName,
      updateGroupBookmark: state.updateGroupBookmark
    })
  )

  const [description, setDescription] = useState("")

  const changeDescription = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await updateGroupBookmark(currentGroupName, bookmark.url, {
      description
    })
    if (!response.success) return toast.error(response.data)
    toast.success("Description changed successfully!")
    setDescription("")
  }

  return (
    <Transition appear show={isDescriptionModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-30 antialiased"
        onClose={closeDescriptionModal}>
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
                  Change Description
                </Dialog.Title>
                <p className="mt-2 text-sm text-zinc-500">
                  You are going to change the description of
                  <span className="text-sky-500">
                    &nbsp;&quot;{bookmark.title}&quot;&nbsp;
                  </span>
                  bookmark. Just write yours and save the changes.
                </p>
                <form onSubmit={changeDescription}>
                  <textarea
                    className="w-64 min-w-full min-h-full px-4 py-2 mt-4 bg-transparent border rounded-md h-36 border-zinc-700 focus:border-zinc-500 focus:outline-none caret-zinc-900 text-zinc-900"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={bookmark.description}
                  />
                  <div className="flex gap-2 mt-4 text-zinc-200">
                    <Button
                      type="submit"
                      className="bg-zinc-900 hover:bg-zinc-800">
                      Save changes
                    </Button>
                    <Button
                      onClick={closeDescriptionModal}
                      className="bg-transparent text-zinc-900 hover:bg-zinc-300">
                      Cancel
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DescriptionModal
