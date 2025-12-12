"use client"

import { useState } from "react"
import { useSnowflakes } from "./use-snowflakes"
import { useFireworks } from "./use-fireworks"
import { FloatingDecorations } from "./floating-decorations"
import { Mailbox } from "./mailbox"
import { SantaMailModal } from "./santa-mail-modal"
import { GREETINGS, SIGNS } from "./constants"

export function NewYearScene() {
  const [showMail, setShowMail] = useState(false)
  const [mailContent, setMailContent] = useState({ text: "", sign: "" })
  const winterWrapperRef = useSnowflakes()

  useFireworks()

  const handleOpenMail = () => {
    setMailContent({
      text: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
      sign: SIGNS[Math.floor(Math.random() * SIGNS.length)],
    })
    setShowMail(true)
  }

  return (
    <>
      <div className="winter-wrapper pointer-events-none" ref={winterWrapperRef} />
      <FloatingDecorations />
      <div className="ground fixed bottom-0 left-0 right-0 z-10 pointer-events-none" />
      <Mailbox onClick={handleOpenMail} />
      {showMail && (
        <SantaMailModal
          text={mailContent.text}
          sign={mailContent.sign}
          onClose={() => setShowMail(false)}
        />
      )}
    </>
  )
}
