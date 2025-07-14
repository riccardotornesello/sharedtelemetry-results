"use client"

import { deleteCacheByPrefix } from "@/lib/redis"
import { UIFieldClientComponent } from "payload"

const CacheClearButton: UIFieldClientComponent = (props) => {
  const handleClick = async () => {
    await deleteCacheByPrefix("competitionRanking:")
    window.location.reload()
  }

  return <button onClick={handleClick}>Clear Cache</button>
}

export default CacheClearButton
