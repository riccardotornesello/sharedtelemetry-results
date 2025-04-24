"use client";

import { UIFieldClientComponent } from "payload";
import { useDocumentInfo } from "@payloadcms/ui";

const VisitCompetitionResultsButton: UIFieldClientComponent = (props) => {
  const data = useDocumentInfo();
  const slug = data?.savedDocumentData?.slug;

  if (!slug) {
    return null;
  }

  return (
    <div>
      <a href={`/competitions/${slug}`}>View results</a>
    </div>
  );
};

export default VisitCompetitionResultsButton;
