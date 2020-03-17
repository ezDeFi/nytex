import React from 'react';
import './style.scss'

const Index = (props) => {
  return (
    <span className={props.className + ' btn-oval no-select'}>
      {props.children}
    </span>
  )
}

export default Index