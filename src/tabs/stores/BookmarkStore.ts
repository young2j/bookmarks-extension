import { create } from "zustand"

import { Storage } from "@plasmohq/storage"

import isTabAdded from "~tabs/utils/isTabAdded"

import getMetadata from "../utils/getMetadata"
import isValidUrl from "../utils/isValidUrl"

export const store = new Storage({
  // area: "sync"
  //sync中,每个键值对的容量最大是8k，全部键值对总容量上限是100k；local中，对单个键值对容量无限制，总容量限制为5M
  area: "local"
})

interface BookmarkState {
  showCase: boolean
  firstUsedAt: string
  currentGroupName: string
  groups: BookmarkGroup[]
  bookmarks: Bookmark[]
  selectedTag: string
  loading: boolean

  setShowCase: (value: boolean) => void
  getShowCase: () => Promise<{ data: boolean; success: boolean }>
  isCurrentTabAdded: (
    tabUrl: string
  ) => Promise<{ data: boolean; success: boolean }>
  getCurrentGroup: () => Promise<{ data: string; success: boolean }>
  setCurrentGroup: (
    groupName: string
  ) => Promise<{ data: string; success: boolean }>
  addGroup: (groupName: string) => Promise<{ data: string; success: boolean }>
  deleteGroup: (
    groupName: string
  ) => Promise<{ data: string; success: boolean }>
  renameGroup: (
    oldName: string,
    newName: string
  ) => Promise<{ data: string; success: boolean }>
  listGroups: () => Promise<{ data: string; success: boolean }>
  getGroupBookmarks: (
    groupName: string
  ) => Promise<{ data: Bookmark[]; success: boolean }>
  addGroupBookmark: (
    groupName: string,
    url: string
  ) => Promise<{ data: string; success: boolean }>
  deleteGroupBookmark: (
    groupName: string,
    bookmarkUrl: string
  ) => Promise<{ data: string; success: boolean }>
  updateGroupBookmark: (
    groupName: string,
    bookmarkUrl: string,
    updatedBookmark: any
  ) => Promise<{ data: string; success: boolean }>
  setSelectedTag: (tag: string) => void
  exportData: () => Promise<string>
  importData: (content: string) => Promise<{ data: string; success: boolean }>
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  showCase: true,
  bookmarks: [], // current group's bookmarks
  groups: [
    // all groups stats
    {
      name: "default",
      bookmarksCount: 0,
      tagsCount: 0,
      createdAt: ""
    }
  ],
  currentGroupName: "default",
  currentTabUrl: "",
  currentTabAdded: false,
  selectedTag: "",
  loading: false,
  firstUsedAt: "",

  setShowCase: async (value: boolean) => {
    set({ showCase: value })
    await store.set("showCase", value)
  },

  getShowCase: async () => {
    const showCase: boolean = await store.get("showCase")
    set({ showCase })
    return { data: showCase, success: true }
  },

  isCurrentTabAdded: async (tabUrl: string) => {
    const groups: StoreBookmarkGroups = await store.get("groups")
    const { tabAdded } = isTabAdded(tabUrl, groups)
    return { data: tabAdded, success: true }
  },

  getCurrentGroup: async () => {
    const currentGroupName =
      (await store.get("currentGroupName")) || get().currentGroupName
    set({ currentGroupName })
    return { data: currentGroupName, success: true }
  },

  setCurrentGroup: async (groupName) => {
    if (!groupName) {
      return { data: "Empty group name!", success: false }
    }

    set({ loading: true })
    await store.set("currentGroupName", groupName)
    const dbGroups: StoreBookmarkGroups = await store.get("groups")
    const dbGroup = dbGroups[groupName] || { bookmarks: {} }
    if (!dbGroup) {
      dbGroups[groupName] = {
        name: groupName,
        bookmarks: {},
        createdAt: new Date().toLocaleDateString()
      }
      await store.set("groups", dbGroups)
    }
    const bookmarks: Bookmark[] = Object.values(dbGroup.bookmarks || {})
    set({ currentGroupName: groupName, bookmarks, loading: false })

    return { data: "ok", success: true }
  },

