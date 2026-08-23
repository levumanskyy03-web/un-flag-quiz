'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { AVATARS, avatarLabel, type AvatarId } from '../data/avatars'
import { STRINGS, type Lang } from '../i18n/strings'
import { AvatarMark } from './AvatarMark'

const VIEW = 240
const OUT = 256

interface AvatarPickerProps {
  lang: Lang
  avatarId: AvatarId
  photo?: string
  onPick: (avatarId: AvatarId) => void
  onPhoto: (photo: string) => void
  onClose: () => void
}

export function AvatarPicker({ lang, avatarId, photo, onPick, onPhoto, onClose }: AvatarPickerProps) {
  const t = STRINGS[lang]
  const fileRef = useRef<HTMLInputElement>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        if (cropSrc) {
          setCropSrc(null)
          return
        }
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [cropSrc, onClose])

  function onFile(file: File | undefined) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setCropSrc(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      className="passport-overlay avatar-picker-overlay"
      onClick={(event) => {
        event.stopPropagation()
        onClose()
      }}
      role="presentation"
    >
      <div
        className="passport-sheet account-sheet avatar-picker-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={t.avatars}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="account-sheet-head">
          <h2>{t.avatars}</h2>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t.close}
          </button>
        </header>

        {cropSrc ? (
          <AvatarCrop
            lang={lang}
            src={cropSrc}
            onCancel={() => {
              setCropSrc(null)
              if (fileRef.current) fileRef.current.value = ''
            }}
            onDone={(next) => {
              onPhoto(next)
              setCropSrc(null)
              onClose()
            }}
          />
        ) : (
          <>
            <p className="setting-hint">{t.avatarPickerHint}</p>
            <div className="avatar-grid">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  className={`avatar-pick ${!photo && avatarId === avatar.id ? 'is-active' : ''}`}
                  aria-label={avatarLabel(avatar.id, lang)}
                  aria-pressed={!photo && avatarId === avatar.id}
                  onClick={() => {
                    onPick(avatar.id)
                    onClose()
                  }}
                >
                  <AvatarMark id={avatar.id} size={44} />
                </button>
              ))}
            </div>
            <input
              ref={fileRef}
              className="avatar-file"
              type="file"
              accept="image/*"
              onChange={(event) => onFile(event.target.files?.[0])}
            />
            <button type="button" className="btn-primary" onClick={() => fileRef.current?.click()}>
              {t.avatarUpload}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

interface AvatarCropProps {
  lang: Lang
  src: string
  onCancel: () => void
  onDone: (photo: string) => void
}

function AvatarCrop({ lang, src, onCancel, onDone }: AvatarCropProps) {
  const t = STRINGS[lang]
  const imgRef = useRef<HTMLImageElement | null>(null)
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const [ready, setReady] = useState(false)
  const [scale, setScale] = useState(1)
  const [minScale, setMinScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      imgRef.current = image
      const cover = Math.max(VIEW / image.width, VIEW / image.height) * 1.04
      setMinScale(cover)
      setScale(cover)
      setOffset({ x: 0, y: 0 })
      setReady(true)
    }
    image.src = src
  }, [src])

  function clampOffset(nextX: number, nextY: number, nextScale: number) {
    const image = imgRef.current
    if (!image) return { x: 0, y: 0 }
    const halfW = (image.width * nextScale) / 2
    const halfH = (image.height * nextScale) / 2
    const maxX = Math.max(0, halfW - VIEW / 2)
    const maxY = Math.max(0, halfH - VIEW / 2)
    return {
      x: Math.min(maxX, Math.max(-maxX, nextX)),
      y: Math.min(maxY, Math.max(-maxY, nextY)),
    }
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag) return
    setOffset(clampOffset(drag.ox + (event.clientX - drag.x), drag.oy + (event.clientY - drag.y), scale))
  }

  function onPointerUp() {
    dragRef.current = null
  }

  function changeScale(next: number) {
    const clamped = Math.min(minScale * 4, Math.max(minScale, next))
    setScale(clamped)
    setOffset((current) => clampOffset(current.x, current.y, clamped))
  }

  function confirm() {
    const image = imgRef.current
    if (!image) return
    const canvas = document.createElement('canvas')
    canvas.width = OUT
    canvas.height = OUT
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const ratio = OUT / VIEW
    ctx.fillStyle = '#d7e6f4'
    ctx.fillRect(0, 0, OUT, OUT)
    ctx.save()
    ctx.beginPath()
    ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.translate(OUT / 2 + offset.x * ratio, OUT / 2 + offset.y * ratio)
    ctx.scale(scale * ratio, scale * ratio)
    ctx.drawImage(image, -image.width / 2, -image.height / 2)
    ctx.restore()
    onDone(canvas.toDataURL('image/jpeg', 0.86))
  }

  const image = imgRef.current

  return (
    <div className="avatar-crop">
      <p className="setting-hint">{t.avatarCropHint}</p>
      <div
        className="avatar-crop-view"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {ready && image ? (
          <img
            src={src}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: image.width * scale,
              height: image.height * scale,
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
            }}
          />
        ) : null}
        <span className="avatar-crop-mask" aria-hidden="true" />
      </div>
      <label className="avatar-crop-zoom">
        <span>{t.avatarZoom}</span>
        <input
          type="range"
          min={minScale}
          max={minScale * 4}
          step={0.01}
          value={scale}
          disabled={!ready}
          onChange={(event) => changeScale(Number(event.target.value))}
        />
      </label>
      <div className="choice-grid">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          {t.back}
        </button>
        <button type="button" className="btn-primary" onClick={confirm} disabled={!ready}>
          {t.avatarCropApply}
        </button>
      </div>
    </div>
  )
}
