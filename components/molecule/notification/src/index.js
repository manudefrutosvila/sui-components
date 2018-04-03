import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@schibstedspain/sui-atom-button'
import IconClose from '@schibstedspain/sui-svgiconset/lib/Close'
import IconSuccess from '@schibstedspain/sui-svgiconset/lib/Linecheck'
import IconError from '@schibstedspain/sui-svgiconset/lib/Lineerror'
import IconInfo from '@schibstedspain/sui-svgiconset/lib/Lineinfo'
import IconWarning from '@schibstedspain/sui-svgiconset/lib/Linewarning'
import cx from 'classnames'

const baseClass = 'sui-MoleculeNotification'

const ICONS = {
  info: <IconInfo svgClass={`${baseClass}-icon`} />,
  error: <IconError svgClass={`${baseClass}-icon`} />,
  success: <IconSuccess svgClass={`${baseClass}-icon`} />,
  system: <IconInfo svgClass={`${baseClass}-icon`} />,
  warning: <IconWarning svgClass={`${baseClass}-icon`} />
}

const AUTO_CLOSE_TIME = {
  s: 3000,
  m: 6000,
  l: 9000,
  manual: null
}

const TRANSITION_DELAY = 1000 // ms
const TEXT_MAX_LENGTH = 110 // chars
const BUTTONS_MAX = 3 // buttons

class MoleculeNotification extends Component {
  state = {
    show: this.props.show,
    delay: false
  }

  componentWillReceiveProps (nextProps) {
    (this.state.show !== nextProps.show) && this.toggleShow()
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { show, delay } = this.state
    return (show !== nextState.show) || (delay !== nextState.delay)
  }

  componentWillUnmount () {
    clearTimeout(this.autoCloseTimout)
    clearTimeout(this.transitionTimout)
  }

  toggleShow = () => {
    const show = !this.state.show
    const { onClose, effect, autoClose } = this.props

    effect
      ? this.setState({ show, delay: true }, this.removeDelay(show))
      : this.setState({ show })

    if (show) {
      const autoCloseTime = AUTO_CLOSE_TIME[autoClose]
      autoCloseTime && this.autoClose(autoCloseTime)
    } else {
      clearTimeout(this.autoCloseTimout)
      onClose()
    }
  }

  autoClose = (time) => {
    this.autoCloseTimout = setTimeout(() => {
      const { show } = this.state
      show && this.toggleShow()
    }, time)
  }

  removeDelay = (show) => {
    const delay = show ? 1 : TRANSITION_DELAY
    this.transitionTimout = setTimeout(() => {
      this.setState({ delay: false })
    }, delay)
  }

  getText = () => {
    const { text } = this.props
    return text.substring(0, TEXT_MAX_LENGTH)
  }

  getButtons = () => {
    const { buttons } = this.props
    return buttons.slice(0, BUTTONS_MAX).map((button, i) => <Button key={i} {...button} />)
  }

  render () {
    const { show, delay } = this.state
    const { type, buttons, position, effect } = this.props
    const wrapperClassName = cx(`${baseClass} ${baseClass}--${type} ${baseClass}--${position}`, {
      [`${baseClass}-effect--${position}`]: effect,
      [`${baseClass}-effect--hide`]: (effect && delay),
    })

    if (!show && !delay) { return null }

    return (
      <div className={wrapperClassName}>
        <div className={`${baseClass}-content`}>
          <div className={`${baseClass}-iconLeft`}>
            { ICONS[type] }
          </div>
          <div className={`${baseClass}-text`}>
            <span>{this.getText()}</span>
          </div>
          <div className={`${baseClass}-close`} onClick={this.toggleShow}>
            <IconClose svgClass={`${baseClass}-icon`} />
          </div>
        </div>
        {
          buttons &&
          <div className={`${baseClass}-buttonsContainer`}>
            {this.getButtons()}
          </div>
        }
      </div>
    )
  }
}

MoleculeNotification.displayName = 'MoleculeNotification'

MoleculeNotification.propTypes = {
  /**
   * Auto close time: 's' (3s), 'm' (6s), 'l' (9s), 'manual' (disabled)
   */
  autoClose: PropTypes.string,
  /**
   * Array of props to sui-atom-buttons. Max: 3 buttons
   */
  buttons: PropTypes.array,
  /**
   * Transition enabled
   */
  effect: PropTypes.bool,
  /**
   * Positions: 'top', 'bottom', 'relative'
   */
  position: PropTypes.string,
  /**
   * Show / hide notification
   */
  show: PropTypes.bool,
  /**
   * Show / hide close button
   */
  showCloseButton: PropTypes.bool,
  /**
   * Content text. Max: 110 chars
   */
  text: PropTypes.string,
  /**
   * Notification type: 'info', 'success', 'warning', 'error', 'system'.
   */
  type: PropTypes.string,
  /**
   * On close callback
   */
  onClose: PropTypes.func
}

MoleculeNotification.defaultProps = {
  autoClose: 's',
  effect: true,
  onClose: () => {},
  position: 'relative',
  show: true,
  showCloseButton: true,
  type: 'info'
}

export default MoleculeNotification
