import React from 'react'

type Props = {
    color:string;
    x:number;
    y:number;
    message:string;
}

const CursorChat = ({color,x,y,message}:Props) => {
  return (
    <div className='pointer-events-none absolute left-0 top-0'
    style={{transform:`translateX(${x}px) translatY(${y}px)`}}>


    </div>
  )
}

export default CursorChat