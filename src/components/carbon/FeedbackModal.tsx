import { useState } from "react";
import {
    Modal,
    TextInput,
    TextArea,
    RadioButtonGroup,
    RadioButton,
    Dropdown,
    InlineNotification,
    InlineLoading,
} from "@carbon/react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { trackUserAction, trackBusinessMetric } from "@/hooks/useInstana";

interface FeedbackModalProps {
    open: boolean;
    onClose: () => void;
}

const categories = [
    { id: "ui_ux", text: "UI/UX" },
    { id: "performance", text: "Performance" },
    { id: "feature", text: "Feature Request" },
    { id: "data", text: "Data/Content" },
    { id: "security", text: "Security" },
    { id: "other", text: "Other" },
];

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
    const { user } = useAuth();
    const [type, setType] = useState<"bug" | "idea">("bug");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const validateInputs = (): string | null => {
        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        if (!trimmedTitle || !trimmedDescription) {
            return "Please fill in all required fields";
        }

        if (trimmedTitle.length < 5) {
            return "Title must be at least 5 characters long";
        }

        if (trimmedTitle.length > 200) {
            return "Title must not exceed 200 characters";
        }

        if (trimmedDescription.length < 10) {
            return "Description must be at least 10 characters long";
        }

        if (trimmedDescription.length > 2000) {
            return "Description must not exceed 2000 characters";
        }

        // Basic XSS prevention - check for script tags
        const dangerousPattern = /<script|javascript:|onerror=|onclick=/i;
        if (dangerousPattern.test(trimmedTitle) || dangerousPattern.test(trimmedDescription)) {
            return "Invalid characters detected. Please remove any script tags or event handlers.";
        }

        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            console.log("🐛 [FeedbackModal] Submitting feedback:", {
                user_id: user?.id,
                user_email: user?.email,
                type,
                title: title.trim().substring(0, 50) + "...",
                category: category.id
            });

            const { error: insertError } = await supabase
                .from("feedback" as any)
                .insert({
                    user_id: user?.id,
                    type,
                    title: title.trim(),
                    description: description.trim(),
                    category: category.id,
                    status: "open",
                    // Note: user_email and user_name columns don't exist in production yet
                    // priority and status have DEFAULT values in the database
                });

            console.log("✅ [FeedbackModal] Feedback submitted successfully");

            if (insertError) throw insertError;

            // Track feedback submission in Instana
            trackUserAction('feedback_submitted', {
                type,
                category: category.id,
                title_length: title.trim().length,
                description_length: description.trim().length,
            });

            // Track business metric
            trackBusinessMetric('feedback_submissions', 1, 'count');

            setSuccess(true);
            // Give user 3 seconds to see success message before auto-closing
            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (err: any) {
            console.error("❌ [FeedbackModal] Error submitting feedback:", err);
            setError(err.message || "Failed to submit feedback");
            
            // Track feedback submission failure
            trackUserAction('feedback_submission_failed', {
                type,
                category: category.id,
                error_message: err.message || 'Unknown error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setType("bug");
        setTitle("");
        setDescription("");
        setCategory(categories[0]);
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <Modal
            open={open}
            onRequestClose={handleClose}
            modalHeading="Submit Feedback"
            primaryButtonText={submitting ? "Submitting..." : "Submit"}
            secondaryButtonText="Cancel"
            onRequestSubmit={handleSubmit}
            primaryButtonDisabled={submitting || success}
            size="md"
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {error && (
                    <InlineNotification
                        kind="error"
                        title="Error"
                        subtitle={error}
                        onClose={() => setError(null)}
                        lowContrast
                    />
                )}

                {success && (
                    <InlineNotification
                        kind="success"
                        title="Success"
                        subtitle="Thank you for your feedback! We'll review it soon. This dialog will close automatically."
                        lowContrast
                        hideCloseButton
                    />
                )}

                <RadioButtonGroup
                    legendText="Feedback Type"
                    name="feedback-type"
                    valueSelected={type}
                    onChange={(value) => setType(value as "bug" | "idea")}
                >
                    <RadioButton
                        labelText="🐛 Bug Report"
                        value="bug"
                        id="type-bug"
                    />
                    <RadioButton
                        labelText="💡 Feature Idea"
                        value="idea"
                        id="type-idea"
                    />
                </RadioButtonGroup>

                <Dropdown
                    id="category-dropdown"
                    titleText="Category"
                    label="Select a category"
                    items={categories}
                    itemToString={(item) => item?.text || ""}
                    selectedItem={category}
                    onChange={({ selectedItem }) => selectedItem && setCategory(selectedItem)}
                />

                <TextInput
                    id="feedback-title"
                    labelText="Title"
                    placeholder={
                        type === "bug"
                            ? "Brief description of the bug"
                            : "Brief description of your idea"
                    }
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setError(null); // Clear error when user types
                    }}
                    maxLength={200}
                    required
                    invalid={error !== null && title.trim().length < 5}
                    invalidText={title.trim().length < 5 ? "Title must be at least 5 characters" : ""}
                />

                <TextArea
                    id="feedback-description"
                    labelText="Description"
                    placeholder={
                        type === "bug"
                            ? "Please describe the bug in detail. Include steps to reproduce if possible."
                            : "Please describe your feature idea in detail. What problem does it solve?"
                    }
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        setError(null); // Clear error when user types
                    }}
                    rows={6}
                    maxLength={2000}
                    required
                    invalid={error !== null && description.trim().length < 10}
                    invalidText={description.trim().length < 10 ? "Description must be at least 10 characters" : ""}
                />

                <div style={{
                    fontSize: "0.75rem",
                    color: "var(--cds-text-secondary)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                }}>
                    <div>
                    {type === "bug" ? (
                        <p>
                            <strong>Tip:</strong> Include steps to reproduce, expected vs actual behavior, and any error messages.
                        </p>
                    ) : (
                        <p>
                            <strong>Tip:</strong> Explain the problem you're trying to solve and how your idea would help.
                        </p>
                    )}
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "1rem" }}>
                        <div>{title.length}/200 characters</div>
                        <div>{description.length}/2000 characters</div>
                    </div>
                </div>

                {submitting && (
                    <InlineLoading description="Submitting your feedback..." />
                )}
            </div>
        </Modal>
    );
}

// Made with Bob
