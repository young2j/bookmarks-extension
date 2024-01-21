import { Github } from "iconoir-react"
import { useState } from "react"
import logo from "url:../assets/logo.png"
import defaultProfilePicture from "url:../assets/profilepic.png"

import useScrollProgess from "../hooks/useScrollProgess"
import CommandMenu from "./CommandMenu"
import ProfileCard from "./ProfileCard"

const Header = () => {
  const completion = useScrollProgess()
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false)
  const closeProfileCard = () => setIsProfileCardOpen(false)

  return (
    <header className="sticky top-0 z-30 w-full py-2 border-b backdrop-blur-xl backdrop-saturate-150 bg-zinc-900/40 border-zinc-700">
      <div className="flex items-center w-11/12 max-w-6xl gap-2 mx-auto md:w-10/12">
        <img
          className={`w-6 h-6 rounded-full cursor-pointer`}
          src={defaultProfilePicture || logo}
          alt="profile picture"
          onClick={() => setIsProfileCardOpen((prev) => !prev)}
        />
        <p className="font-bold">Bookmarks</p>
        <nav className="flex items-center gap-4 ml-auto">
          <CommandMenu />
          <Github
            className="cursor-pointer hover:text-sky-500"
            onClick={() =>
              window.open(
                "https://github.com/young2j/bookmarks-extension",
                "_blank"
              )
            }
          />
        </nav>
      </div>

      <span
        className="absolute bottom-[-1px] w-full h-[1px] bg-zinc-400 duration-300"
        style={{ transform: `translateX(${completion - 100}%)` }}></span>

      {isProfileCardOpen && (
        <ProfileCard
          isProfileCardOpen={isProfileCardOpen}
          closeProfileCard={closeProfileCard}
        />
      )}
    </header>
  )
}

export default Header
