"use client";
import { useParams } from "next/navigation";
import Placeholder from "@/components/admin/Placeholder";
const names: Record<string, string> = {
  "tech-solution": "Apex Global Tech Solution",
  outsourcing: "Apex Outsourcing",
  "tours-travels": "Apex Tours & Travels",
  holdings: "Apex Holdings",
  consultancy: "Financial Consultancy",
};
export default function CompanyPage() {
  const { slug } = useParams<{ slug: string }>();
  return <Placeholder title={names[slug] || "Company"} description="Company editor" />;
}
