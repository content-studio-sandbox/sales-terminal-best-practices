// src/components/carbon/ProjectRequiredSkillsManager.tsx
// TASK-12: Project required skills UI
import { useState, useEffect } from "react";
import {
  Button,
  ComboBox,
  Tag,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  InlineNotification,
  Modal,
  Select,
  SelectItem,
  Checkbox,
  TextInput,
  Loading,
} from "@carbon/react";
import { Add, TrashCan, Edit, Star, StarFilled } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectRequiredSkillsManagerProps {
  projectId: string;
  isProjectManager?: boolean;
}

interface RequiredSkill {
  id: string;
  skill_id: string;
  skill_name: string;
  skill_category: string;
  required_level: string;
  is_must_have: boolean;
  priority: number;
  notes: string | null;
}

const SKILL_LEVELS = [
  { value: "none", label: "None" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export default function ProjectRequiredSkillsManager({
  projectId,
  isProjectManager = false,
}: ProjectRequiredSkillsManagerProps) {
  const [requiredSkills, setRequiredSkills] = useState<RequiredSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<RequiredSkill | null>(null);
  const [notification, setNotification] = useState<{
    kind: "success" | "error" | "warning";
    title: string;
    subtitle?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    skill_id: "",
    required_level: "intermediate",
    is_must_have: false,
    priority: "0",
    notes: "",
  });

  useEffect(() => {
    fetchRequiredSkills();
    fetchAvailableSkills();
  }, [projectId]);

  const fetchRequiredSkills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("project_required_skills")
        .select(`
          id,
          skill_id,
          required_level,
          is_must_have,
          priority,
          notes,
          skills(name, category)
        `)
        .eq("project_id", projectId)
        .order("priority", { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map((item: any) => ({
        id: item.id,
        skill_id: item.skill_id,
        skill_name: item.skills?.name || "Unknown",
        skill_category: item.skills?.category || "",
        required_level: item.required_level,
        is_must_have: item.is_must_have,
        priority: item.priority || 0,
        notes: item.notes,
      }));

      setRequiredSkills(formatted);
    } catch (err: any) {
      console.error("Error fetching required skills:", err);
      setNotification({
        kind: "error",
        title: "Error loading required skills",
        subtitle: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("id, name, category")
        .order("name");

      if (error) throw error;
      setAvailableSkills(data || []);
    } catch (err: any) {
      console.error("Error fetching available skills:", err);
    }
  };

  const handleAddSkill = async () => {
    try {
      // Check for duplicate
      const duplicate = requiredSkills.find((s) => s.skill_id === formData.skill_id);
      if (duplicate) {
        setNotification({
          kind: "warning",
          title: "Duplicate skill",
          subtitle: "This skill is already required for this project.",
        });
        return;
      }

      const { error } = await supabase.from("project_required_skills").insert({
        project_id: projectId,
        skill_id: formData.skill_id,
        required_level: formData.required_level,
        is_must_have: formData.is_must_have,
        priority: parseInt(formData.priority) || 0,
        notes: formData.notes || null,
      });

      if (error) throw error;

      setNotification({
        kind: "success",
        title: "Required skill added successfully",
      });

      setShowAddModal(false);
      resetForm();
      fetchRequiredSkills();
    } catch (err: any) {
      console.error("Error adding required skill:", err);
      setNotification({
        kind: "error",
        title: "Error adding required skill",
        subtitle: err.message,
      });
    }
  };

  const handleEditSkill = async () => {
    if (!selectedSkill) return;

    try {
      const { error } = await supabase
        .from("project_required_skills")
        .update({
          required_level: formData.required_level,
          is_must_have: formData.is_must_have,
          priority: parseInt(formData.priority) || 0,
          notes: formData.notes || null,
        })
        .eq("id", selectedSkill.id);

      if (error) throw error;

      setNotification({
        kind: "success",
        title: "Required skill updated successfully",
      });

      setShowEditModal(false);
      setSelectedSkill(null);
      fetchRequiredSkills();
    } catch (err: any) {
      console.error("Error updating required skill:", err);
      setNotification({
        kind: "error",
        title: "Error updating required skill",
        subtitle: err.message,
      });
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm("Are you sure you want to remove this required skill?")) return;

    try {
      const { error } = await supabase
        .from("project_required_skills")
        .delete()
        .eq("id", skillId);

      if (error) throw error;

      setNotification({
        kind: "success",
        title: "Required skill removed successfully",
      });

      fetchRequiredSkills();
    } catch (err: any) {
      console.error("Error deleting required skill:", err);
      setNotification({
        kind: "error",
        title: "Error removing required skill",
        subtitle: err.message,
      });
    }
  };

  const openEditModal = (skill: RequiredSkill) => {
    setSelectedSkill(skill);
    setFormData({
      skill_id: skill.skill_id,
      required_level: skill.required_level,
      is_must_have: skill.is_must_have,
      priority: skill.priority.toString(),
      notes: skill.notes || "",
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      skill_id: "",
      required_level: "intermediate",
      is_must_have: false,
      priority: "0",
      notes: "",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "expert":
        return "green";
      case "advanced":
        return "blue";
      case "intermediate":
        return "cyan";
      case "beginner":
        return "gray";
      default:
        return "gray";
    }
  };

  const skillOptions = availableSkills.map((skill) => ({
    id: skill.id,
    label: `${skill.name}${skill.category ? ` (${skill.category})` : ""}`,
  }));

  const headers = [
    { key: "skill_name", header: "Skill" },
    { key: "required_level", header: "Required Level" },
    { key: "must_have", header: "Must-Have" },
    { key: "priority", header: "Priority" },
    { key: "actions", header: "Actions" },
  ];

  const rows = requiredSkills.map((skill) => ({
    id: skill.id,
    skill_name: (
      <div>
        <div style={{ fontWeight: 500 }}>{skill.skill_name}</div>
        {skill.skill_category && (
          <div style={{ fontSize: "12px", color: "var(--cds-text-secondary)" }}>
            {skill.skill_category}
          </div>
        )}
      </div>
    ),
    required_level: (
      <Tag type={getLevelColor(skill.required_level)} size="sm">
        {skill.required_level.charAt(0).toUpperCase() + skill.required_level.slice(1)}
      </Tag>
    ),
    must_have: skill.is_must_have ? (
      <Tag type="red" size="sm" renderIcon={StarFilled}>
        Must-Have
      </Tag>
    ) : (
      <Tag type="gray" size="sm">
        Nice-to-Have
      </Tag>
    ),
    priority: (
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {Array.from({ length: Math.min(skill.priority, 5) }).map((_, i) => (
          <Star key={i} size={16} style={{ fill: "var(--cds-support-warning)" }} />
        ))}
        {skill.priority === 0 && <span style={{ color: "var(--cds-text-secondary)" }}>—</span>}
      </div>
    ),
    actions: isProjectManager ? (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          kind="ghost"
          size="sm"
          renderIcon={Edit}
          iconDescription="Edit"
          hasIconOnly
          onClick={() => openEditModal(skill)}
        />
        <Button
          kind="ghost"
          size="sm"
          renderIcon={TrashCan}
          iconDescription="Delete"
          hasIconOnly
          onClick={() => handleDeleteSkill(skill.id)}
        />
      </div>
    ) : null,
  }));

  if (loading) {
    return <Loading withOverlay={false} description="Loading required skills..." />;
  }

  return (
    <>
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "4px" }}>
              Required Skills
            </h3>
            <p style={{ color: "var(--cds-text-secondary)", fontSize: "14px" }}>
              Define the skills needed for this project and their importance
            </p>
          </div>
          {isProjectManager && (
            <Button kind="primary" renderIcon={Add} onClick={() => setShowAddModal(true)}>
              Add Required Skill
            </Button>
          )}
        </div>

        {notification && (
          <InlineNotification
            kind={notification.kind}
            title={notification.title}
            subtitle={notification.subtitle}
            onClose={() => setNotification(null)}
            style={{ marginBottom: "16px" }}
          />
        )}

        {requiredSkills.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              backgroundColor: "var(--cds-layer-01)",
              borderRadius: "4px",
            }}
          >
            <p style={{ color: "var(--cds-text-secondary)", marginBottom: "16px" }}>
              No required skills defined yet.{" "}
              {isProjectManager && "Add skills to help match candidates!"}
            </p>
          </div>
        ) : (
          <DataTable rows={rows} headers={headers}>
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }: any) => (
              <TableContainer>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header: any) => (
                        <TableHeader key={header.key} {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row: any) => (
                      <TableRow key={row.id} {...getRowProps({ row })}>
                        {row.cells.map((cell: any) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        )}
      </div>

      {/* Add Required Skill Modal */}
      <Modal
        open={showAddModal}
        onRequestClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        modalHeading="Add Required Skill"
        primaryButtonText="Add Skill"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleAddSkill}
        size="sm"
      >
        <div style={{ marginBottom: "16px" }}>
          <ComboBox
            id="skill-select"
            items={skillOptions}
            itemToString={(item) => item?.label || ""}
            titleText="Select Skill *"
            placeholder="Search for a skill..."
            onChange={({ selectedItem }) =>
              setFormData({ ...formData, skill_id: selectedItem?.id || "" })
            }
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Select
            id="level-select"
            labelText="Required Level *"
            value={formData.required_level}
            onChange={(e) => setFormData({ ...formData, required_level: e.target.value })}
          >
            {SKILL_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value} text={level.label} />
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Checkbox
            id="must-have-checkbox"
            labelText="This is a must-have skill (required for matching)"
            checked={formData.is_must_have}
            onChange={(e) => setFormData({ ...formData, is_must_have: e.target.checked })}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <TextInput
            id="priority-input"
            labelText="Priority (0-5)"
            placeholder="0"
            type="number"
            min="0"
            max="5"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            helperText="Higher priority skills are weighted more in matching"
          />
        </div>
        <div>
          <TextInput
            id="notes-input"
            labelText="Notes (optional)"
            placeholder="Additional context about this skill requirement..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </Modal>

      {/* Edit Required Skill Modal */}
      <Modal
        open={showEditModal}
        onRequestClose={() => {
          setShowEditModal(false);
          setSelectedSkill(null);
        }}
        modalHeading={`Edit Required Skill: ${selectedSkill?.skill_name}`}
        primaryButtonText="Save Changes"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleEditSkill}
        size="sm"
      >
        <div style={{ marginBottom: "16px" }}>
          <Select
            id="edit-level-select"
            labelText="Required Level *"
            value={formData.required_level}
            onChange={(e) => setFormData({ ...formData, required_level: e.target.value })}
          >
            {SKILL_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value} text={level.label} />
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Checkbox
            id="edit-must-have-checkbox"
            labelText="This is a must-have skill (required for matching)"
            checked={formData.is_must_have}
            onChange={(e) => setFormData({ ...formData, is_must_have: e.target.checked })}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <TextInput
            id="edit-priority-input"
            labelText="Priority (0-5)"
            type="number"
            min="0"
            max="5"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            helperText="Higher priority skills are weighted more in matching"
          />
        </div>
        <div>
          <TextInput
            id="edit-notes-input"
            labelText="Notes (optional)"
            placeholder="Additional context about this skill requirement..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </Modal>
    </>
  );
}

// Made with Bob
