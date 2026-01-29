// src/components/carbon/LearningCatalogManager.tsx
// TASK-19: Presets & CSV import (optional)
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextInput,
  TextArea,
  Select,
  SelectItem,
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
  FileUploader,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@carbon/react";
import { Add, Download, Upload, TrashCan, Edit } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";

interface LearningCatalogManagerProps {
  isAdmin: boolean;
}

interface LearningItem {
  id: string;
  title: string;
  description?: string;
  issuer?: string;
  type: string;
  duration_hours?: number;
  url?: string;
  tags: string[];
  difficulty_level?: string;
  is_preset: boolean;
}

export default function LearningCatalogManager({ isAdmin }: LearningCatalogManagerProps) {
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LearningItem | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issuer, setIssuer] = useState("");
  const [type, setType] = useState("course");
  const [durationHours, setDurationHours] = useState("");
  const [url, setUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState("beginner");
  const [isPreset, setIsPreset] = useState(false);

  useEffect(() => {
    fetchLearningItems();
  }, []);

  const fetchLearningItems = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("learning_items" as any)
        .select("*")
        .order("title");

      if (fetchError) throw fetchError;
      setLearningItems(data || []);
    } catch (err: any) {
      console.error("Error fetching learning items:", err);
      setError(err.message || "Failed to load learning catalog");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: LearningItem) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title);
      setDescription(item.description || "");
      setIssuer(item.issuer || "");
      setType(item.type);
      setDurationHours(item.duration_hours?.toString() || "");
      setUrl(item.url || "");
      setTags(item.tags || []);
      setDifficultyLevel(item.difficulty_level || "beginner");
      setIsPreset(item.is_preset);
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setIssuer("");
    setType("course");
    setDurationHours("");
    setUrl("");
    setTagInput("");
    setTags([]);
    setDifficultyLevel("beginner");
    setIsPreset(false);
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

  const handleSave = async () => {
    try {
      if (!title) {
        setError("Title is required");
        return;
      }

      setError("");
      setSuccess("");

      const itemData = {
        title,
        description: description || null,
        issuer: issuer || null,
        type,
        duration_hours: durationHours ? parseInt(durationHours) : null,
        url: url || null,
        tags: tags.length > 0 ? tags : null,
        difficulty_level: difficultyLevel,
        is_preset: isPreset,
      };

      if (editingItem) {
        const { error: updateError } = await supabase
          .from("learning_items" as any)
          .update(itemData)
          .eq("id", editingItem.id);

        if (updateError) throw updateError;
        setSuccess("Learning item updated successfully!");
      } else {
        const { error: insertError } = await supabase
          .from("learning_items" as any)
          .insert([itemData]);

        if (insertError) throw insertError;
        setSuccess("Learning item added successfully!");
      }

      setModalOpen(false);
      resetForm();
      fetchLearningItems();
    } catch (err: any) {
      console.error("Error saving learning item:", err);
      setError(err.message || "Failed to save learning item");
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this learning item?")) return;

    try {
      setError("");
      const { error: deleteError } = await supabase
        .from("learning_items" as any)
        .delete()
        .eq("id", itemId);

      if (deleteError) throw deleteError;
      setSuccess("Learning item deleted successfully!");
      fetchLearningItems();
    } catch (err: any) {
      console.error("Error deleting learning item:", err);
      setError(err.message || "Failed to delete learning item");
    }
  };

  const handleCsvFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      parseCsvPreview(file);
    }
  };

  const parseCsvPreview = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());
      
      if (lines.length < 2) {
        setError("CSV file must have at least a header row and one data row");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim());
      const preview = lines.slice(1, 6).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const row: any = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || "";
        });
        return row;
      });

      setCsvPreview(preview);
    } catch (err: any) {
      console.error("Error parsing CSV:", err);
      setError("Failed to parse CSV file");
    }
  };

  const handleCsvImport = async () => {
    if (!csvFile) {
      setError("Please select a CSV file");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const text = await csvFile.text();
      const lines = text.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      const items = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const row: any = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || "";
        });

        // Map CSV columns to database fields
        const item = {
          title: row.title || row.name || "",
          description: row.description || null,
          issuer: row.issuer || row.provider || null,
          type: row.type || "course",
          duration_hours: row.duration_hours || row.duration ? parseInt(row.duration_hours || row.duration) : null,
          url: row.url || row.link || null,
          tags: row.tags ? row.tags.split(";").map((t: string) => t.trim()) : null,
          difficulty_level: row.difficulty_level || row.difficulty || "beginner",
          is_preset: row.is_preset === "true" || row.is_preset === "1",
        };

        if (item.title) {
          items.push(item);
        }
      }

      if (items.length === 0) {
        setError("No valid items found in CSV");
        return;
      }

      const { error: insertError } = await supabase
        .from("learning_items" as any)
        .insert(items);

      if (insertError) throw insertError;

      setSuccess(`Successfully imported ${items.length} learning item(s)!`);
      setCsvImportOpen(false);
      setCsvFile(null);
      setCsvPreview([]);
      fetchLearningItems();
    } catch (err: any) {
      console.error("Error importing CSV:", err);
      setError(err.message || "Failed to import CSV");
    }
  };

  const handleExportCsv = () => {
    const headers = ["title", "description", "issuer", "type", "duration_hours", "url", "tags", "difficulty_level", "is_preset"];
    const csvContent = [
      headers.join(","),
      ...learningItems.map((item) =>
        [
          `"${item.title}"`,
          `"${item.description || ""}"`,
          `"${item.issuer || ""}"`,
          item.type,
          item.duration_hours || "",
          `"${item.url || ""}"`,
          `"${(item.tags || []).join(";")}"`,
          item.difficulty_level || "",
          item.is_preset ? "true" : "false",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learning-catalog-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const headers = [
    { key: "title", header: "Title" },
    { key: "issuer", header: "Issuer" },
    { key: "type", header: "Type" },
    { key: "duration", header: "Duration" },
    { key: "difficulty", header: "Difficulty" },
    { key: "tags", header: "Tags" },
    { key: "preset", header: "Preset" },
    { key: "actions", header: "Actions" },
  ];

  const rows = learningItems.map((item) => ({
    id: item.id,
    title: (
      <div>
        <div style={{ fontWeight: 500 }}>{item.title}</div>
        {item.description && (
          <div style={{ fontSize: "12px", color: "var(--cds-text-secondary)", marginTop: "4px" }}>
            {item.description.slice(0, 100)}
            {item.description.length > 100 && "..."}
          </div>
        )}
      </div>
    ),
    issuer: item.issuer || "-",
    type: <Tag type="blue" size="sm">{item.type}</Tag>,
    duration: item.duration_hours ? `${item.duration_hours}h` : "-",
    difficulty: item.difficulty_level ? (
      <Tag
        type={
          item.difficulty_level === "expert"
            ? "red"
            : item.difficulty_level === "advanced"
            ? "purple"
            : item.difficulty_level === "intermediate"
            ? "cyan"
            : "gray"
        }
        size="sm"
      >
        {item.difficulty_level}
      </Tag>
    ) : (
      "-"
    ),
    tags: (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {item.tags && item.tags.length > 0 ? (
          item.tags.slice(0, 3).map((tag, idx) => (
            <Tag key={idx} type="blue" size="sm">
              {tag}
            </Tag>
          ))
        ) : (
          <span style={{ color: "var(--cds-text-secondary)" }}>-</span>
        )}
        {item.tags && item.tags.length > 3 && (
          <Tag type="gray" size="sm">
            +{item.tags.length - 3}
          </Tag>
        )}
      </div>
    ),
    preset: item.is_preset ? (
      <Tag type="green" size="sm">
        Yes
      </Tag>
    ) : (
      <Tag type="gray" size="sm">
        No
      </Tag>
    ),
    actions: isAdmin ? (
      <OverflowMenu size="sm" flipped>
        <OverflowMenuItem itemText="Edit" onClick={() => handleOpenModal(item)} />
        <OverflowMenuItem itemText="Delete" onClick={() => handleDelete(item.id)} isDelete />
      </OverflowMenu>
    ) : null,
  }));

  if (loading) {
    return <Loading withOverlay={false} description="Loading learning catalog..." />;
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
                <TableToolbarSearch persistent placeholder="Search learning items..." />
                <Button kind="secondary" renderIcon={Download} onClick={handleExportCsv}>
                  Export CSV
                </Button>
                {isAdmin && (
                  <>
                    <Button kind="secondary" renderIcon={Upload} onClick={() => setCsvImportOpen(true)}>
                      Import CSV
                    </Button>
                    <Button kind="primary" renderIcon={Add} onClick={() => handleOpenModal()}>
                      Add Item
                    </Button>
                  </>
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
                        No learning items yet. {isAdmin && "Click 'Add Item' to get started!"}
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

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        modalHeading={editingItem ? "Edit Learning Item" : "Add Learning Item"}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleSave}
        size="lg"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextInput
            id="title"
            labelText="Title *"
            placeholder="e.g., Python for Beginners"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            required
          />

          <TextArea
            id="description"
            labelText="Description"
            placeholder="Brief description of the learning item..."
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            rows={3}
          />

          <TextInput
            id="issuer"
            labelText="Issuer/Provider"
            placeholder="e.g., IBM, Coursera, LinkedIn Learning"
            value={issuer}
            onChange={(e: any) => setIssuer(e.target.value)}
          />

          <Select
            id="type"
            labelText="Type"
            value={type}
            onChange={(e: any) => setType(e.target.value)}
          >
            <SelectItem value="course" text="Course" />
            <SelectItem value="certification" text="Certification" />
            <SelectItem value="workshop" text="Workshop" />
            <SelectItem value="bootcamp" text="Bootcamp" />
            <SelectItem value="tutorial" text="Tutorial" />
            <SelectItem value="book" text="Book" />
            <SelectItem value="other" text="Other" />
          </Select>

          <TextInput
            id="duration"
            labelText="Duration (hours)"
            type="number"
            placeholder="e.g., 20"
            value={durationHours}
            onChange={(e: any) => setDurationHours(e.target.value)}
          />

          <Select
            id="difficulty"
            labelText="Difficulty Level"
            value={difficultyLevel}
            onChange={(e: any) => setDifficultyLevel(e.target.value)}
          >
            <SelectItem value="beginner" text="Beginner" />
            <SelectItem value="intermediate" text="Intermediate" />
            <SelectItem value="advanced" text="Advanced" />
            <SelectItem value="expert" text="Expert" />
          </Select>

          <TextInput
            id="url"
            labelText="URL"
            placeholder="https://example.com/course"
            value={url}
            onChange={(e: any) => setUrl(e.target.value)}
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
              <Button kind="secondary" size="md" onClick={handleAddTag} style={{ marginTop: "28px" }}>
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
        </div>
      </Modal>

      {/* CSV Import Modal */}
      <Modal
        open={csvImportOpen}
        onRequestClose={() => {
          setCsvImportOpen(false);
          setCsvFile(null);
          setCsvPreview([]);
        }}
        modalHeading="Import Learning Items from CSV"
        primaryButtonText="Import"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleCsvImport}
        size="lg"
      >
        <div style={{ marginBottom: "16px" }}>
          <p style={{ marginBottom: "12px" }}>
            Upload a CSV file with the following columns:
          </p>
          <code style={{ display: "block", padding: "8px", backgroundColor: "var(--cds-layer-01)", borderRadius: "4px" }}>
            title, description, issuer, type, duration_hours, url, tags, difficulty_level, is_preset
          </code>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "var(--cds-text-secondary)" }}>
            • Tags should be semicolon-separated (e.g., "python;programming;basics")<br />
            • is_preset should be "true" or "false"<br />
            • Only title is required
          </p>
        </div>

        <FileUploader
          labelTitle="Upload CSV file"
          labelDescription="Max file size is 5MB"
          buttonLabel="Select file"
          filenameStatus="edit"
          accept={[".csv"]}
          onChange={handleCsvFileChange}
        />

        {csvPreview.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <h5>Preview (first 5 rows):</h5>
            <div style={{ overflowX: "auto", marginTop: "8px" }}>
              <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {Object.keys(csvPreview[0]).map((key) => (
                      <th key={key} style={{ padding: "8px", borderBottom: "1px solid var(--cds-border-subtle)", textAlign: "left" }}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvPreview.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((value: any, vidx) => (
                        <td key={vidx} style={{ padding: "8px", borderBottom: "1px solid var(--cds-border-subtle)" }}>
                          {String(value).slice(0, 50)}
                          {String(value).length > 50 && "..."}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Made with Bob
