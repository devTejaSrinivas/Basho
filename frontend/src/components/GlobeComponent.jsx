import { useEffect, useRef } from "react";
import Globe from "globe.gl";

const GlobeComponent = () => {
  const globeRef = useRef(null);

  useEffect(() => {
    const globe = Globe()(globeRef.current)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundColor("rgba(0,0,0,0)") // Transparent background
      .width(700) // Increased width
      .height(700) // Increased height
      .pointOfView({ lat: 0, lng: 0, altitude: 2.5 });

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.6; // Slightly faster rotation
  }, []);

  return (
    <div className="relative w-full h-full flex justify-end">
      {/* Move the globe more to the right */}
      <div ref={globeRef} className="w-[700px] h-[700px] mr-[-50px]" />
    </div>
  );
};

export default GlobeComponent;
