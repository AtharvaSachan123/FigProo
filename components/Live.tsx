import React, { useCallback, useState, useEffect } from 'react';
import LiveCursors from './cursor/LiveCursors';
import { useMyPresence, useOthers } from '@/liveblocks.config';
import CursorChat from './cursor/CursorChat';
import { CursorMode, CursorState,Reaction } from '@/types/type';
import ReactionSelector from './reaction/ReactionButton';

const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({ mode: CursorMode.Hidden });
  const [reaction, setReaction] = useState<Reaction []>([]);

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
    <div
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      className="h-[100vh] w-full flex justify-center items-center text-center"
    >
      <h1 className="text-2xl text-white">LiveBlocks Figma Clone</h1>
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
    </div>
  );
};

export default Live;
