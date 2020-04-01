import React from 'react';
import './style.scss'

const Index = (props) => {
  return (
    <span className={props.className + ' btn-oval no-select'} onClick={props.onClick}>
      {props.children}
    </span>
  )
}

export default Index