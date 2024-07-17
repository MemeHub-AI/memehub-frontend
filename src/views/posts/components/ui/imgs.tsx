import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import React from "react"

interface ImgsProps extends ComponentProps<'div'> {
    imgs: string[];
}

const Imgs = ({ className , imgs}: ImgsProps) => {
        
    console.log(imgs);
    
    return <div className={cn(imgs.length > 1 && 'grid grid-cols-2', ' rounded-md overflow-hidden lg:w-[500px]  flex-shrink' , className)}>
        {imgs.map((image, index) => (
            <div className='shrink-0'>
                <img src={image} alt={`Image ${index + 1}`} className="w-full object-cover h-full" />
            </div>
        ))}
        
    </div>
}

export default React.memo(Imgs)