import React, { useEffect } from "react"
import { Toaster } from "sonner/dist"

import "./home.css"

import AddBookmarkForm from "./components/AddBookmarkForm"
import Bookmarks from "./components/Bookmarks"
import Footer from "./components/Footer"
import Header from "./components/Header"
import ScrollToTop from "./components/ScrollToTop"
import Showcase from "./components/Showcase"
import SideMenu from "./components/SideMenu"
import TagList from "./components/TagList"
import { useBookmarkStore } from "./stores/BookmarkStore"

const App = () => {
  const { showCase, getShowCase } = useBookmarkStore((state) => ({
    showCase: state.showCase,
    getShowCase: state.getShowCase
  }))

  useEffect(() => {
    getShowCase()
  }, [])

  return (
    <div className="relative flex flex-col text-zinc-200 bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] bg-[length:1200px_800px] from-zinc-500/10 to-60% to-transparent bg-top bg-no-repeat selection:bg-zinc-500/20 antialiased">
      <Header />
      <main className="flex flex-col items-center md:w-5/6 w-11/12 mb-24 max-w-6xl gap-8 mx-auto min-h-screen bg-[length:1200px_800px] bg-top bg-no-repeat">
        {showCase ? (
          <Showcase />
        ) : (
          <>
            <SideMenu />
            <AddBookmarkForm />
            <TagList />
            <Bookmarks />
          </>
        )}
        <ScrollToTop />
        <Toaster richColors closeButton theme="dark" position="bottom-center" />
      </main>
      <Footer />
    </div>
  )
}

export default App
