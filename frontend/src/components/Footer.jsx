import styles from "../style";
import { logo } from "../assets";
import { footerLinks, socialMedia } from "../constants";
import GitHubProfile from "./GitHubProfile";

const githubUsernames = ["devTejaSrinivas", "sohamchitimali"];

const Footer = () => (
  <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
    {/* Our Team Section */}
    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
      Our Team
    </h2>
    <div className="flex justify-center space-x-8 mb-8">
      {githubUsernames.map((username) => (
        <GitHubProfile key={username} username={username} />
      ))}
    </div>

    {/* Footer Content */}
    <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
      <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-white">
        Copyright Ⓒ 2025 Basho . All Rights Reserved . Developed by Brogrammers
        Inc.
      </p>

      <div className="flex flex-row md:mt-0 mt-6">
        {socialMedia.map((social, index) => (
          <img
            key={social.id}
            src={social.icon}
            alt={social.id}
            className={`w-[21px] h-[21px] object-contain cursor-pointer ${
              index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
            }`}
            onClick={() => window.open(social.link)}
          />
        ))}
      </div>
    </div>
  </section>
);

export default Footer;
