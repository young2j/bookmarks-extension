import { ArrowRightCircle } from "iconoir-react"
import browser from "url:../assets/browser.webp"

import { useBookmarkStore } from "../stores/BookmarkStore"
import CardSpotlight from "./CardSpotlight"
import Stepper from "./Stepper"

const Showcase = () => {
  const { showCase, setShowCase } = useBookmarkStore((state) => ({
    showCase: state.showCase,
    setShowCase: state.setShowCase
  }))
  return (
    <div className="flex flex-col items-center w-full">
      <Stepper />
      <button
        className="flex items-center justify-center w-1/2 h-10 gap-2 border rounded-full text-wih bg-zinc-900 border-zinc-700 hover:ring-1 hover:ring-sky-500 hover:text-sky-500"
        onClick={async () => setShowCase(!showCase)}>
        <ArrowRightCircle className="size-6" />
        <span>Getting Started</span>
      </button>
      <CardSpotlight
        className="w-full mt-8 animate-fade-up animate-delay-200 animate-duration-500 aspect-[8/5]"
        style={{ backgroundImage: `url(${browser})` }}
      />
    </div>
  )
}

export default Showcase
