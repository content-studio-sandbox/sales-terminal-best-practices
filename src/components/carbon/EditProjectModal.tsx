import { useState, useEffect } from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TextInput,
  TextArea,
  ComboBox,
  Form,
  Stack,
  InlineNotification,
  NumberInput,
  Tag,
  Grid,
  Column
} from "@carbon/react";
import { supabase } from "@/integrations/supabase/client";

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onUpdate: () => void;
}

export default function EditProjectModal({ open, onOpenChange, project, onUpdate }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not_started',
    objectives: '',
    hours_per_week: '40',
    business_value: 0,
    expected_roi: 0,
    tags: [] as string[],
    success_metrics: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customTag, setCustomTag] = useState('');

  useEffect(() => {
    if (project && open) {
      setFormData({
        title: project.name || '',
        description: project.description || '',
        status: project.status || 'not started',
        objectives: project.objectives || '',
        hours_per_week: project.hours_per_week?.toString() || '40',
        business_value: project.business_value || 0,
        expected_roi: project.roi_contribution || 0,
        tags: project.tags || [],
        success_metrics: project.success_metrics || ''
      });
    }
  }, [project, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.title,
          description: formData.description,
          status: formData.status as 'not started' | 'in progress' | 'complete',
          objectives: formData.objectives,
          hours_per_week: parseInt(formData.hours_per_week) || 40,
          business_value: formData.business_value || 0,
          roi_contribution: formData.expected_roi || 0,
          tags: formData.tags.length > 0 ? formData.tags : null,
          success_metrics: formData.success_metrics || null
        })
        .eq('id', project.id);

      if (error) throw error;

      onUpdate();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { id: 'not started', text: 'Not Started' },
    { id: 'in progress', text: 'In Progress' },
    { id: 'complete', text: 'Complete' }
  ];

  return (
    <ComposedModal
      open={open}
      onClose={() => onOpenChange(false)}
      size="md"
    >
      <ModalHeader>
        <h3>Edit Project</h3>
      </ModalHeader>
      <ModalBody>
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            style={{ marginBottom: '16px' }}
          />
        )}
        <Form onSubmit={handleSubmit}>
          <Stack gap={6}>
            <TextInput
              id="title"
              labelText="Project Title *"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter project title"
              required
            />
            
            <TextArea
              id="description"
              labelText="Description *"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project"
              rows={4}
              required
            />

            <ComboBox
              id="status"
              items={statusOptions}
              titleText="Project Status"
              selectedItem={statusOptions.find(opt => opt.id === formData.status)}
              onChange={({ selectedItem }) => 
                setFormData(prev => ({ ...prev, status: selectedItem?.id || 'not started' }))
              }
            />

            <TextArea
              id="objectives"
              labelText="Project Objectives"
              value={formData.objectives}
              onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
              placeholder="List the main objectives"
              rows={3}
            />

            {/* Business Value & ROI Section */}
            <Grid>
              <Column sm={4} md={4} lg={8}>
                <NumberInput
                  id="business-value"
                  label="Business Value ($)"
                  helperText="Estimated business value in dollars"
                  min={0}
                  step={1000}
                  value={formData.business_value}
                  onChange={(e, { value }) => setFormData(prev => ({
                    ...prev,
                    business_value: typeof value === 'number' ? value : (parseFloat(value) || 0)
                  }))}
                  invalidText="Please enter a valid number"
                />
              </Column>
              <Column sm={4} md={4} lg={8}>
                <NumberInput
                  id="expected-roi"
                  label="Expected ROI (%)"
                  helperText="Expected return on investment percentage"
                  min={0}
                  max={1000}
                  step={5}
                  value={formData.expected_roi}
                  onChange={(e, { value }) => setFormData(prev => ({
                    ...prev,
                    expected_roi: typeof value === 'number' ? value : (parseFloat(value) || 0)
                  }))}
                  invalidText="Please enter a valid percentage"
                />
              </Column>
            </Grid>

            {/* Project Tags Section */}
            <div>
              <label style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Project Tags
              </label>
              
              {/* Selected Tags */}
              <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    type="cyan"
                    filter
                    onClose={() => {
                      setFormData(prev => ({
                        ...prev,
                        tags: prev.tags.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>

              {/* Add Tags */}
              <Grid>
                <Column sm={4} md={6} lg={8}>
                  <TextInput
                    id="custom-tag"
                    labelText=""
                    placeholder="Add a tag (press Enter or click Add)"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && customTag.trim()) {
                        e.preventDefault();
                        if (!formData.tags.includes(customTag.trim())) {
                          setFormData(prev => ({
                            ...prev,
                            tags: [...prev.tags, customTag.trim()]
                          }));
                          setCustomTag('');
                        }
                      }
                    }}
                  />
                </Column>
                <Column sm={4} md={2} lg={4}>
                  <Button
                    kind="secondary"
                    size="md"
                    disabled={!customTag.trim()}
                    onClick={() => {
                      if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
                        setFormData(prev => ({
                          ...prev,
                          tags: [...prev.tags, customTag.trim()]
                        }));
                        setCustomTag('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </Column>
              </Grid>
            </div>

            {/* Success Metrics Section */}
            <TextArea
              id="success-metrics"
              labelText="Success Metrics"
              helperText="Define how success will be measured for this project"
              value={formData.success_metrics}
              onChange={(e) => setFormData(prev => ({ ...prev, success_metrics: e.target.value }))}
              placeholder="e.g., 95% customer satisfaction, 50% reduction in processing time, $100K cost savings"
              rows={3}
            />

            <TextInput
              id="hours-per-week"
              labelText="Time Commitment (hours per week)"
              type="number"
              min="1"
              max="168"
              value={formData.hours_per_week}
              onChange={(e) => setFormData(prev => ({ ...prev, hours_per_week: e.target.value }))}
              placeholder="40"
            />
          </Stack>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button kind="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Updating...' : 'Update Project'}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
}