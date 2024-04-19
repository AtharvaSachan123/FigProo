import React, { useCallback ,useState} from 'react'
import LiveCursors from './cursor/LiveCursors'
import {  useMyPresence, useOthers } from '@/liveblocks.config'
import CursorChat from './cursor/CursorChat';
import { CursorMode } from '@/types/type';


const Live = () => {
const others=useOthers();
const [{cursor}, updateMyPresence]=useMyPresence() as any;
const [cursorState, setcursorState] = useState({mode:CursorMode.Hidden})

// Cursor Movement function

const handlePointerMove =useCallback((e:React.PointerEvent)=>{
    e.preventDefault();

    const x=e.clientX -e.currentTarget.getBoundingClientRect().x;
    const y=e.clientY- e.currentTarget.getBoundingClientRect().y;

    updateMyPresence({cursor:{x,y}});
},[])

const handlePointerLeave =useCallback((e:React.PointerEvent)=>{
    setcursorState({mode:CursorMode.Hidden})

    const x=e.clientX -e.currentTarget.getBoundingClientRect().x;
    const y=e.clientY- e.currentTarget.getBoundingClientRect().y;

    updateMyPresence({cursor:null,message:null});
},[])

const handlePointerDown =useCallback((e:React.PointerEvent)=>{
    

    const x=e.clientX -e.currentTarget.getBoundingClientRect().x;
    const y=e.clientY- e.currentTarget.getBoundingClientRect().y;

    updateMyPresence({cursor:{x,y}});
},[])

  return (

    <div
    onPointerMove={handlePointerMove}
    onPointerDown={handlePointerDown}
    onPointerLeave={handlePointerLeave}
    className="h-[100vh] w-full flex justify-center items-center text-center"
    >
        <h1 className="text-2xl text-white"> LiveBlocks Figma Clone</h1>
        {cursor && (
        <CursorChat
        cursor={cursor}
        cursorState={cursorState}
        setcursorState={setcursorState}
        updateMyPresence={updateMyPresence}
        
        />
    )}

        <LiveCursors others={others}/>

    </div>
    
  )
}

export default Live