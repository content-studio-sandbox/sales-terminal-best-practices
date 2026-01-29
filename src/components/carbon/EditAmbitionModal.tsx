import { useEffect, useState } from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TextInput,
  TextArea,
  InlineNotification,
  ComboBox,
  NumberInput,
  Grid,
  Column,
  Section,
  Heading,
  Dropdown,
  DatePicker,
  DatePickerInput,
  FormLabel
} from "@carbon/react";
import { Rocket, User, ChartLine, Calendar } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderOption {
  id: string;
  text: string;
  email: string;
}

interface EditAmbitionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ambition: any;
  onUpdate: () => void;
}

export default function EditAmbitionModal({
  open,
  onOpenChange,
  ambition,
  onUpdate,
}: EditAmbitionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    business_value: "",
    expected_roi: "",
    strategic_priority: "medium",
    target_completion: "",
    budget_allocated: "",
  });
  const [leaders, setLeaders] = useState<LeaderOption[]>([]);
  const [selectedLeader, setSelectedLeader] = useState<LeaderOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const priorityOptions = [
    { id: "critical", label: "Critical - Immediate Action Required" },
    { id: "high", label: "High - Top Priority" },
    { id: "medium", label: "Medium - Standard Priority" },
    { id: "low", label: "Low - Future Consideration" }
  ];

  // Load ambition data when modal opens
  useEffect(() => {
    if (ambition && open) {
      setFormData({
        name: ambition.title || ambition.name || "",
        description: ambition.description || "",
        business_value: ambition.business_value || "",
        expected_roi: ambition.expected_roi?.toString() || "",
        strategic_priority: ambition.strategic_priority || "medium",
        target_completion: ambition.target_completion || "",
        budget_allocated: ambition.budget_allocated?.toString() || "",
      });

      // Set selected leader if available
      if (ambition.leader_id) {
        setSelectedLeader({
          id: ambition.leader_id,
          text: ambition.leader?.display_name || "Unknown",
          email: ambition.leader?.email || ""
        });
      }
    }
  }, [ambition, open]);

  // Load leader options from the server
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, display_name, email, access_role")
          .in("access_role", ["leadership", "leader"])
          .order("display_name");
        
        if (error) throw error;
        
        const leaderOptions: LeaderOption[] = (data || []).map(u => ({
          id: u.id,
          text: u.display_name || u.email,
          email: u.email
        }));
        
        setLeaders(leaderOptions);
      } catch (e: any) {
        console.error("load leaders failed:", e);
        // Don't set error - just log it. User can still edit without changing leader.
        setLeaders([]);
      }
    })();
  }, [open]);

  const reset = () => {
    setFormData({
      name: "",
      description: "",
      business_value: "",
      expected_roi: "",
      strategic_priority: "medium",
      target_completion: "",
      budget_allocated: "",
    });
    setSelectedLeader(null);
    setErr(null);
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setErr("Name and description are required");
      return;
    }

    setLoading(true);
    setErr(null);
    try {
      const updateData: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      // Update leader (can be null to clear)
      updateData.leader_id = selectedLeader?.id || null;

      // Add executive dashboard metrics (always include to allow clearing)
      updateData.business_value = formData.business_value.trim() || null;
      updateData.expected_roi = formData.expected_roi ? parseFloat(formData.expected_roi) : null;
      updateData.strategic_priority = formData.strategic_priority || 'medium';
      updateData.target_completion = formData.target_completion || null;
      updateData.budget_allocated = formData.budget_allocated ? parseFloat(formData.budget_allocated) : null;

      const { error } = await supabase
        .from("ambitions")
        .update(updateData)
        .eq("id", ambition.id);
      
      if (error) throw error;

      reset();
      onOpenChange(false);
      onUpdate();
    } catch (e: any) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComposedModal 
      open={open} 
      onClose={() => onOpenChange(false)} 
      size="lg"
      preventCloseOnClickOutside
    >
      <ModalHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Rocket size={28} style={{ color: "var(--cds-interactive)" }} />
          <div>
            <h3 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>Edit Strategic Ambition</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "var(--cds-text-secondary)" }}>
              Update the details of this strategic initiative
            </p>
          </div>
        </div>
      </ModalHeader>
      
      <ModalBody hasScrollingContent>
        {err && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={err}
            style={{ marginBottom: 24 }}
            lowContrast
          />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "8px 0" }}>
          {/* Basic Information Section */}
          <Section level={3}>
            <Heading style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Rocket size={20} style={{ color: "var(--cds-interactive)" }} />
              Basic Information
            </Heading>
            
            <Grid narrow fullWidth>
              <Column lg={16} md={8} sm={4} style={{ marginBottom: "16px" }}>
                <TextInput
                  id="ambition-name"
                  labelText="Ambition Name"
                  placeholder="e.g., Digital Transformation Initiative"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  invalid={formData.name.trim() === "" && formData.name !== ""}
                  invalidText="Ambition name is required"
                />
              </Column>

              <Column lg={16} md={8} sm={4}>
                <TextArea
                  id="ambition-description"
                  labelText="Description"
                  placeholder="Describe the strategic ambition, its goals, and expected outcomes..."
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  required
                  invalid={formData.description.trim() === "" && formData.description !== ""}
                  invalidText="Description is required"
                />
              </Column>
            </Grid>
          </Section>

          {/* Leadership Section */}
          <Section level={3}>
            <Heading style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={20} style={{ color: "var(--cds-interactive)" }} />
              Leadership
            </Heading>
            
            <Grid narrow fullWidth>
              <Column lg={16} md={8} sm={4}>
                <ComboBox
                  id="leader-select"
                  titleText="Assign Initiative Leader"
                  placeholder="Select a leader..."
                  helperText="Optional: Assign a leader to oversee this strategic initiative"
                  items={leaders}
                  selectedItem={selectedLeader as any}
                  itemToString={(item) => (item ? (item as LeaderOption).text : '')}
                  onChange={({ selectedItem }) => setSelectedLeader((selectedItem as LeaderOption) || null)}
                  shouldFilterItem={({ item, inputValue }) =>
                    (item as LeaderOption).text.toLowerCase().includes((inputValue || "").toLowerCase())
                  }
                />
              </Column>
            </Grid>
          </Section>

          {/* Executive Dashboard Metrics Section */}
          <Section level={3}>
            <Heading style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ChartLine size={20} style={{ color: "var(--cds-interactive)" }} />
              Executive Dashboard Metrics
            </Heading>
            
            <Grid narrow fullWidth>
              <Column lg={16} md={8} sm={4} style={{ marginBottom: "16px" }}>
                <TextArea
                  id="business-value"
                  labelText="Business Value"
                  placeholder="Describe the expected business value and strategic impact..."
                  helperText="Optional: Explain how this initiative contributes to business objectives"
                  value={formData.business_value}
                  onChange={(e) => setFormData((p) => ({ ...p, business_value: e.target.value }))}
                  rows={3}
                />
              </Column>

              <Column lg={8} md={4} sm={4} style={{ marginBottom: "16px" }}>
                <Dropdown
                  id="strategic-priority"
                  titleText="Strategic Priority"
                  helperText="Set the priority level for this initiative"
                  label={priorityOptions.find(p => p.id === formData.strategic_priority)?.label || "Select priority"}
                  items={priorityOptions}
                  itemToString={(item) => item?.label || ""}
                  selectedItem={priorityOptions.find(p => p.id === formData.strategic_priority)}
                  onChange={({ selectedItem }) => 
                    setFormData((p) => ({ ...p, strategic_priority: selectedItem?.id || "medium" }))
                  }
                />
              </Column>

              <Column lg={8} md={4} sm={4} style={{ marginBottom: "16px" }}>
                <NumberInput
                  id="expected-roi"
                  label="Expected ROI (%)"
                  helperText="Optional: Projected return on investment"
                  placeholder="e.g., 25"
                  value={formData.expected_roi}
                  onChange={(e: any) => setFormData((p) => ({ ...p, expected_roi: e.target.value }))}
                  min={0}
                  max={1000}
                  step={1}
                  allowEmpty
                />
              </Column>

              <Column lg={8} md={4} sm={4} style={{ marginBottom: "16px" }}>
                <NumberInput
                  id="budget-allocated"
                  label="Budget Allocated ($)"
                  helperText="Optional: Total budget for this initiative"
                  placeholder="e.g., 500000"
                  value={formData.budget_allocated}
                  onChange={(e: any) => setFormData((p) => ({ ...p, budget_allocated: e.target.value }))}
                  min={0}
                  step={1000}
                  allowEmpty
                />
              </Column>

              <Column lg={8} md={4} sm={4}>
                <div>
                  <FormLabel style={{ marginBottom: "8px" }}>
                    <Calendar size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                    Target Completion Date
                  </FormLabel>
                  <DatePicker
                    datePickerType="single"
                    dateFormat="m/d/Y"
                    value={formData.target_completion ? new Date(formData.target_completion + 'T00:00:00') : undefined}
                    onChange={(dates: any) => {
                      const date = dates[0];
                      if (date) {
                        setFormData((p) => ({ ...p, target_completion: date.toISOString().split('T')[0] }));
                      }
                    }}
                  >
                    <DatePickerInput
                      id="target-completion"
                      placeholder="mm/dd/yyyy"
                      labelText=""
                      size="md"
                    />
                  </DatePicker>
                  <p style={{ fontSize: "12px", color: "var(--cds-text-secondary)", marginTop: "4px" }}>
                    Optional: Expected completion date for this initiative
                  </p>
                </div>
              </Column>
            </Grid>
          </Section>
        </div>
      </ModalBody>
      
      <ModalFooter>
        <Button kind="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
          Cancel
        </Button>
        <Button
          kind="primary"
          onClick={handleUpdate}
          disabled={loading || !formData.name.trim() || !formData.description.trim()}
        >
          {loading ? "Updating…" : "Update Ambition"}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
}

// Made with Bob