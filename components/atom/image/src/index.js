import {cloneElement, useCallback, useEffect, useRef, useState} from 'react'

import cx from 'classnames'
import PropTypes from 'prop-types'

import ErrorImage from './ErrorImage.js'
import {
  BASE_CLASS,
  BASE_CLASS_FIGURE,
  CLASS_ERROR,
  CLASS_IMAGE,
  CLASS_PLACEHOLDER,
  CLASS_SKELETON,
  CLASS_SPINNER
} from './settings.js'
import {htmlImgProps} from './types.js'

const AtomImage = ({
  placeholder,
  skeleton,
  bgStyles,
  spinner: Spinner,
  errorIcon,
  errorText,
  onError,
  onLoad,
  sources = [],
  alt,
  ...imgProps
}) => {
  const imageRef = useRef()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const {src} = imgProps

  useEffect(() => {
    setLoading(true)
    setError(false)
  }, [src, setLoading, setError])

  const handleLoad = useCallback(() => {
    const loadCompleted = imageRef?.current?.complete
    if (loadCompleted === true) {
      setLoading(!loadCompleted)
      onLoad && onLoad()
    }
  }, [onLoad, setLoading])

  useEffect(() => {
    handleLoad()
  }, [handleLoad, imageRef])

  const classNames = cx(
    BASE_CLASS,
    `is-${loading ? 'loading' : 'loaded'}`,
    error && `is-error`
  )

  const classNamesFigure = cx(
    BASE_CLASS_FIGURE,
    placeholder && CLASS_PLACEHOLDER,
    skeleton && CLASS_SKELETON
  )

  const handleError = () => {
    setLoading(false)
    setError(true)
    onError && onError()
  }

  const figureStyles = {
    backgroundImage: `url(${placeholder || skeleton})`
  }

  const SpinnerExtended =
    Spinner &&
    cloneElement(Spinner, {
      className: CLASS_SPINNER
    })

  return (
    <div className={classNames}>
      <figure
        className={classNamesFigure}
        style={!error && (placeholder || skeleton) ? figureStyles : {}}
      >
        <picture>
          {sources.map((source, idx) => (
            <source key={idx} {...source} />
          ))}
          <img
            className={CLASS_IMAGE}
            onLoad={handleLoad}
            onError={handleError}
            ref={imageRef}
            alt={alt}
            {...imgProps}
          />
        </picture>
      </figure>
      {!error && loading && SpinnerExtended}
      {error && (
        <ErrorImage className={CLASS_ERROR} icon={errorIcon} text={errorText} />
      )}
    </div>
  )
}

AtomImage.displayName = 'AtomImage'
AtomImage.propTypes = {
  /** Image url or base64 */
  src: PropTypes.string.isRequired,

  /** Description of the image */
  alt: PropTypes.string.isRequired,

  /** Image displayed (blurred) while the final image is being loaded */
  placeholder: PropTypes.string,

  /** Image (wireframe, skeleton) displayed (not blurred) while the final image is being loaded */
  skeleton: PropTypes.string,

  /** Spinner (component) displayed while the final image is being loaded */
  spinner: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

  /** Icon (component) to be displayed in an Error Box when the image cannot be loaded */
  errorIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

  /** Text to be displayed in an Error Box when the image cannot be loaded */
  errorText: PropTypes.string,

  /** Function to be called when the image cannot be loaded  */
  onError: PropTypes.func,

  /** Function to be called when the image completed its loading  */
  onLoad: PropTypes.func,

  /**
   * Source tags inside picture element,
   * array of props defined in https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source expected
   */
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      srcSet: PropTypes.string,
      media: PropTypes.string
    })
  ),

  /** <img> props */
  ...htmlImgProps
}

export default AtomImage
