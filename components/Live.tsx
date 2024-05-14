import React, { useCallback, useState, useEffect } from 'react';
import LiveCursors from './cursor/LiveCursors';
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@/liveblocks.config';
import CursorChat from './cursor/CursorChat';
import { CursorMode, CursorState,Reaction, ReactionEvent } from '@/types/type';
import ReactionSelector from './reaction/ReactionButton';
import FlyingReaction from './reaction/FlyingReaction';
import useInterval from '@/hooks/useInterval';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { shortcuts } from '@/constants';


type Props = {
canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;

}
const Live = ({canvasRef}:Props) => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({ mode: CursorMode.Hidden });
  const [reaction, setReaction] = useState<Reaction []>([]);
  const broadcast = useBroadcastEvent();

  useInterval(()=>{
        setReaction((reactions)=> reactions.filter((reaction)=> reaction.timestamp  > Date.now()-4000))
  },1000)

  useInterval(()=>{
    if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor != null){
      setReaction((reactions)=>
      reactions.concat([
        {
          point:{x:cursor.x,y:cursor.y},
          value:cursorState.reaction,
          timestamp:Date.now(),

        }
      ]))

      broadcast({
        x:cursor.x,
        y:cursor.y,
        value:cursorState.reaction,
      })


    }
  },100)

    useEventListener((eventData)=>{
      const event =eventData.event as ReactionEvent;
      setReaction((reactions)=>
        reactions.concat([
          {
            point:{x:event.x,y:event.y},
            value:event.value,
            timestamp:Date.now(),
  
          }
        ]))
    })



  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault(); // Prevent '/' character from being typed in input fields
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: ''
        });
      } else if (e.key === 'Escape') {
        updateMyPresence({ message: '' });
        setCursorState({ mode: CursorMode.Hidden });
      }else if(e.key=== "e"){
        setCursorState({mode: CursorMode.ReactionSelector});
      }
    };

    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault();

    if(cursor == null || cursorState.mode != CursorMode.ReactionSelector){

      const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
    const y = e.clientY - e.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x, y } });
    }

    
  }, []);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    setCursorState({ mode: CursorMode.Hidden });
    updateMyPresence({ cursor: null, message: null });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
    const y = e.clientY - e.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x, y } });
setCursorState((state:CursorState)=>
  cursorState.mode === CursorMode.Reaction? {...state,isPressed:true}:state
)

  }, [cursorState.mode,setCursorState]);


const handlePointerUp = useCallback(()=>{
  setCursorState((state:CursorState)=>
  cursorState.mode === CursorMode.Reaction? {...state,isPressed:false}:state
)
},[cursorState.mode,setCursorState]);

const setReactions = useCallback((reaction:string)=>{
  setCursorState({mode:CursorMode.Reaction,reaction,isPressed:false});
  

},[])





  return (
   <ContextMenu>
     <ContextMenuTrigger
      id='canvas'
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      className="h-[100vh] w-full flex justify-center items-center text-center"
    >
      <canvas ref={canvasRef }/>


      {reaction.map((reaction)=>(

        <FlyingReaction
        key={reaction.timestamp.toString()}
        x={reaction.point.x}
        y={reaction.point.y}
        timestamp={reaction.timestamp}
        value={reaction.value}
        
        />
      ))}




      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
        setReaction={setReactions}
        />
        
        )}

      <LiveCursors others={others} />
    </ContextMenuTrigger>
        <ContextMenuContent className='right-menu-content'>
          {shortcuts.map((item)=>(
            <ContextMenuItem key={item.key} className='right-menu-content'>
              <p>{item.name}</p>
              <p className='text-xs text-primary-grey-300'> {item.shortcut}</p>
            </ContextMenuItem>
          ))}
        </ContextMenuContent>


   </ContextMenu>
  );
};

export default Live;
