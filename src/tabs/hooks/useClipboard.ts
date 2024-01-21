import { useEffect, useState } from "react"

const useClipboard = (): {
  copiedText: string
  copy: (text: string) => void
  copied: boolean
} => {
  const [copied, setCopied] = useState(false)
  const [copiedText, setCopiedText] = useState("")

  const copy = (text: string) => {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setCopiedText(text)
  }

  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeoutId)
    }
  }, [copied])

  return { copiedText, copy, copied }
}

export default useClipboard
