import { store } from "~tabs/stores/BookmarkStore"
import isTabAdded from "~tabs/utils/isTabAdded"
import setBadge from "~tabs/utils/setBadge"

const initInstalled = async ({ reason }) => {
  if (reason === "install") {
    const firstDate = new Date().toLocaleDateString()
    const data = {
      showCase: true,
      firstUsedAt: firstDate,
      currentGroupName: "default",
      groups: {
        default: {
          name: "default",
          bookmarks: [],
          createdAt: firstDate
        }
      }
    }

    for (let item of Object.entries(data)) {
      await store.set(item[0], item[1])
    }

    chrome.tabs.create({ url: "/tabs/home.html" })
  }
}
chrome.runtime.onInstalled.addListener(initInstalled)

const onTabActive = async (activeTab: chrome.tabs.TabActiveInfo) => {
  const tab = await chrome.tabs.get(activeTab.tabId)
  await store.set("currentTabUrl", tab.url)
  const groups: StoreBookmarkGroups = await store.get("groups")
  const { tabAdded, tabAtGroup } = isTabAdded(tab.url, groups)
  await setBadge(tabAdded)
  await store.set("currentTabAtGroup", tabAtGroup)
  if (tabAtGroup) {
    await store.set("currentGroupName", tabAtGroup)
  }
}

chrome.tabs.onActivated.addListener(onTabActive)
