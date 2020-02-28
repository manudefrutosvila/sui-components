import {formatToBase64} from './photoTools'

import {
  DEFAULT_HAS_ERRORS_STATUS,
  DEFAULT_IMAGE_ROTATION_DEGREES
} from './config'

export const filterValidFiles = ({
  files,
  filesToBeFiltered,
  acceptedFileMaxSize,
  setMaxSizeError,
  setMaxPhotosError,
  allowUploadDuplicatedPhotos,
  maxPhotos
}) => {
  const notExcedingMaxSizeFilesFilter = filesToFilter =>
    filesToFilter.filter(fileToFilter => {
      if (fileToFilter.size >= acceptedFileMaxSize) {
        setMaxSizeError()
        return false
      }
      return true
    })

  const notRepeatedFilesFilter = filesToFilter =>
    filesToFilter.filter(fileToFilter => {
      const {
        path: newFilePath,
        size: newFileSize,
        lastModified: newFileLastModified
      } = fileToFilter
      return !files.some(file => {
        const {path, size, lastModified} = file.properties
        return (
          path === newFilePath &&
          size === newFileSize &&
          lastModified === newFileLastModified
        )
      })
    })

  const notExcedingMaxSizeFiles = notExcedingMaxSizeFilesFilter(
    filesToBeFiltered
  )

  let notRepeatedFiles
  if (allowUploadDuplicatedPhotos) {
    notRepeatedFiles = notExcedingMaxSizeFiles
  } else {
    notRepeatedFiles = notRepeatedFilesFilter(notExcedingMaxSizeFiles)
  }

  if (!notRepeatedFiles.length) return notRepeatedFiles

  if (files.length + notRepeatedFiles.length >= maxPhotos) {
    setMaxPhotosError()
    const howManyFilesToMax = maxPhotos - files.length
    notRepeatedFiles.splice(
      howManyFilesToMax - 1,
      notRepeatedFiles.length - howManyFilesToMax
    )
  }
  return notRepeatedFiles
}

export const prepareFiles = ({
  currentFiles,
  newFiles,
  defaultFormatToBase64Options,
  errorCorruptedPhotoUploadedText,
  setCorruptedFileError,
  setFiles,
  setIsLoading,
  _scrollToBottom,
  _callbackPhotosUploaded
}) => {
  newFiles.reduce((accumulatorPromise, nextFile, index) => {
    return accumulatorPromise
      .then(() =>
        formatToBase64({
          file: nextFile,
          options: defaultFormatToBase64Options
        })
      )
      .then(
        ({
          blob,
          originalBase64,
          croppedBase64,
          rotation,
          hasErrors = DEFAULT_HAS_ERRORS_STATUS
        }) => {
          if (hasErrors) {
            const errorText = errorCorruptedPhotoUploadedText.replace(
              '%{filepath}',
              nextFile.path
            )
            setCorruptedFileError(errorText)
          } else {
            currentFiles.push({
              properties: {
                path: nextFile.path,
                size: nextFile.size,
                lastModified: nextFile.lastModified
              },
              blob,
              originalBase64,
              preview: croppedBase64,
              rotation,
              isNew: true,
              isModified: false,
              hasErrors
            })
          }
        }
      )
      .then(() => {
        setFiles([...currentFiles])
        if (index >= newFiles.length - 1) {
          setIsLoading(false)
          _scrollToBottom()
          _callbackPhotosUploaded(currentFiles)
        }
      })
  }, Promise.resolve())
}

export const loadInitialPhotos = ({
  initialPhotos,
  defaultFormatToBase64Options,
  setInitialDownloadError,
  setFiles,
  _callbackPhotosUploaded,
  setIsLoading
}) => {
  const filesWithBase64 = initialPhotos.map(url =>
    formatToBase64({url, options: defaultFormatToBase64Options})
  )

  Promise.all(filesWithBase64).then(newFiles => {
    const readyPhotos = newFiles.map(
      ({blob, croppedBase64, url, hasErrors = DEFAULT_HAS_ERRORS_STATUS}) => ({
        blob,
        url,
        hasErrors,
        originalBase64: croppedBase64,
        preview: croppedBase64,
        rotation: DEFAULT_IMAGE_ROTATION_DEGREES,
        isNew: false,
        isModified: false
      })
    )
    if (readyPhotos.some(photos => photos.hasErrors)) {
      setInitialDownloadError()
    }
    setFiles([...readyPhotos])
    _callbackPhotosUploaded(readyPhotos)
    setIsLoading(false)
  })
}
