import Image from "next/image";
import Hero from "@/components/Hero";
import SplineComponent from "@/components/SplineComponent";
import RecentProjects from "@/components/RecentProjects";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import ImageScrollReveal from "@/components/ImageScrollReveal"
import Circular3DGallery from "@/components/Circular3DGallery";
import SplineComponentGPad from "@/components/ui/SplineComponentGPad";

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      
      <div className="w-[100vw] h-full">
        <SplineComponent />
      </div>

      <div>
        <RecentProjects />
      </div>

      <div> 
        <ImageScrollReveal/>
      </div>

      <div className="w-[100vw] h-full">
        <SplineComponentGPad />
      </div>

      <div>
        <Circular3DGallery />
      </div>

      <div>
        <TextHoverEffect text="Contact Me"/>
      </div>

    </main>
  );
}
