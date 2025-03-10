import styles from "../src/style";
import {
  Billing,
  Business,
  CardDeal,
  Clients,
  CTA,
  Footer,
  Navbar,
  Stats,
  Testimonials,
  Hero,
} from "../src/components";

const LandingPage = () => (
  <div
    style={{ backgroundColor: "#00040f" }}
    className="w-full overflow-hidden"
  >
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
      </div>
    </div>

    <div
      style={{ backgroundColor: "#00040f" }}
      className={`${styles.flexStart}`}
    >
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>

    <div
      style={{ backgroundColor: "#00040f" }}
      className={`${styles.paddingX} ${styles.flexCenter}`}
    >
      <div className={`${styles.boxWidth}`}>
        <Stats />
        <Business />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </div>
  </div>
);

export default LandingPage;
