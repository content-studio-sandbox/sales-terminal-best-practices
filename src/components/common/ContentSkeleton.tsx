import { SkeletonText, SkeletonPlaceholder } from "@carbon/react";

interface ContentSkeletonProps {
  type?: "table" | "cards" | "dashboard" | "list";
  rows?: number;
  height?: number;
}

/**
 * ContentSkeleton - Prevents CLS by reserving space during loading
 *
 * This component provides consistent skeleton loaders that match
 * the dimensions of actual content, preventing layout shifts.
 */
export default function ContentSkeleton({
  type = "list",
  rows = 5,
  height = 600
}: ContentSkeletonProps) {
  
  if (type === "table") {
    return (
      <div style={{ minHeight: height, padding: "16px 0" }}>
        {/* Table header skeleton */}
        <div style={{ marginBottom: "16px" }}>
          <SkeletonText heading width="30%" />
        </div>
        
        {/* Table toolbar skeleton */}
        <div style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          alignItems: "center"
        }}>
          <div style={{ width: "250px", height: "40px" }}>
            <SkeletonPlaceholder />
          </div>
          <div style={{ width: "150px", height: "40px" }}>
            <SkeletonPlaceholder />
          </div>
          <div style={{ width: "150px", height: "40px" }}>
            <SkeletonPlaceholder />
          </div>
        </div>

        {/* Table rows skeleton */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
              gap: "16px",
              padding: "16px",
              borderBottom: "1px solid var(--cds-border-subtle-01)",
              alignItems: "center"
            }}
          >
            <SkeletonText width="80%" />
            <SkeletonText width="60%" />
            <SkeletonText width="50%" />
            <SkeletonText width="70%" />
            <div style={{ width: "80px", height: "32px" }}>
              <SkeletonPlaceholder />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div style={{ minHeight: height }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
          padding: "16px 0"
        }}>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: "24px",
                border: "1px solid var(--cds-border-subtle-01)",
                borderRadius: "4px",
                minHeight: "200px"
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <SkeletonText heading width="70%" />
              </div>
              <SkeletonText width="100%" lineCount={3} />
              <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                <div style={{ width: "80px", height: "24px" }}>
                  <SkeletonPlaceholder />
                </div>
                <div style={{ width: "80px", height: "24px" }}>
                  <SkeletonPlaceholder />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div style={{ minHeight: height }}>
        {/* KPI tiles skeleton */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px"
        }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: "24px",
                border: "1px solid var(--cds-border-subtle-01)",
                borderRadius: "4px",
                minHeight: "140px"
              }}
            >
              <div style={{ marginBottom: "8px" }}>
                <SkeletonText heading width="60%" />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <SkeletonText heading width="40%" />
              </div>
              <div style={{ width: "100%", height: "8px" }}>
                <SkeletonPlaceholder />
              </div>
            </div>
          ))}
        </div>

        {/* Main content skeleton */}
        <div style={{ marginTop: "32px" }}>
          <div style={{ marginBottom: "24px" }}>
            <SkeletonText heading width="30%" />
          </div>
          <ContentSkeleton type="table" rows={rows} height={height - 300} />
        </div>
      </div>
    );
  }

  // Default: list type
  return (
    <div style={{ minHeight: height, padding: "16px 0" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: "16px 0",
            borderBottom: "1px solid var(--cds-border-subtle-01)"
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <SkeletonText heading width="60%" />
          </div>
          <SkeletonText width="90%" lineCount={2} />
        </div>
      ))}
    </div>
  );
}

// Made with Bob
