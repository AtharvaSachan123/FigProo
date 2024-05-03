"use client"; // Not a standard JavaScript or TypeScript directive
import { fabric } from "fabric";
import Live from "@/components/Live";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { use, useEffect, useRef,useState } from "react";
import Navbar from "@/components/Navbar";
import { handleCanvasMouseDown, handleResize, initializeFabric } from "@/lib/canvas";
import { ActiveElement } from "@/types/type";
export default function Page() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing =useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>("rectangle");

  const [activeElement,setActiveElement] = useState<ActiveElement>({
    name:"",
    value:"",
    icon:"",
  })

  


  const handleActiveElementChange = (elem:ActiveElement) =>{
    setActiveElement(elem);
    selectedShapeRef.current = elem?.value as string;
  }

  useEffect(()=>{
const canvas = initializeFabric({canvasRef,fabricRef});

    canvas.on("mouse:down",(options)=>{
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      })
    })

    window.addEventListener("resize",()=>{
      handleResize({
        canvas:canvasRef.current,
      })
    })



  },[]);


  return (
    <main className="h-screen overflow-hidden">
      
      <Navbar 
      activeElement={activeElement}
      handleActiveElement={handleActiveElementChange}/>
      
      
      <section className="flex h-full flex-row">
        <LeftSidebar />
        <Live canvasRef={canvasRef}/>
        <RightSidebar />
      </section>
    </main>
  );
}