  addGroup: async (groupName) => {
    const dbGroups: StoreBookmarkGroups = await store.get("groups")
    if (dbGroups[groupName]) {
      return { data: "Group already exists!", success: false }
    }

    set({ loading: true })
    const createdAt = new Date().toLocaleDateString()
    dbGroups[groupName] = {
      name: groupName,
      bookmarks: {},
      createdAt
    }
    await store.set("groups", dbGroups)

    const newGroups = [
      ...get().groups,
      {
        name: groupName,
        bookmarksCount: 0,
        tagsCount: 0,
        createdAt
      }
    ]

    set({ groups: newGroups, loading: false })

    return { data: "ok", success: true }
  },

  deleteGroup: async (groupName) => {
    set({ loading: true })
    // 删除后默认取上一个组
    const dbGroups: StoreBookmarkGroups = await store.get("groups")
    const delIndex = Object.keys(dbGroups).findIndex((key) => key === groupName)
    const newCurrentGroupName =
      Object.keys(dbGroups)[delIndex - 1 < 0 ? 1 : delIndex - 1] || "default"

    // 删除组
    delete dbGroups[groupName]
    await store.set("currentGroupName", newCurrentGroupName)
    await store.set("groups", dbGroups)

    // 更新组统计
    const newGroups = get().groups.filter((group) => group.name !== groupName)
    set({
      groups: newGroups,
      currentGroupName: newCurrentGroupName,
      loading: false
    })

    return { data: newCurrentGroupName, success: true }
  },

  renameGroup: async (oldName, newName) => {
    if (oldName == newName) {
      return { data: "ok", success: true }
    }
    try {
      set({ loading: true })
      const dbGroups: StoreBookmarkGroups = await store.get("groups")
      if (dbGroups[newName]) {
        return { data: "Group already exists!", success: false }
      }
      dbGroups[oldName].name = newName
      dbGroups[newName] = dbGroups[oldName]
      delete dbGroups[oldName]
      await store.set("groups", dbGroups)

      const newGroups = get().groups.map((group) => {
        return group.name == oldName ? { ...group, name: newName } : group
      })
      set({ groups: newGroups })

      return { data: "ok", success: true }
    } finally {
      set({ loading: false })
    }
  },

  listGroups: async () => {
    const dbGroups: StoreBookmarkGroups = await store.get("groups")
    const groups = Object.values(dbGroups).map((group) => {
      const bookmarks: Bookmark[] = Object.values(group.bookmarks || {})
      const tagsCount = bookmarks.reduce(
        (total, bookmark) => total + bookmark.tags.length,
        0
      )
      return {
        name: group.name,
        bookmarksCount: bookmarks.length,
        tagsCount: tagsCount,
        createdAt: group.createdAt
      }
    })
    set({ groups })

    return { data: "ok", success: true }
  },

  getGroupBookmarks: async (groupName) => {
    set({ loading: true })
    const dbGroups: StoreBookmarkGroups = await store.get("groups")
    const bookmarks: Bookmark[] = Object.values(
      dbGroups[groupName]?.bookmarks || {}
    )
    set({ bookmarks, loading: false })

    return { data: bookmarks, success: true }
  },

  addGroupBookmark: async (groupName, url) => {
    if (!url) {
      return { data: "Please insert a URL!", success: false }
    }
    if (!isValidUrl(url)) {
      return { data: "Please include 'https://' in the URL!", success: false }
    }

    try {
      set({ loading: true })
      // check if url is unique in group
      const dbGroups: StoreBookmarkGroups = await store.get("groups")
      const dbBookmarks = dbGroups[groupName]?.bookmarks || {}
      if (dbBookmarks[url]) {
        return { data: "Bookmark already exists!", success: false }
      }

      const { data, success }: MetaDataResponse = await getMetadata(url)
      if (!success) {
        return { data: data as string, success: false }
      }
      const metadata = data as MetaData
      const newBookmark: Bookmark = {
        title: metadata.title || metadata.domain,
        domain: metadata.domain,
        url: metadata.url,
        description: metadata.description,
        image: metadata.image,
        tags: [],
        createdAt: new Date().toLocaleString("zh-CN"),
        pinned: false,
        icon: metadata.icon
      }
      // update storage
      dbGroups[groupName].bookmarks = { ...dbBookmarks, [url]: newBookmark }
      await store.set("groups", dbGroups)

      // update current group bookmarks
      if (groupName === get().currentGroupName) {
        set({ bookmarks: [...Object.values(dbBookmarks), newBookmark] })
      }

      // update current group bookmarks count
      const newGroups = get().groups.map((group) => {
        return group.name == groupName
          ? { ...group, bookmarksCount: group.bookmarksCount + 1 }
          : group
      })
      set({ groups: newGroups })

      return { data: "Bookmark added successfully!", success: true }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong."
      return { data: errorMessage, success: false }
    } finally {
      set({ loading: false })
    }
  },

