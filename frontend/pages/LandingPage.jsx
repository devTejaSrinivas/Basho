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
    style={{ backgroundColor: "#00040f", width: "100%", overflow: "hidden" }}
  >
    <div
      style={{ padding: "0 2rem", display: "flex", justifyContent: "center" }}
    >
      <div style={{ maxWidth: "1200px", width: "100%" }}>
        <Navbar />
      </div>
    </div>

    <div
      style={{
        backgroundColor: "#00040f",
        display: "flex",
        justifyContent: "start",
      }}
    >
      <div style={{ maxWidth: "1200px", width: "100%" }}>
        <Hero />
      </div>
    </div>

    <div
      style={{
        backgroundColor: "#00040f",
        padding: "0 2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", width: "100%" }}>
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
