import React from "react";
import Link from "next/link";
import Image from "next/image";
import HoverVideoPlayer from 'react-hover-video-player';
import d1 from "../../images/gallery/1.jpg";
import d2 from "../../images/gallery/2.jpeg";
import d7 from "../../images/gallery/7.jpg";
import a8 from "../../images/gallery/8.jpg";
import a9 from "../../images/gallery/9.jpg";
import a3 from "../../images/gallery/3.jpg";
import a4 from "../../images/gallery/4.jpg";
import a5 from "../../images/gallery/5.jpg";
import a6 from "../../images/gallery/6.jpg";
import d10 from "../../images/gallery/10.jpg";
import clast from "../../images/gallery/11.jpg";
import d12 from "../../images/gallery/12.jpg";
import d13 from "../../images/gallery/13.jpg";
import d14 from "../../images/gallery/14.jpg";
import d15 from "../../images/gallery/15.jpg";
import d16 from "../../images/gallery/drone1.jpg";
import p1 from "../../images/gallery/p1.jpg";
import p3 from "../../images/gallery/p3.jpeg";
import p4 from "../../images/gallery/p4.jpeg";
import p5 from "../../images/gallery/p4.jpeg";
import p6 from "../../images/gallery/exo1.png";
import p7 from "../../images/gallery/exo2.jpg";
import p8 from "../../images/gallery/drdo.jpg";
import w1 from "../../images/gallery/w1.jpg";
import w2 from "../../images/gallery/w2.jpg";
import w3 from "../../images/gallery/w3.jpg";
import w4 from "../../images/gallery/w4.jpg";
import w5 from "../../images/gallery/w5.jpg";
import w6 from "../../images/gallery/w6.jpg";
import w7 from "../../images/gallery/w7.jpg";
import w8 from "../../images/gallery/w8.webp";
import w9 from "../../images/gallery/w9.jpeg";
import w10 from "../../images/gallery/w10.jpg";
import w11 from "../../images/gallery/w11.jpg";
import w12 from "../../images/gallery/w12.jpeg";
import w13 from "../../images/gallery/w13.jpg";
import w14 from "../../images/gallery/w14.jpg";
import w15 from "../../images/gallery/w15.jpg";
import w16 from "../../images/gallery/w16.jpg";
import w17 from "../../images/gallery/w17.jpg";
import w18 from "../../images/gallery/w18.jpg";
import w19 from "../../images/gallery/w19.jpg";
import w20 from "../../images/gallery/w20.jpeg";
import w21 from "../../images/gallery/w21.jpg";
import crobocon from "../../images/gallery/carousel/competition.jpg";
// import c1 from "../../images/gallery/c1.jpg";
import c2 from "../../images/gallery/c2.jpg";
import c3 from "../../images/gallery/c3.jpg";
import c4 from "../../images/gallery/c4.jpg";
import c5 from "../../images/gallery/c5.jpg";
import c6 from "../../images/gallery/c6.jpg";
import c7 from "../../images/gallery/c7.jpg";
import c8 from "../../images/gallery/c8.jpg";
import c9 from "../../images/gallery/c9.jpg";
import c10 from "../../images/gallery/c10.jpg";
import c11 from "../../images/gallery/c11.jpg";
import c12 from "../../images/gallery/c12.jpg";
import c13 from "../../images/gallery/c13.jpg";
import c14 from "../../images/gallery/c14.jpg";
import c15 from "../../images/gallery/c15.png";
import c16 from "../../images/gallery/c16.jpg";
import c17 from "../../images/gallery/c17.png";
// import c18 from "../../images/gallery/c18.jpg";
// import c19 from "../../images/gallery/c19.jpg";
// import c20 from "../../images/gallery/c20.png";
import c21 from "../../images/gallery/c21.png";
import c22 from "../../images/gallery/c22.png";
import c23 from "../../images/gallery/c23.png";
import c24 from "../../images/gallery/c24.jpg";


const Gallery = () => {

    return(
        <section className="overflow-hidden text-gray-700">
          <h1 className="text-4xl text-center mx-auto my-20">WORKSHOP AND ORIENTATION</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 ">
            <video className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden" autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover'}}>
              <source src="/21.mp4"/>
            </video>
            <video className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden" autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover'}}>
              <source src="/22.mp4"/>
            </video>
            <Image src={w1} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w2} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w3} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w4} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w5} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w6} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w7} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w8} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w9} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w10} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w11} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w12} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w13} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w14} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w15} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w16} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w17} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w18} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w19} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w20} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={w21} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
          </div>
          
          {/* <h1 className="text-4xl text-center mx-auto mt-8 mb-20">PROJECTS</h1> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 "> */}
            {/* <Image src={a3} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={a4} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={a5} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={a6} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={a8} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            {/* <Image src={a9} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            {/* <Image src={p1} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            {/* <Image src={p3} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            {/* <Image src={p4} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            {/* <Image src={p5} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={p6} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            {/* <Image src={p7} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={p8} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <video className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden" autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover'}}>
              <source src="/basanti.mp4"/>
            </video>
            <video className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden" autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover'}}>
              <source src="/gait1.mp4"/>
            </video>
            <video className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden" autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover'}}>
              <source src="/gait2.mp4"/>
            </video>
            <video className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden" autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover'}}>
              <source src="/GaitAnalysis.mp4"/>
            </video>
            <video className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden" autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover'}}> */}
              {/* <source src="/video.mp4"/>
            </video>
            <video className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden" autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover'}}>
              <source src="/video2.mp4"/>
            </video> */}
          {/* </div> */}

          <h1 className="text-4xl text-center mx-auto my-20">COMPETITIONS</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 ">
            <video className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden" autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover'}}>
              <source src="/video2.mp4"/>
            </video>
            {/* <Image src={c1} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            {/* <Image src={c2} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            <Image src={c3} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c4} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c5} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c6} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c7} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c8} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c9} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c10} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c11} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c12} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c13} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c14} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c15} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c16} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c17} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            {/* <Image src={c18} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c19} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c20} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            {/* <Image src={c21} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            <Image src={c22} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c23} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={c24} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
          </div>
          <h1 className="text-4xl text-center mx-auto my-20">ZINE DRONE RACING</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 ">
            <video className="opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden" autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover'}}>
              <source src="/dronenight.mp4"/>
            </video>
            <Image src={d1} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={d2} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={d7} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            {/* <Image src={d10} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
            <Image src={d12} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={d13} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={d14} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            <Image src={d15} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/>
            {/* <Image src={d16} className="object-cover opacity-50 hover:opacity-100 transition duration-500 ease-in-out overflow-hidden"/> */}
          </div>
        </section>
    )
}

export default Gallery;