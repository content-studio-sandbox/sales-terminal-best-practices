// src/components/carbon/CompletedLearningManager.tsx
// TASK-17: Profile — Completed Learning CRUD
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextInput,
  TextArea,
  DatePicker,
  DatePickerInput,
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
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Loading,
  InlineNotification,
  OverflowMenu,
  OverflowMenuItem,
} from "@carbon/react";
import { Add, Edit, TrashCan, Checkmark, WarningAlt, Link as LinkIcon } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";

interface CompletedLearningManagerProps {
  userId: string;
  isOwnProfile: boolean;
  onVerificationNeeded?: () => void;
}

interface LearningEntry {
  id: string;
  title: string;
  issuer: string;
  completion_date: string;
  evidence_url?: string;
  notes?: string;
  tags: string[];
  related_skills: string[];
  verified_by?: string;
  verified_at?: string;
  verifier_name?: string;
  learning_type?: string;
}

interface LearningItem {
  id: string;
  title: string;
  issuer: string;
  type: string;
  description: string;
}

export default function CompletedLearningManager({
  userId,
  isOwnProfile,
  onVerificationNeeded,
}: CompletedLearningManagerProps) {
  const [learningEntries, setLearningEntries] = useState<LearningEntry[]>([]);
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LearningEntry | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState("");

  // Form state
  const [selectedLearningItem, setSelectedLearningItem] = useState<LearningItem | null>(null);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch user's learning entries
      const { data: entriesData, error: entriesError } = await supabase
        .from("user_learning_detailed" as any)
        .select("*")
        .eq("user_id", userId)
        .order("completion_date", { ascending: false });

      if (entriesError) throw entriesError;
      setLearningEntries(entriesData || []);

      // Fetch learning items catalog
      const { data: itemsData, error: itemsError } = await supabase
        .from("learning_items" as any)
        .select("id, title, issuer, type, description")
        .order("title");

      if (itemsError) throw itemsError;
      setLearningItems(itemsData || []);

      // Fetch skills for tagging
      const { data: skillsData, error: skillsError } = await supabase
        .from("skills")
        .select("id, name, category")
        .order("name");

      if (skillsError) throw skillsError;
      setSkills(skillsData || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load learning data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (entry?: LearningEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setTitle(entry.title);
      setIssuer(entry.issuer || "");
      setCompletionDate(entry.completion_date);
      setEvidenceUrl(entry.evidence_url || "");
      setNotes(entry.notes || "");
      setTags(entry.tags || []);
      setSelectedSkills(entry.related_skills || []);
    } else {
      resetForm();
    }
    setModalOpen(true);
    setDuplicateWarning("");
  };

  const resetForm = () => {
    setEditingEntry(null);
    setSelectedLearningItem(null);
    setTitle("");
    setIssuer("");
    setCompletionDate("");
    setEvidenceUrl("");
    setNotes("");
    setTagInput("");
    setTags([]);
    setSelectedSkills([]);
  };

  const handleLearningItemSelect = (item: LearningItem | null) => {
    setSelectedLearningItem(item);
    if (item) {
      setTitle(item.title);
      setIssuer(item.issuer || "");
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const checkDuplicate = async () => {
    if (!title || !completionDate) return;

    const { data, error } = await supabase
      .from("user_learning" as any)
      .select("id")
      .eq("user_id", userId)
      .eq("title", title)
      .eq("completion_date", completionDate)
      .neq("id", editingEntry?.id || "");

    if (!error && data && data.length > 0) {
      setDuplicateWarning(`Warning: You already have a learning entry for "${title}" on ${completionDate}`);
    } else {
      setDuplicateWarning("");
    }
  };

  useEffect(() => {
    if (title && completionDate) {
      checkDuplicate();
    }
  }, [title, completionDate]);

  const handleSave = async () => {
    try {
      if (!title || !completionDate) {
        setError("Title and completion date are required");
        return;
      }

      setError("");
      setSuccess("");

      const learningData = {
        user_id: userId,
        learning_item_id: selectedLearningItem?.id || null,
        title,
        issuer: issuer || null,
        completion_date: completionDate,
        evidence_url: evidenceUrl || null,
        notes: notes || null,
        tags: tags.length > 0 ? tags : null,
        related_skills: selectedSkills.length > 0 ? selectedSkills : null,
      };

      if (editingEntry) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from("user_learning" as any)
          .update(learningData)
          .eq("id", editingEntry.id);

        if (updateError) throw updateError;
        setSuccess("Learning entry updated successfully!");
      } else {
        // Create new entry
        const { error: insertError } = await supabase
          .from("user_learning" as any)
          .insert([learningData]);

        if (insertError) throw insertError;
        setSuccess("Learning entry added successfully!");
      }

      setModalOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error("Error saving learning entry:", err);
      setError(err.message || "Failed to save learning entry");
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this learning entry?")) return;

    try {
      setError("");
      const { error: deleteError } = await supabase
        .from("user_learning" as any)
        .delete()
        .eq("id", entryId);

      if (deleteError) throw deleteError;
      setSuccess("Learning entry deleted successfully!");
      fetchData();
    } catch (err: any) {
      console.error("Error deleting learning entry:", err);
      setError(err.message || "Failed to delete learning entry");
    }
  };

  const headers = [
    { key: "title", header: "Title" },
    { key: "issuer", header: "Issuer" },
    { key: "completion_date", header: "Completion Date" },
    { key: "tags", header: "Tags" },
    { key: "skills", header: "Related Skills" },
    { key: "verification", header: "Verification" },
    { key: "actions", header: "Actions" },
  ];

  const rows = learningEntries.map((entry) => ({
    id: entry.id,
    title: (
      <div>
        <div style={{ fontWeight: 500 }}>{entry.title}</div>
        {entry.learning_type && (
          <Tag type="gray" size="sm" style={{ marginTop: "4px" }}>
            {entry.learning_type}
          </Tag>
        )}
        {entry.evidence_url && (
          <a
            href={entry.evidence_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", fontSize: "12px" }}
          >
            <LinkIcon size={16} />
            Evidence
          </a>
        )}
      </div>
    ),
    issuer: entry.issuer || "-",
    completion_date: new Date(entry.completion_date).toLocaleDateString(),
    tags: (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {entry.tags && entry.tags.length > 0 ? (
          entry.tags.map((tag, idx) => (
            <Tag key={idx} type="blue" size="sm">
              {tag}
            </Tag>
          ))
        ) : (
          <span style={{ color: "var(--cds-text-secondary)" }}>-</span>
        )}
      </div>
    ),
    skills: (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {entry.related_skills && entry.related_skills.length > 0 ? (
          entry.related_skills.slice(0, 3).map((skillId, idx) => {
            const skill = skills.find((s) => s.id === skillId);
            return skill ? (
              <Tag key={idx} type="cyan" size="sm">
                {skill.name}
              </Tag>
            ) : null;
          })
        ) : (
          <span style={{ color: "var(--cds-text-secondary)" }}>-</span>
        )}
        {entry.related_skills && entry.related_skills.length > 3 && (
          <Tag type="gray" size="sm">
            +{entry.related_skills.length - 3}
          </Tag>
        )}
      </div>
    ),
    verification: entry.verified_by ? (
      <div>
        <Tag type="green" size="sm" renderIcon={Checkmark}>
          Verified
        </Tag>
        <div style={{ fontSize: "12px", color: "var(--cds-text-secondary)", marginTop: "4px" }}>
          by {entry.verifier_name}
        </div>
      </div>
    ) : (
      <Tag type="gray" size="sm" renderIcon={WarningAlt}>
        Unverified
      </Tag>
    ),
    actions: (
      <OverflowMenu size="sm" flipped>
        <OverflowMenuItem
          itemText="Edit"
          onClick={() => handleOpenModal(entry)}
          disabled={!!entry.verified_by}
        />
        <OverflowMenuItem
          itemText="Delete"
          onClick={() => handleDelete(entry.id)}
          disabled={!!entry.verified_by}
          isDelete
        />
      </OverflowMenu>
    ),
  }));

  if (loading) {
    return <Loading withOverlay={false} description="Loading learning entries..." />;
  }

  return (
    <div>
      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          onClose={() => setError("")}
          style={{ marginBottom: "16px" }}
        />
      )}
      {success && (
        <InlineNotification
          kind="success"
          title="Success"
          subtitle={success}
          onClose={() => setSuccess("")}
          style={{ marginBottom: "16px" }}
        />
      )}

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getToolbarProps }: any) => (
          <TableContainer>
            <TableToolbar {...getToolbarProps()}>
              <TableToolbarContent>
                <TableToolbarSearch persistent placeholder="Search learning..." />
                {isOwnProfile && (
                  <Button
                    kind="primary"
                    renderIcon={Add}
                    onClick={() => handleOpenModal()}
                  >
                    Add Learning
                  </Button>
                )}
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} size="md">
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
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headers.length} style={{ textAlign: "center", padding: "32px" }}>
                      <p style={{ color: "var(--cds-text-secondary)" }}>
                        No learning entries yet. {isOwnProfile && "Click 'Add Learning' to get started!"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row: any) => (
                    <TableRow key={row.id} {...getRowProps({ row })}>
                      {row.cells.map((cell: any) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      <Modal
        open={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        modalHeading={editingEntry ? "Edit Learning Entry" : "Add Learning Entry"}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleSave}
        size="lg"
      >
        {duplicateWarning && (
          <InlineNotification
            kind="warning"
            title="Duplicate Warning"
            subtitle={duplicateWarning}
            lowContrast
            style={{ marginBottom: "16px" }}
          />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <ComboBox
            id="learning-item-select"
            titleText="Select from Catalog (Optional)"
            placeholder="Search learning items..."
            items={learningItems}
            itemToString={(item: LearningItem) => (item ? `${item.title} - ${item.issuer}` : "")}
            onChange={({ selectedItem }: any) => handleLearningItemSelect(selectedItem)}
            selectedItem={selectedLearningItem}
          />

          <TextInput
            id="title"
            labelText="Title *"
            placeholder="e.g., Python for Beginners"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            required
          />

          <TextInput
            id="issuer"
            labelText="Issuer"
            placeholder="e.g., IBM, Coursera, LinkedIn Learning"
            value={issuer}
            onChange={(e: any) => setIssuer(e.target.value)}
          />

          <DatePicker
            datePickerType="single"
            value={completionDate}
            onChange={(dates: any) => {
              if (dates && dates.length > 0) {
                setCompletionDate(dates[0].toISOString().split("T")[0]);
              }
            }}
          >
            <DatePickerInput
              id="completion-date"
              labelText="Completion Date *"
              placeholder="mm/dd/yyyy"
              required
            />
          </DatePicker>

          <TextInput
            id="evidence-url"
            labelText="Evidence URL (Optional)"
            placeholder="https://example.com/certificate"
            value={evidenceUrl}
            onChange={(e: any) => setEvidenceUrl(e.target.value)}
          />

          <TextArea
            id="notes"
            labelText="Notes"
            placeholder="Additional notes about this learning..."
            value={notes}
            onChange={(e: any) => setNotes(e.target.value)}
            rows={3}
          />

          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <TextInput
                id="tag-input"
                labelText="Tags"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e: any) => setTagInput(e.target.value)}
                onKeyPress={(e: any) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                style={{ flex: 1 }}
              />
              <Button
                kind="secondary"
                size="md"
                onClick={handleAddTag}
                style={{ marginTop: "28px" }}
              >
                Add Tag
              </Button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {tags.map((tag, idx) => (
                <Tag key={idx} type="blue" filter onClose={() => handleRemoveTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          <ComboBox
            id="skills-select"
            titleText="Related Skills (for matching)"
            placeholder="Select skills this learning helps develop..."
            items={skills}
            itemToString={(item: any) => (item ? `${item.name} (${item.category})` : "")}
            onChange={({ selectedItem }: any) => {
              if (selectedItem && !selectedSkills.includes(selectedItem.id)) {
                setSelectedSkills([...selectedSkills, selectedItem.id]);
              }
            }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {selectedSkills.map((skillId, idx) => {
              const skill = skills.find((s) => s.id === skillId);
              return skill ? (
                <Tag
                  key={idx}
                  type="cyan"
                  filter
                  onClose={() => setSelectedSkills(selectedSkills.filter((id) => id !== skillId))}
                >
                  {skill.name}
                </Tag>
              ) : null;
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Made with Bob
