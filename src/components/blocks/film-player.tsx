"use client"

import { useEffect, useRef } from "react"

/**
 * The presentation film, opened in a real dialog.
 *
 * Rendered only when a film exists. Playback is paused and the video reset on
 * close, so reopening never resumes halfway through, and Escape closes it —
 * `<dialog>` gives that, plus focus trapping, without a library.
 */
export function FilmPlayer({
  src,
  label,
  closeLabel,
}: {
  src: string
  label: string
  closeLabel: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    function onClose() {
      const video = videoRef.current
      if (!video) return
      video.pause()
      video.currentTime = 0
    }
    dialog.addEventListener("close", onClose)
    return () => dialog.removeEventListener("close", onClose)
  }, [])

  return (
    <>
      <button
        type="button"
        className="showcase-film-body"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span className="showcase-film-play" aria-hidden="true" />
        <span className="showcase-film-label">{label}</span>
      </button>

      <dialog ref={dialogRef} className="film-dialog" aria-label={label}>
        <video ref={videoRef} src={src} controls playsInline className="film-dialog-video" />
        <form method="dialog">
          <button type="submit" className="film-dialog-close">
            {closeLabel}
          </button>
        </form>
      </dialog>
    </>
  )
}
