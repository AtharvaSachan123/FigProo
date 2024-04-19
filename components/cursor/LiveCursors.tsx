import { LiveCursorProps } from '@/types/type'
import React from 'react'
import Cursor from './Cursor';
import { COLORS } from '@/constants';

const LiveCursors = ({others}:LiveCursorProps) => {
  return others.map(({connnectionId,presence})=>{
    if(presence==null || !presence?.cursor){
        return null;
    }
return (
    <Cursor 
    key={connnectionId}
    color={COLORS[Number(connnectionId)%COLORS.length]}
    x={presence.cursor.x}
    y={presence.cursor.y}  
    message={presence.message} 
    />
)

  })
}

export default LiveCursors