import { useEffect, type RefObject, type Touch } from "react"

const useDraggable = (
  dragRef: RefObject<HTMLElement>,
  targetRef: RefObject<HTMLElement>
) => {
  useEffect(() => {
    const drag = dragRef.current
    const target = targetRef.current
    if (!drag || !target) return null

    let offsetX = 0
    let offsetY = 0
    let isDragging = false

    const dragMousedown = (e: MouseEvent | Touch) => {
      isDragging = true
      offsetX = e.clientX - target.getBoundingClientRect().left
      offsetY = e.clientY - target.getBoundingClientRect().top
      target.style.position = "fixed"
    }

    const documentMousemove = (e: MouseEvent | Touch) => {
      if (isDragging) {
        target.style.left = e.clientX - offsetX + "px"
        target.style.top = e.clientY - offsetY + "px"
      }
    }
    const documentMouseup = () => {
      if (isDragging) {
        isDragging = false
      }
    }

    // 鼠标按下元素时启动拖动流程
    drag.addEventListener("mousedown", dragMousedown)

    // 鼠标在窗口移动时进行元素位置更新，如果正在拖动的话
    document.addEventListener("mousemove", documentMousemove)

    // 鼠标释放时结束拖动流程
    document.addEventListener("mouseup", documentMouseup)
    return () => {
      drag.removeEventListener("mousedown", dragMousedown)
      document.removeEventListener("mousemove", documentMousemove)
      document.removeEventListener("mouseup", documentMouseup)
    }
  }, [])

  return null
}

export default useDraggable