  deleteGroupBookmark: async (groupName, bookmarkUrl) => {
    try {
      set({ loading: true })
      // update db
      const dbGroups: StoreBookmarkGroups = await store.get("groups")
      const groupBookmarks = dbGroups[groupName]?.bookmarks || {}
      delete groupBookmarks[bookmarkUrl]
      dbGroups[groupName].bookmarks = groupBookmarks
      await store.set("groups", dbGroups)

      // update current group bookmarks
      if (groupName == get().currentGroupName) {
        set({ bookmarks: Object.values(groupBookmarks) })
      }

      // update current group bookmarks count
      const newGroups = get().groups.map((group) => {
        return group.name == groupName
          ? { ...group, bookmarksCount: group.bookmarksCount - 1 }
          : group
      })
      set({ groups: newGroups })
      return { data: "ok", success: true }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong."
      return { data: errorMessage, success: false }
    } finally {
      set({ loading: false })
    }
  },

  updateGroupBookmark: async (groupName, bookmarkUrl, updatedBookmark) => {
    try {
      set({ loading: true })
      // update db
      const dbGroups: StoreBookmarkGroups = await store.get("groups")
      const groupBookmarks = dbGroups[groupName]?.bookmarks || {}
      groupBookmarks[bookmarkUrl] = {
        ...groupBookmarks[bookmarkUrl],
        ...updatedBookmark
      }
      dbGroups[groupName].bookmarks = groupBookmarks
      await store.set("groups", dbGroups)

      if (get().currentGroupName == groupName) {
        set({ bookmarks: Object.values(groupBookmarks) })
      }

      return { data: "ok", success: true }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong."
      return { data: errorMessage, success: false }
    } finally {
      set({ loading: false })
    }
  },

  setSelectedTag: (tag) => set({ selectedTag: tag }),

  exportData: async () => {
    const showCase: boolean = await store.get("showCase")
    const firstUsedAt: string = await store.get("firstUsedAt")
    const currentGroupName: string = await store.get("currentGroupName")
    const groups: StoreBookmarkGroups = await store.get("groups")
    const data = {
      showCase,
      firstUsedAt,
      currentGroupName,
      groups
    }
    return JSON.stringify(data)
  },

  importData: async (content) => {
    set({ loading: true })
    try {
      const { firstUsedAt, groups = {} } = JSON.parse(content)
      const dbFirstUsedAt = await store.get("firstUsedAt")
      if (firstUsedAt && firstUsedAt < dbFirstUsedAt) {
        await store.set("firstUsedAt", firstUsedAt)
      }

      const dbGroups: StoreBookmarkGroups = await store.get("groups")
      Object.keys(groups).forEach((groupName) => {
        const dbGroup = dbGroups[groupName] || null
        const newGroup: StoreBookmarkGroup = groups[groupName]
        if (!dbGroup) {
          if (!newGroup.createdAt) {
            newGroup.createdAt = new Date().toLocaleDateString()
          }
          dbGroups[groupName] = newGroup
        } else {
          const dbBookmarks = dbGroup.bookmarks || {}
          const newBookmarks = newGroup.bookmarks || {}
          Object.keys(newBookmarks).forEach((url) => {
            if (!dbBookmarks[url]) {
              dbBookmarks[url] = newBookmarks[url]
            }
          })
        }
      })
      await store.set("groups", dbGroups)

      return { data: "Bookmarks imported successfully!", success: true }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong."
      return { data: errorMessage, success: false }
    } finally {
      set({ loading: false })
    }
  }
}))
