"use client"
import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Spotlight } from "./ui/Spotlight";

gsap.registerPlugin(ScrollTrigger);

const ImageScrollReveal = () => {
  useEffect(() => {
    const rows = document.querySelectorAll(".row");

    rows.forEach((row) => {
      const img = row.querySelector("img");
      gsap.set(img, {
        clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)", // Start as completely invisible
      });
      gsap.to(img, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Reveal horizontally and vertically
        scrollTrigger: {
          trigger: img,
          start: "top 75%",
          end: "bottom 70%",
          scrub: true,
        },
      });
    });

    gsap.utils.toArray(".img-container p").forEach((text) => {
      gsap.from(text, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: text,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, []);

  const rows = [
    { id: 1, side: "right", image: "/images/img-1.png" },
    { id: 2, side: "left", image: "/images/img-2.png"},
    { id: 3, side: "right", image: "/images/img-3.png"},
    { id: 4, side: "left", image: "/images/img-4.png"},
    { id: 5, side: "right", image: "/images/img-5.png"},
    { id: 6, side: "left", image: "/images/img-6.png"},
    { id: 7, side: "right", image: "/images/img-7.png"},
    { id: 8, side: "left", image: "/images/img-8.png" },
    { id: 9, side: "right", image: "/images/img-9.jpeg" },
    { id: 10, side: "left", image: "/images/img-10.png"},
  ];

  return (
    <div className="font-tiny text-red-500">
        <Spotlight className="" fill="purple"/>
        <Spotlight className="" fill="purple"/>

        <Spotlight className="-top-10" fill="blue"/>
        <header className="w-full h-72 flex justify-between items-start p-4">
        <p className="uppercase font-tiny">Scroll To Reveal</p>
      </header>
      <main className="w-full">
        {rows.map((row) => (
          <div
            key={row.id}
            className={`row flex h-${row.id % 2 === 0 ? "96" : "80"}`}
          >
            <div
              className={`col flex ${row.side === "right" ? "justify-end" : "justify-start"} flex-1`}
            >
              {row.side === "right" && (
                <div className="img-container right">
                  <img
                    src={row.image}
                    className="w-full h-full object-cover clip-path-right"
                  />
                </div>
              )}
            </div>
            <div className={`col flex-1`}></div>
            <div
              className={`col flex ${row.side === "left" ? "justify-start" : "justify-end"} flex-1`}
            >
              {row.side === "left" && (
                <div className="img-container left">
                  <img
                    src={row.image}
                    alt={row.text}
                    className="w-full h-full object-cover clip-path-left"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="w-full h-72"></div>
      </main>
    </div>
  );
};

export default ImageScrollReveal;
