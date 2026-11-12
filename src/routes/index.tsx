import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Menu, Wind } from "lucide-react";
import climatePortrait from "@/assets/climate-team-cutout.png";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AirCond — Climate technology at affordable prices" },
      {
        name: "description",
        content: "Thoughtful climate technology for comfortable, energy-smart homes and businesses.",
      },
      { property: "og:title", content: "AirCond — Climate technology at affordable prices" },
      {
        property: "og:description",
        content: "Thoughtful climate technology for comfortable, energy-smart homes and businesses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

const navItems = ["Our mission", "Advantages", "Career", "News", "Team"];

function Index() {
  return (
    <main className="aircond-page min-h-screen overflow-hidden bg-background text-foreground">
      <header className="aircond-header mx-auto flex items-center justify-between">
        <a href="#top" className="aircond-wordmark" aria-label="AirCond home">
          AirCond
        </a>
        <nav className="aircond-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item} href={item === "Our mission" ? "#mission" : "#solutions"}>
              {item}
            </a>
          ))}
        </nav>
        <Button className="aircond-login" asChild>
          <a href="#contact">Log in <ArrowUpRight aria-hidden="true" /></a>
        </Button>
        <Button className="aircond-mobile-menu" variant="ghost" size="icon" aria-label="Open menu">
          <Menu aria-hidden="true" />
        </Button>
      </header>

      <section id="top" className="aircond-hero mx-auto">
        <div className="aircond-intro">
          <span className="aircond-eyebrow">The concept of the 3Rs: rethink, reduce, reuse</span>
          <h1>Climate technology at<br className="desktop-break" /> affordable prices</h1>
          <p>Comprehensive supply of air conditioning<br className="desktop-break" /> and ventilation systems</p>
        </div>

        <div id="solutions" className="aircond-solutions" aria-label="Our areas of expertise">
          <a className="aircond-tile tile-home" href="#contact">
            <span className="tile-title">Household</span>
            <span className="tile-copy">Wholesale of household<br />appliances</span>
            <span className="tile-curve" aria-hidden="true" />
          </a>
          <a className="aircond-tile tile-system" href="#contact">
            <span className="tile-title">System</span>
            <span className="tile-copy">Production and Engineering<br />Direction</span>
            <span className="tile-curve" aria-hidden="true" />
          </a>
          <a className="aircond-tile tile-climate" href="#contact">
            <span className="tile-title">Climate<br />technology</span>
            <span className="tile-copy">Wholesale sales of climate<br />technology</span>
          </a>
        </div>

        <a className="aircond-collab" href="#mission">
          <span className="collab-label">Growth and long-term collaboration</span>
          <img src={climatePortrait} alt="AirCond climate technology team member" width={816} height={816} />
          <span className="collab-mark"><Wind aria-hidden="true" /></span>
        </a>
        <span className="aircond-orbit orbit-one" aria-hidden="true" />
        <span className="aircond-orbit orbit-two" aria-hidden="true" />
      </section>

      <section id="mission" className="aircond-mission mx-auto">
        <div className="mission-visual" aria-hidden="true">
          <div className="mission-ring ring-a" />
          <div className="mission-ring ring-b" />
          <span className="mission-spark"><Wind /></span>
        </div>
        <div className="mission-copy">
          <span className="mission-tag">Our mission</span>
          <h2>Our mission is<br />a better climate.</h2>
          <p>We bring thoughtful technology and people together to make comfortable spaces more efficient and sustainable.</p>
          <a className="mission-link" href="#contact">Discover our approach <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </section>

      <section id="contact" className="aircond-contact mx-auto">
        <span>Comfort, considered.</span>
        <a href="mailto:hello@aircond.example">Talk to our team <ArrowUpRight aria-hidden="true" /></a>
      </section>
    </main>
  );
}