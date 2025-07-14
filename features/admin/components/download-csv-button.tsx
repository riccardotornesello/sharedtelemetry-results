"use client"

import { UIFieldClientComponent } from "payload"
import { useDocumentInfo } from "@payloadcms/ui"
import { DOMAttributes } from "react"

const DownloadCsvButton: UIFieldClientComponent = (props) => {
  const data = useDocumentInfo()
  const slug = data?.savedDocumentData?.slug

  if (!slug) {
    return null
  }

  const handleClick: DOMAttributes<HTMLButtonElement>["onClick"] = async (
    e
  ) => {
    e.preventDefault()

    fetch(`/api/${slug}/csv`, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `risultati-${slug}.csv`)

        // Append to html link element page
        document.body.appendChild(link)

        // Start download
        link.click()

        // Clean up and remove the link
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      })
  }

  return <button onClick={handleClick}>Download CSV</button>
}

export default DownloadCsvButton
