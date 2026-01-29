import { useState, useEffect } from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  NumberInput,
  TextArea,
  Form,
  Stack,
  InlineNotification,
  Grid,
  Column,
  RadioButtonGroup,
  RadioButton
} from "@carbon/react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onReviewSubmitted: () => void;
}

export default function ProjectReviewModal({
  open,
  onOpenChange,
  project,
  onReviewSubmitted
}: ProjectReviewModalProps) {
  const [formData, setFormData] = useState({
    quality_rating: 3,
    business_impact_rating: 3,
    innovation_score: 3,
    actual_roi: 0,
    lessons_learned: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingReview, setExistingReview] = useState<any>(null);

  useEffect(() => {
    if (project && open) {
      // Check if review already exists
      const fetchExistingReview = async () => {
        try {
          const { data, error } = await supabase
            .from("project_reviews" as any)
            .select("*")
            .eq("project_id", project.id)
            .single();
  
          if (error && error.code !== "PGRST116") throw error;
          
          if (data) {
            setExistingReview(data);
            const reviewData = data as any;
            setFormData({
              quality_rating: reviewData.quality_rating || 3,
              business_impact_rating: reviewData.business_impact_rating || 3,
              innovation_score: reviewData.innovation_score || 3,
              actual_roi: reviewData.actual_roi || 0,
              lessons_learned: reviewData.lessons_learned || ""
            });
          } else {
            // Reset to defaults for new review
            setExistingReview(null);
            setFormData({
              quality_rating: 3,
              business_impact_rating: 3,
              innovation_score: 3,
              actual_roi: project.roi_contribution || 0,
              lessons_learned: ""
            });
          }
        } catch (error) {
          console.error("Error fetching existing review:", error);
        }
      };

      fetchExistingReview();
    }
  }, [project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project) {
      setError("No project selected");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const user = await supabase.auth.getUser();
      
      const reviewData = {
        id: existingReview?.id || crypto.randomUUID(),
        project_id: project.id,
        quality_rating: formData.quality_rating,
        business_impact_rating: formData.business_impact_rating,
        innovation_score: formData.innovation_score,
        actual_roi: formData.actual_roi,
        lessons_learned: formData.lessons_learned || null,
        reviewed_by: user.data.user?.id,
        reviewed_at: new Date().toISOString()
      };

      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from("project_reviews" as any)
          .update(reviewData)
          .eq("id", existingReview.id);

        if (error) throw error;
      } else {
        // Create new review
        const { error } = await supabase
          .from("project_reviews" as any)
          .insert(reviewData);

        if (error) throw error;
      }

      onReviewSubmitted();
      onOpenChange(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = {
    1: "Poor",
    2: "Below Average",
    3: "Average",
    4: "Good",
    5: "Excellent"
  };

  return (
    <ComposedModal open={open} onClose={() => onOpenChange(false)} size="lg">
      <ModalHeader>
        <h3>{existingReview ? "Update" : "Submit"} Project Review</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--cds-text-secondary)", marginTop: "0.5rem" }}>
          {project?.name}
        </p>
      </ModalHeader>
      <ModalBody>
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            style={{ marginBottom: "16px" }}
          />
        )}
        <Form onSubmit={handleSubmit}>
          <Stack gap={6}>
            {/* Quality Rating */}
            <div>
              <label
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "8px",
                  display: "block"
                }}
              >
                Quality Rating *
              </label>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--cds-text-secondary)",
                  marginBottom: "12px"
                }}
              >
                Rate the overall quality of project execution and deliverables
              </p>
              <RadioButtonGroup
                name="quality-rating"
                valueSelected={String(formData.quality_rating)}
                onChange={(value: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    quality_rating: parseInt(value)
                  }))
                }
                orientation="horizontal"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <RadioButton
                    key={rating}
                    labelText={`${rating} - ${ratingLabels[rating as keyof typeof ratingLabels]}`}
                    value={String(rating)}
                    id={`quality-${rating}`}
                  />
                ))}
              </RadioButtonGroup>
            </div>

            {/* Business Impact Rating */}
            <div>
              <label
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "8px",
                  display: "block"
                }}
              >
                Business Impact Rating *
              </label>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--cds-text-secondary)",
                  marginBottom: "12px"
                }}
              >
                Rate the business value and impact delivered by this project
              </p>
              <RadioButtonGroup
                name="business-impact"
                valueSelected={String(formData.business_impact_rating)}
                onChange={(value: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    business_impact_rating: parseInt(value)
                  }))
                }
                orientation="horizontal"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <RadioButton
                    key={rating}
                    labelText={`${rating} - ${ratingLabels[rating as keyof typeof ratingLabels]}`}
                    value={String(rating)}
                    id={`impact-${rating}`}
                  />
                ))}
              </RadioButtonGroup>
            </div>

            {/* Innovation Score */}
            <div>
              <label
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "8px",
                  display: "block"
                }}
              >
                Innovation Score *
              </label>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--cds-text-secondary)",
                  marginBottom: "12px"
                }}
              >
                Rate the level of innovation and creativity in this project
              </p>
              <RadioButtonGroup
                name="innovation-score"
                valueSelected={String(formData.innovation_score)}
                onChange={(value: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    innovation_score: parseInt(value)
                  }))
                }
                orientation="horizontal"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <RadioButton
                    key={rating}
                    labelText={`${rating} - ${ratingLabels[rating as keyof typeof ratingLabels]}`}
                    value={String(rating)}
                    id={`innovation-${rating}`}
                  />
                ))}
              </RadioButtonGroup>
            </div>

            {/* Actual ROI */}
            <div>
              <NumberInput
                id="actual-roi"
                label="Actual ROI (%)"
                helperText="The actual return on investment achieved (can be negative)"
                min={-100}
                max={1000}
                step={5}
                value={formData.actual_roi}
                onChange={(e, { value }) =>
                  setFormData((prev) => ({
                    ...prev,
                    actual_roi:
                      typeof value === "number"
                        ? value
                        : parseFloat(value) || 0
                  }))
                }
                invalidText="Please enter a valid percentage"
              />
              {project?.roi_contribution && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--cds-text-secondary)",
                    marginTop: "8px"
                  }}
                >
                  Expected ROI was {project.roi_contribution}%
                </p>
              )}
            </div>

            {/* Lessons Learned */}
            <TextArea
              id="lessons-learned"
              labelText="Lessons Learned"
              helperText="What went well? What could be improved? Key takeaways for future projects"
              value={formData.lessons_learned}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lessons_learned: e.target.value
                }))
              }
              placeholder="Share insights, challenges overcome, and recommendations..."
              rows={5}
            />

          </Stack>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button kind="primary" onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Submitting..."
            : existingReview
            ? "Update Review"
            : "Submit Review"}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
}

// Made with Bob
