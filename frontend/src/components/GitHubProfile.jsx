import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, useTransform, useMotionValue, useSpring } from "framer-motion";

const GitHubProfile = ({ username }) => {
  const [profileData, setProfileData] = useState({
    avatarUrl: "",
    htmlUrl: "",
    name: "",
    bio: "",
  });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}`
        );
        setProfileData({
          avatarUrl: response.data.avatar_url,
          htmlUrl: response.data.html_url,
          name: response.data.name || response.data.login,
          bio: response.data.bio,
        });
      } catch (error) {
        console.error("Error fetching GitHub profile:", error);
      }
    };

    fetchProfile();
  }, [username]);

  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHoveredIndex(username)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {hoveredIndex === username && (
        <a href={profileData.htmlUrl} target="_blank" rel="noopener noreferrer">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 10,
              },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              translateX: translateX,
              rotate: rotate,
              whiteSpace: "nowrap",
            }}
            className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-gray-900 z-50 shadow-xl px-4 py-2"
          >
            <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
            <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
            <div className="font-bold font-sans text-white relative z-30 text-base">
              {profileData.name}
            </div>
            <div className="text-white font-mono text-xs">
              {profileData.bio}
            </div>
          </motion.div>
        </a>
      )}
      <a href={profileData.htmlUrl} target="_blank" rel="noopener noreferrer">
        <img
          onMouseMove={handleMouseMove}
          height={100}
          width={100}
          src={profileData.avatarUrl}
          alt={profileData.name}
          className="object-cover rounded-full !m-0 !p-0 h-20 w-20 border-2 group-hover:scale-105 group-hover:z-30 border-transparent relative transition duration-500"
        />
      </a>
    </div>
  );
};

export default GitHubProfile;
