import Image from "next/image";
import Hero from "@/components/Hero";
import SplineComponent from "@/components/SplineComponent";
import RecentProjects from "@/components/RecentProjects";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import ImageScrollReveal from "@/components/ImageScrollReveal"
import Circular3DGallery from "@/components/Circular3DGallery";
import SplineComponentGPad from "@/components/ui/SplineComponentGPad";
import SplineComponentGPadMobile from "@/components/SplineComponentGPadMobile";

export default function Home() {
  return (
    <main className="relative bg-black flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      
      <div className="w-[100vw] h-full">
        <SplineComponent />
      </div>

      <div>
        <RecentProjects />
      </div>

      <div> 
        <ImageScrollReveal/>
      </div>

      <div className="hidden sm:block">
        <SplineComponentGPad />
      </div>

      <br>
      </br>

      <span>
        
      </span>

      <div className="justify-center block lg:hidden">
        <SplineComponentGPadMobile />
      </div>

      <div>
        <Circular3DGallery className="w-[100vw] h-[100vh] flex justify-center items-center" />
      </div>

    </main>
  );
}
