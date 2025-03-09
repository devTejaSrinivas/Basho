import styles from "../style";
import GetStarted from "./GetStarted";
import GlobeComponent from "./GlobeComponent"; // Import the globe
import WireframeGlobe from "./WireframeGlobe";

const Hero = () => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
      >
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
            Decode the <br className="sm:block hidden" />{" "}
            <span className="text-gradient">World,</span>{" "}
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0">
            <GetStarted />
          </div>
        </div>

        <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] w-full">
          Landmark stories at your fingertips
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Experience the magic of history with our AI-powered guide—upload a
          landmark image and instantly uncover its rich stories, hidden details,
          and timeless beauty.
        </p>
      </div>

      {/* Replace the image with the Globe */}
      <div
        className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}
      >
        <WireframeGlobe />
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        <GetStarted />
      </div>
    </section>
  );
};

export default Hero;
