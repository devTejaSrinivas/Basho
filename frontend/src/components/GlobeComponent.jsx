import { useEffect, useRef } from "react";
import Globe from "globe.gl";

const GlobeComponent = () => {
  const globeRef = useRef(null);

  useEffect(() => {
    const globe = Globe()(globeRef.current)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundColor("rgba(0,0,0,0)") // Transparent background
      .width(500) // Adjust width
      .height(500) // Adjust height
      .pointOfView({ lat: 0, lng: 0, altitude: 2.5 });

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.4;
  }, []);

  return <div ref={globeRef} className="w-[100%] h-[100%]" />;
};

export default GlobeComponent;
