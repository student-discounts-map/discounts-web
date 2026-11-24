'use client'

import { ImagePlus, Upload, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type DragEvent } from 'react'
import { cn } from '@/lib/utils'

export type PhotoItem = { id: string; file: File; url: string }

const MAX_PHOTOS = 5
const MAX_SIZE_MB = 5
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

type PhotoDropzoneProps = {
  photos: PhotoItem[]
  onChange: (photos: PhotoItem[]) => void
  error?: string
}

export function PhotoDropzone({ photos, onChange, error }: PhotoDropzoneProps) {
  const inputId = useId()
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const photosRef = useRef(photos)
  photosRef.current = photos
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)), [])

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const files = Array.from(fileList)
    const valid = files.filter((file) => ACCEPTED_TYPES.includes(file.type) && file.size <= MAX_SIZE_MB * 1024 * 1024)
    const room = MAX_PHOTOS - photos.length
    const accepted = valid.slice(0, room)

    if (valid.length < files.length) setLocalError(`Подходят JPG, PNG или WebP до ${MAX_SIZE_MB} МБ`)
    else if (valid.length > room) setLocalError(`Можно загрузить не больше ${MAX_PHOTOS} фото`)
    else setLocalError(null)

    if (accepted.length === 0) return
    onChange([
      ...photos,
      ...accepted.map((file) => ({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file) })),
    ])
  }

  const removePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id)
    if (photo) URL.revokeObjectURL(photo.url)
    onChange(photos.filter((p) => p.id !== id))
    setLocalError(null)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  const message = localError ?? error
  const full = photos.length >= MAX_PHOTOS

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault()
          if (!full) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition',
          'focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15',
          dragging
            ? 'border-primary bg-primary/5'
            : message
              ? 'border-destructive/40 bg-destructive/[0.03]'
              : 'border-foreground/15 bg-foreground/[0.02] hover:border-primary/50 hover:bg-primary/[0.03]',
          full && 'pointer-events-none opacity-50',
        )}
      >
        <span
          className={cn(
            'flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition',
            dragging ? 'scale-110' : 'group-hover:scale-105',
          )}
          aria-hidden="true"
        >
          {dragging ? <Upload className="size-6" /> : <ImagePlus className="size-6" />}
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-base font-semibold text-foreground">
            {dragging ? 'Отпустите, чтобы загрузить' : 'Перетащите фото сюда'}
          </span>
          <span id={hintId} className="text-sm text-muted-foreground">
            или <span className="font-semibold text-primary underline-offset-2 group-hover:underline">выберите файлы</span>
            {' · '}JPG, PNG, WebP до {MAX_SIZE_MB} МБ, не больше {MAX_PHOTOS} шт.
          </span>
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          disabled={full}
          aria-describedby={message ? `${hintId} ${errorId}` : hintId}
          aria-invalid={Boolean(message)}
          onChange={(event) => {
            addFiles(event.target.files)
            event.target.value = ''
          }}
          className="sr-only"
        />
      </label>

      {message && (
        <p id={errorId} className="text-sm font-medium text-destructive" role="alert">
          {message}
        </p>
      )}

      {photos.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5" aria-label="Загруженные фото">
          {photos.map((photo, index) => (
            <li key={photo.id} className="relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, next/image can't optimize it */}
              <img src={photo.url || '/placeholder.svg'} alt={`Фото ${index + 1}: ${photo.file.name}`} className="size-full object-cover" />
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                  Обложка
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label={`Удалить фото ${index + 1}`}
                className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:bg-white hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
