"use client"

interface MailboxProps {
  onClick: () => void
}

export function Mailbox({ onClick }: MailboxProps) {
  return (
    <div
      className="mailbox fixed bottom-[45px] right-[5vw] z-20 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label="Open letter from Santa"
    >
      <div className="basis" />
      <div className="box">
        <div className="letters">
          <div className="letter letter-second">
            <img
              className="letter-image"
              src="https://img.freepik.com/premium-vector/christmas-mail-postcard-hand-drawn-illustration_514781-2114.jpg"
              alt="Christmas letter"
            />
          </div>
          <div className="letter letter-first">
            <img
              className="letter-image"
              src="https://www.shutterstock.com/image-vector/christmas-new-year-postcard-wish-260nw-761840683.jpg"
              alt="Holiday postcard"
            />
          </div>
        </div>
        <div className="box-title">
          <div className="font-sans-serif">letters from</div>
          <div className="font-script text-2xl">Santa</div>
          <div className="font-sans-serif">for</div>
          <div className="font-script text-2xl">you</div>
        </div>
      </div>
    </div>
  )
}
