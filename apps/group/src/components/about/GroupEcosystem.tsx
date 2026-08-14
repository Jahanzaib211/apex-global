import Container from "../Container";
import SectionHeading from "../SectionHeading";

const orbit = [
  { name: "Tech", route: "/companies/tech-solution" },
  { name: "Outsourcing", route: "/companies/outsourcing" },
  { name: "Tours", route: "/companies/tours-travels" },
  { name: "Holdings", route: "/companies/holdings" },
  { name: "Consultancy", route: "/consultancy" },
];

export default function GroupEcosystem() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="THE APEX ECOSYSTEM"
          title="How the Group Operates."
          subtitle="Apex Group is structured to let each business lead with focus, while staying connected through shared standards, partnerships and a single long-term vision."
        />

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative flex flex-col items-center">
            <div className="border-gold bg-navy font-display shadow-gold/10 z-10 flex h-52 w-52 items-center justify-center rounded-full border-2 p-6 text-center text-xl text-white shadow-2xl md:h-56 md:w-56">
              APEX GROUP
              <br />
              OF COMPANIES
            </div>

            <div className="mt-10 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {orbit.map((n) => (
                <a
                  key={n.name}
                  href={n.route}
                  className="group border-navy/15 bg-cream hover:border-gold relative border p-6 text-center transition hover:-translate-y-1"
                >
                  <span className="bg-gold/70 absolute -top-8 left-1/2 hidden h-8 w-px -translate-x-1/2 lg:block" />
                  <p className="text-slate text-[10px] font-bold tracking-[.2em] uppercase">
                    {n.name === "Tech" && "TECHNOLOGY"}
                    {n.name === "Outsourcing" && "OUTSOURCING"}
                    {n.name === "Tours" && "TRAVEL & TOURS"}
                    {n.name === "Holdings" && "REAL ESTATE"}
                    {n.name === "Consultancy" && "CONSULTANCY"}
                  </p>
                  <h3 className="font-display text-navy group-hover:text-gold mt-4 text-xl">
                    {n.name === "Tech" && "Apex Global Tech Solution"}
                    {n.name === "Outsourcing" && "Apex Outsourcing"}
                    {n.name === "Tours" && "Apex Tours & Travels"}
                    {n.name === "Holdings" && "Apex Holdings"}
                    {n.name === "Consultancy" && "Financial Consultancy"}
                  </h3>
                </a>
              ))}
            </div>
          </div>

          <div className="border-navy/10 text-charcoal/75 mx-auto mt-16 max-w-3xl space-y-5 border-t pt-10 text-base leading-7">
            <p>
              Each company in the Apex Group operates as a specialist — with its own team, customers
              and rhythm of work. What they share is a common operating philosophy, a willingness to
              collaborate across the Group, and access to the wider network of relationships that
              the Group has built over time.
            </p>
            <p>
              The result is a quiet kind of strength: businesses that stay independent enough to be
              excellent, while benefiting from the trust, standards and reach of being part of
              something larger.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
