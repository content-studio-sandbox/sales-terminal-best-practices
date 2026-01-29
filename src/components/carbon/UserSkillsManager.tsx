// src/components/carbon/UserSkillsManager.tsx
// TASK-11: User skills management UI
import { useState, useEffect } from "react";
import {
  Grid,
  Column,
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
  TextInput,
  Select,
  SelectItem,
  Loading,
} from "@carbon/react";
import { Add, TrashCan, Checkmark, Edit } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";

interface UserSkillsManagerProps {
  userId: string;
  isOwnProfile?: boolean;
}

interface UserSkill {
  id: string;
  skill_id: string;
  skill_name: string;
  level: string;
  source: string;
  years_of_experience: number | null;
  verified_by: string | null;
  verified_at: string | null;
}

const SKILL_LEVELS = [
  { value: "none", label: "None" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

const SKILL_SOURCES = [
  { value: "self_reported", label: "Self-Reported" },
  { value: "resume_extracted", label: "Resume Extracted" },
  { value: "manager_verified", label: "Manager Verified" },
  { value: "certification", label: "Certification" },
];

export default function UserSkillsManager({ userId, isOwnProfile = false }: UserSkillsManagerProps) {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(null);
  const [notification, setNotification] = useState<{
    kind: "success" | "error" | "warning";
    title: string;
    subtitle?: string;
  } | null>(null);

  // Form state for adding/editing skills
  const [formData, setFormData] = useState({
    skill_id: "",
    level: "beginner",
    source: "self_reported",
    years_of_experience: "",
  });

  useEffect(() => {
    fetchUserSkills();
    fetchAvailableSkills();
  }, [userId]);

  const fetchUserSkills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_skills")
        .select(`
          id,
          skill_id,
          level,
          source,
          years_of_experience,
          verified_by,
          verified_at,
          skills(name)
        `)
        .eq("user_id", userId);

      if (error) throw error;

      const formatted = (data || []).map((item: any) => ({
        id: item.id,
        skill_id: item.skill_id,
        skill_name: item.skills?.name || "Unknown",
        level: item.level,
        source: item.source,
        years_of_experience: item.years_of_experience,
        verified_by: item.verified_by,
        verified_at: item.verified_at,
      }));

      setUserSkills(formatted);
    } catch (err: any) {
      console.error("Error fetching user skills:", err);
      setNotification({
        kind: "error",
        title: "Error loading skills",
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
      const duplicate = userSkills.find((s) => s.skill_id === formData.skill_id);
      if (duplicate) {
        setNotification({
          kind: "warning",
          title: "Duplicate skill",
          subtitle: "You already have this skill in your profile. Please edit the existing entry instead.",
        });
        return;
      }

      const { error } = await supabase.from("user_skills").insert({
        user_id: userId,
        skill_id: formData.skill_id,
        level: formData.level,
        source: formData.source,
        years_of_experience: formData.years_of_experience
          ? parseFloat(formData.years_of_experience)
          : null,
      });

      if (error) throw error;

      setNotification({
        kind: "success",
        title: "Skill added successfully",
      });

      setShowAddModal(false);
      setFormData({
        skill_id: "",
        level: "beginner",
        source: "self_reported",
        years_of_experience: "",
      });
      fetchUserSkills();
    } catch (err: any) {
      console.error("Error adding skill:", err);
      setNotification({
        kind: "error",
        title: "Error adding skill",
        subtitle: err.message,
      });
    }
  };

  const handleEditSkill = async () => {
    if (!selectedSkill) return;

    try {
      const { error } = await supabase
        .from("user_skills")
        .update({
          level: formData.level,
          source: formData.source,
          years_of_experience: formData.years_of_experience
            ? parseFloat(formData.years_of_experience)
            : null,
        })
        .eq("id", selectedSkill.id);

      if (error) throw error;

      setNotification({
        kind: "success",
        title: "Skill updated successfully",
      });

      setShowEditModal(false);
      setSelectedSkill(null);
      fetchUserSkills();
    } catch (err: any) {
      console.error("Error updating skill:", err);
      setNotification({
        kind: "error",
        title: "Error updating skill",
        subtitle: err.message,
      });
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm("Are you sure you want to remove this skill?")) return;

    try {
      const { error } = await supabase.from("user_skills").delete().eq("id", skillId);

      if (error) throw error;

      setNotification({
        kind: "success",
        title: "Skill removed successfully",
      });

      fetchUserSkills();
    } catch (err: any) {
      console.error("Error deleting skill:", err);
      setNotification({
        kind: "error",
        title: "Error removing skill",
        subtitle: err.message,
      });
    }
  };

  const openEditModal = (skill: UserSkill) => {
    setSelectedSkill(skill);
    setFormData({
      skill_id: skill.skill_id,
      level: skill.level,
      source: skill.source,
      years_of_experience: skill.years_of_experience?.toString() || "",
    });
    setShowEditModal(true);
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

  const getSourceBadge = (source: string, verified: boolean) => {
    if (verified) {
      return <Tag type="green" size="sm" renderIcon={Checkmark}>Verified</Tag>;
    }
    switch (source) {
      case "resume_extracted":
        return <Tag type="purple" size="sm">Resume</Tag>;
      case "certification":
        return <Tag type="blue" size="sm">Certified</Tag>;
      case "manager_verified":
        return <Tag type="green" size="sm">Manager</Tag>;
      default:
        return <Tag type="gray" size="sm">Self</Tag>;
    }
  };

  const skillOptions = availableSkills.map((skill) => ({
    id: skill.id,
    label: `${skill.name}${skill.category ? ` (${skill.category})` : ""}`,
  }));

  const headers = [
    { key: "skill_name", header: "Skill" },
    { key: "level", header: "Level" },
    { key: "years", header: "Experience" },
    { key: "source", header: "Source" },
    { key: "actions", header: "Actions" },
  ];

  const rows = userSkills.map((skill) => ({
    id: skill.id,
    skill_name: skill.skill_name,
    level: (
      <Tag type={getLevelColor(skill.level)} size="sm">
        {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
      </Tag>
    ),
    years: skill.years_of_experience ? `${skill.years_of_experience} years` : "—",
    source: getSourceBadge(skill.source, !!skill.verified_at),
    actions: isOwnProfile && !skill.verified_at ? (
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
    return <Loading withOverlay={false} description="Loading skills..." />;
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
              Skills & Expertise
            </h3>
            <p style={{ color: "var(--cds-text-secondary)", fontSize: "14px" }}>
              Manage your technical skills and proficiency levels
            </p>
          </div>
          {isOwnProfile && (
            <Button kind="primary" renderIcon={Add} onClick={() => setShowAddModal(true)}>
              Add Skill
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

        {userSkills.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              backgroundColor: "var(--cds-layer-01)",
              borderRadius: "4px",
            }}
          >
            <p style={{ color: "var(--cds-text-secondary)", marginBottom: "16px" }}>
              No skills added yet. {isOwnProfile && "Add your first skill to get started!"}
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

      {/* Add Skill Modal */}
      <Modal
        open={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
        modalHeading="Add New Skill"
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
            labelText="Proficiency Level *"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          >
            {SKILL_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value} text={level.label} />
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <TextInput
            id="years-input"
            labelText="Years of Experience"
            placeholder="e.g., 2.5"
            type="number"
            step="0.5"
            min="0"
            value={formData.years_of_experience}
            onChange={(e) =>
              setFormData({ ...formData, years_of_experience: e.target.value })
            }
          />
        </div>
        <div>
          <Select
            id="source-select"
            labelText="Source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          >
            {SKILL_SOURCES.map((source) => (
              <SelectItem key={source.value} value={source.value} text={source.label} />
            ))}
          </Select>
        </div>
      </Modal>

      {/* Edit Skill Modal */}
      <Modal
        open={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        modalHeading={`Edit Skill: ${selectedSkill?.skill_name}`}
        primaryButtonText="Save Changes"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleEditSkill}
        size="sm"
      >
        <div style={{ marginBottom: "16px" }}>
          <Select
            id="edit-level-select"
            labelText="Proficiency Level *"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          >
            {SKILL_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value} text={level.label} />
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <TextInput
            id="edit-years-input"
            labelText="Years of Experience"
            placeholder="e.g., 2.5"
            type="number"
            step="0.5"
            min="0"
            value={formData.years_of_experience}
            onChange={(e) =>
              setFormData({ ...formData, years_of_experience: e.target.value })
            }
          />
        </div>
        <div>
          <Select
            id="edit-source-select"
            labelText="Source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            disabled={!!selectedSkill?.verified_at}
          >
            {SKILL_SOURCES.map((source) => (
              <SelectItem key={source.value} value={source.value} text={source.label} />
            ))}
          </Select>
        </div>
        {selectedSkill?.verified_at && (
          <InlineNotification
            kind="info"
            title="Verified Skill"
            subtitle="This skill has been verified and some fields cannot be edited."
            lowContrast
            hideCloseButton
            style={{ marginTop: "16px" }}
          />
        )}
      </Modal>
    </>
  );
}

// Made with Bob
