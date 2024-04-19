import CursorSVG from '@/public/assets/CursorSVG'
import { CursorChatProps, CursorMode } from '@/types/type'
import React from 'react'

const CursorChat = ({cursor,cursorState,setCursorState,updateMyPresence}:CursorChatProps) => {
  return (
    <div className='absolute top-0 left-0'
    style={{transform:`translateX(${cursor.x}px) translateY(${cursor.y}px)`}}>
        
        {/* {cursorState.mode=== CursorMode.Chat && ( )} */}
            <>
            <CursorSVG color='#000'/>
            <div className='absolute left-2 top-5 bg-blue-500 py-2 px-4 text-sm leading-relaxed text-white rounded-[20px]'>
                {cursorState.previousMessage && <div>{cursorState.previousMessage}</div>}
                <input/>

            </div>
            </>
       
        
        
        </div>
  )
}

export default CursorChat