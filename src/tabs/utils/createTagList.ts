const createTagList = (bookmarks: Bookmark[]) => {
  const tags = bookmarks.reduce((total, current) => {
    current.tags.forEach((tag) => {
      const index = total.findIndex((x) => x.name === tag)
      if (index !== -1) total[index].count++
      else total.push({ name: tag, count: 1 })
    })
    return total
  }, [])
  return tags.sort((a, b) => b.count - a.count)
}

export default createTagList
