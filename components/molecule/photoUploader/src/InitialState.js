import React from 'react'
import PropTypes from 'prop-types'

import Button from '@s-ui/react-atom-button'
import AtomIcon, {ATOM_ICON_SIZES} from '@s-ui/react-atom-icon'

import {BASE_CLASS_NAME} from './config'
const ALTERNATIVE_ACTION_TEXT = '- o -'
const BUTTON_COLOR = 'primary'
const BUTTON_SIZE = 'small'

const InitialState = ({
  buttonText,
  buttonSize = BUTTON_SIZE,
  icon,
  text,
  dividerText = ALTERNATIVE_ACTION_TEXT
}) => {
  return (
    <div className={`${BASE_CLASS_NAME}-initialState`}>
      <div className={`${BASE_CLASS_NAME}-iconInitialState`}>
        <AtomIcon size={ATOM_ICON_SIZES.extraLarge}>{icon}</AtomIcon>
      </div>
      <div className={`${BASE_CLASS_NAME}-textState`}>
        <span className={`${BASE_CLASS_NAME}-textStateText`}>{text}</span>
        <span className={`${BASE_CLASS_NAME}-textStateDivider`}>
          {dividerText}
        </span>
      </div>
      <div className={`${BASE_CLASS_NAME}-buttonState`}>
        <Button color={BUTTON_COLOR} size={buttonSize}>
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

InitialState.displayName = 'InitialState'

InitialState.propTypes = {
  buttonText: PropTypes.string.isRequired,
  buttonSize: PropTypes.string,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  dividerText: PropTypes.string
}

export default InitialState
