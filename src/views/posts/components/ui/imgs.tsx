import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import React from "react"
import { LetterCaseUppercaseIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from 'react';

interface ImgsProps extends ComponentProps<'div'> {
    imgs: string[];
}

const Imgs = ({ className , imgs}: ImgsProps) => {
// const useMinHeight = (imgs:string[]) => {
//   const [minHeight, setMinHeight] = useState(0);

//     let minH:number;
//     const imageObjects = imgs.map((src) => {
//       const img = new Image();
//       img.src = src;
//       return img;
//     });

//     const onLoad = (img:HTMLImageElement) => {
//         console.log(img.height);
        
//       if (!minH || img.height < minH) {
//         minH = img.height;
//       }
//     };

//     imageObjects.forEach((img) => {
//       if (img.complete) {
//         onLoad(img);
//       } else {
//         img.onload = () => onLoad(img);
//       }
//     });
    
    return <div className={cn(imgs.length > 1 && 'grid grid-cols-2', ' rounded-2xl overflow-hidden lg:w-[500px] gap-1 h-[300px]' , className)}>
        {imgs.map((image, index) => (
            // <div className='shrink-0'>
                <img src={image} alt={`Image ${index + 1}`} className={cn("w-full object-cover h-[150px]" , )}/>
            // </div>
        ))}
    </div>
}

export default React.memo(Imgs)
