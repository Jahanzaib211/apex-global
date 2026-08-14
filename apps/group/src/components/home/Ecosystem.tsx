import Container from "../Container";
import SectionHeading from "../SectionHeading";
const nodes = [
  "Technology",
  "Outsourcing",
  "Travel & Tours",
  "Real Estate",
  "Financial Consultancy",
];
export default function Ecosystem() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="THE APEX ECOSYSTEM"
          title="Many Capabilities. One Connected Group."
          subtitle="Our businesses stay distinct in their expertise while connected by shared standards, relationships and ambition."
        />
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative flex flex-col items-center">
            <div className="border-gold bg-navy font-display shadow-gold/10 z-10 flex h-48 w-48 items-center justify-center rounded-full border-2 p-8 text-center text-xl text-white shadow-2xl">
              APEX GROUP
              <br />
              OF COMPANIES
            </div>
            <div className="mt-8 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {nodes.map((n) => (
                <div
                  key={n}
                  className="border-navy/15 text-navy before:bg-gold/70 relative border bg-white p-5 text-center text-sm font-semibold before:absolute before:-top-8 before:left-1/2 before:h-8 before:w-px"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
