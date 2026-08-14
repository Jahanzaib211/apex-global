import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
export default function GalleryUploadInfo() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="FOR APEX TEAM"
          title="Adding to the Gallery."
          subtitle="The gallery is CMS-managed. New images, albums, captions and tags are added through the Group content system."
        />
      </Container>
    </section>
  );
}
