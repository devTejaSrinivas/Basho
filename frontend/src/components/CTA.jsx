import styles from "../style";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/chatpage");
  };
  return (
    <section
      className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}
    >
      <div className="flex-1 flex flex-col">
        <h2 className={styles.heading2}>Let’s try our service now!</h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          You just need to travel and we will help you write your magnificient
          travel stories .
        </p>
      </div>

      <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
        <Button onClick={handleButtonClick} />
      </div>
    </section>
  );
};

export default CTA;
