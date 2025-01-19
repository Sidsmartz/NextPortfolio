"use client";

import { FaLocationArrow } from "react-icons/fa6";

import { projects } from "@/data";
import { PinContainer } from "./ui/3d-pin";
import { Spotlight } from "./ui/Spotlight";

const RecentProjects = () => {
  return (
    <div className="py-20 font-tiny">
      <h1 className="heading font-tiny">
        Some of my{" "}
        <span className="text-red-500">recent projects</span>
      </h1>
      <div className="border-red-800 flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects.map(({id, title, des, img, iconLists, link}) => (
          <div
            className=" border-red-500 lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
            key={id}
          >
            
            <PinContainer
              title={link}
              href={link}
            >
              <div className="border-red-500 relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                <div
                  className="border-red-500 relative w-full h-full overflow-hidden lg:rounded-3xl"
                  style={{ backgroundColor: "#  " }}
                >
                  <img src="/bg.png" alt="bgimg" />
                </div>
                <img
                  src={img}
                  alt="cover"
                  className="z-10 absolute bottom-0"
                />
              </div>
                  <div>
                    <Spotlight className="-top-40 -left-10 md:-left-32 h-screen" 
                    fill="red"/>
                    <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" 
                    fill="purple"/>
                    <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]"
                    fill="blue"/>
                  </div>

              <h1 className="font-bold text-red-300 lg:text-2xl md:text-xl text-base line-clamp-1">
                {title}
              </h1>

              <p
                className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {des}
              </p>

              <div className="flex items-center justify-between mt-7 mb-3">
                <div className="flex items-center">
                  {iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className="border border-red-400/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      <img src={icon} alt="icon5" className="p-2" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center items-center">
                  <p className="flex text-red-400 lg:text-xl md:text-xs text-sm text-purple">
                    Check it out!
                  </p>
                  <FaLocationArrow className="ms-3" color="red" />
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;