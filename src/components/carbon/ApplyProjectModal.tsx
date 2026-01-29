// src/components/projects/ApplyProjectModal.tsx
import { useState } from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextArea,
  ComboBox,
  Button,
} from "@carbon/react";
import { trackUserAction, trackBusinessMetric } from "@/hooks/useInstana";

type ApplyPayload = {
  role_id: string | null;
  message: string;
};

interface ApplyProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any | null;
  // MUST be provided by parent; parent will call the Node API
  onSubmit: (projectId: string, data: ApplyPayload) => Promise<void> | void;
  // Optional: pass available roles for the project
  roleOptions?: Array<{ id: string; text: string }>;
}

export default function ApplyProjectModal({
                                            open,
                                            onOpenChange,
                                            project,
                                            onSubmit,
                                            roleOptions = [],
                                          }: ApplyProjectModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] =
      useState<{ id: string; text: string } | null>(null);

  const reset = () => {
    setMessage("");
    setSelectedRole(null);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleApply = async () => {
    if (!project?.id) return;
    setSubmitting(true);
    try {
      await onSubmit(project.id, {
        role_id: selectedRole?.id ?? null,
        message: message.trim(),
      });
      
      // Track application submission in Instana
      trackUserAction('project_application_submitted', {
        project_id: project.id,
        project_name: project.name,
        has_role_preference: !!selectedRole,
        message_length: message.trim().length,
      });
      
      // Track business metric
      trackBusinessMetric('applications_submitted', 1, 'count');
      
      reset();
      onOpenChange(false);
    } catch (error) {
      // Track application failure
      trackUserAction('project_application_failed', {
        project_id: project.id,
        error_message: error?.message || 'Unknown error',
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <ComposedModal
          open={open}
          onClose={handleClose}
          preventCloseOnClickOutside={submitting}
      >
        <ModalHeader label="Apply to project" title={project?.name ?? "Project"} />
        <ModalBody hasForm>
          <div style={{ display: "grid", gap: 16 }}>
            <ComboBox
                id="apply-role"
                titleText="Desired role (optional)"
                placeholder="Select a role"
                items={roleOptions}
                itemToString={(item: any) => item?.text ?? ""}
                selectedItem={selectedRole}
                onChange={({ selectedItem }) => setSelectedRole(selectedItem as any)}
            />
            <TextArea
                id="apply-message"
                labelText="Message to the project owner"
                placeholder="Tell the PM why you’re a good fit…"
                value={message}
                onChange={(e: any) => setMessage(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button kind="primary" onClick={handleApply} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit application"}
          </Button>
        </ModalFooter>
      </ComposedModal>
  );
}
