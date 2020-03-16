import React from 'react';
import './style.scss'

const Index = (props) => {
  return (
    <span className='btn-oval'>
      {props.children}
    </span>
  )
}

export default Index