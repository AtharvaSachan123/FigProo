"use client"; // Not a standard JavaScript or TypeScript directive
import { fabric } from "fabric";
import Live from "@/components/Live";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import {useEffect, useRef,useState } from "react";
import Navbar from "@/components/Navbar";
import { handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasSelectionCreated, handleCanvaseMouseMove, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { ActiveElement, Attributes} from "@/types/type";
import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { defaultNavElement } from "@/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";

export default function Page() {


  const undo=useUndo();
  const redo=useRedo();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing =useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const isEditingRef=useRef(false);

  const [activeElement,setActiveElement] = useState<ActiveElement>({
    name:"",
    value:"",
    icon:"",
  })
  const [elementAttributes,setElementAttributes] = useState<Attributes>({
    width:"",
    height:"",
    fontFamily:"",
    fontSize:"",
    fontWeight:"",
    fill:"#aabbcc",
    stroke:"#aabbcc",
  
  })




  const canvasObjects=useStorage((root) => root.canvasObjects);

  const syncShapeInStorage =useMutation(({storage},object)=>{
    if(!object){
      return;
    }
    const {objectId}=object;
    const shapeData =object.toJSON();
    shapeData.objectId=objectId;


    const canvasObjects  = storage.get("canvasObjects");
    canvasObjects.set(objectId,shapeData);
  },[])

  const deleteAllShapes= useMutation(({storage})=>{
    const canvasObjects = storage.get("canvasObjects");

    if(!canvasObjects||canvasObjects.size===0){
      return true;
    }
    for(const [key,value] of canvasObjects.entries()){
      canvasObjects.delete(key);
    }

    return canvasObjects.size===0;
  },[])

  const deleteShapesFromStorage = useMutation(({storage},shapeId)=>{
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(shapeId);

  },[])


  const handleActiveElementChange = (elem:ActiveElement) =>{
    setActiveElement(elem);
    switch(elem?.value){
      case "reset":
        deleteAllShapes();
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement)
        break;
       case "delete":
        handleDelete(fabricRef.current as any, deleteShapesFromStorage);
        setActiveElement(defaultNavElement);
        break;
       case "image":
        imageInputRef.current?.click();
        isDrawing.current=false;
        if(fabricRef.current){
          fabricRef.current.isDrawingMode=false; 
        } 
        break;
        default:
          break;
    }



    selectedShapeRef.current = elem?.value as string;
  }

  useEffect(()=>{
const canvas = initializeFabric({canvasRef,fabricRef});

    canvas.on("mouse:down",(options:any)=>{
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      })
    })


    canvas.on("mouse:move",(options:any)=>{
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage
      })
    })

    canvas.on("mouse:up",()=>{
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef
      })
    })

    canvas.on("object:modified",(options:any)=>{
      handleCanvasObjectModified({
      options,
      syncShapeInStorage,
      
      })
    })
    canvas.on("object:created",(options:any)=>{
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      })
    })


    window.addEventListener("resize",()=>{
      handleResize({
        canvas:canvasRef.current,
      })
    })

    return ()=>{
      canvas.dispose();
    }

  },[]);

  // window.addEventListener("keydown",(e)=>{
  //   handleKeyDown({
  //     e,
  //     canvas:fabricRef.current,
  //     undo,
  //     redo,
  //     syncShapeInStorage,
  //     deleteShapeFromStorage,
  //   })
  // })



  useEffect(()=>{
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,

    })
  },[canvasObjects])


  return (
    <main className="h-screen overflow-hidden">
      
      <Navbar 
      activeElement={activeElement}
      handleActiveElement={handleActiveElementChange}
      imageInputRef={imageInputRef}
      handleImageUpload={(e:any)=>{
        e.stopPropagation();
        handleImageUpload({
          file:e.target.files[0],
          canvas:fabricRef as any,
          shapeRef,
          syncShapeInStorage,
        })
      }}/>
      
      
      <section className="flex h-full flex-row">
        <LeftSidebar allShapes={Array.from(canvasObjects)} />
        <Live canvasRef={canvasRef}/>
        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef} // Add the missing property activeObjectRef
          syncShapeInStorage={syncShapeInStorage} // Add the missing property syncShapeInStorage
        />
      </section>
    </main>
  );
}
