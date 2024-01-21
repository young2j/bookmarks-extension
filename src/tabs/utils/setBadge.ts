const setBadge = async (added: boolean) => {
  if (added) {
    await chrome.action.setBadgeText({ text: "✓" })
    await chrome.action.setBadgeTextColor({ color: "green" })
  } else {
    await chrome.action.setBadgeText({ text: "" })
  }
}

export default setBadge
