import React, { useState, useEffect } from 'react';
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextInput,
  NumberInput,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  IconButton,
  Toggle,
  InlineNotification,
} from '@carbon/react';
import { Add, TrashCan, Edit, Renew } from '@carbon/icons-react';
import { useExecutiveConfig, ExecutiveConfig } from '@/hooks/useExecutiveConfig';
import './ExecutiveSettingsModal.scss';

interface ExecutiveSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const ExecutiveSettingsModal: React.FC<ExecutiveSettingsModalProps> = ({ open, onClose }) => {
  const { config, loading, error, saving, saveConfig, resetToDefaults } = useExecutiveConfig();
  const [localConfig, setLocalConfig] = useState<ExecutiveConfig>(config);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newInitiative, setNewInitiative] = useState({ name: '', description: '', priority: 1, active: true });
  const [showAddInitiative, setShowAddInitiative] = useState(false);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSave = async () => {
    const success = await saveConfig(localConfig);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      const success = await resetToDefaults();
      if (success) {
        setLocalConfig(config);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
  };

  const handleAddInitiative = () => {
    if (!newInitiative.name.trim()) return;
    
    setLocalConfig(prev => ({
      ...prev,
      strategicInitiatives: [
        ...prev.strategicInitiatives,
        { ...newInitiative, priority: prev.strategicInitiatives.length + 1 },
      ],
    }));
    
    setNewInitiative({ name: '', description: '', priority: 1, active: true });
    setShowAddInitiative(false);
  };

  const handleRemoveInitiative = (index: number) => {
    setLocalConfig(prev => ({
      ...prev,
      strategicInitiatives: prev.strategicInitiatives.filter((_, i) => i !== index),
    }));
  };

  const handleToggleInitiative = (index: number) => {
    setLocalConfig(prev => ({
      ...prev,
      strategicInitiatives: prev.strategicInitiatives.map((init, i) =>
        i === index ? { ...init, active: !init.active } : init
      ),
    }));
  };

  return (
    <ComposedModal
      open={open}
      onClose={onClose}
      size="lg"
      className="executive-settings-modal"
    >
      <ModalHeader title="Executive Dashboard Settings" />
      
      <ModalBody>
        {saveSuccess && (
          <InlineNotification
            kind="success"
            title="Settings Saved"
            subtitle="Your configuration has been updated successfully."
            onCloseButtonClick={() => setSaveSuccess(false)}
            style={{ marginBottom: '1rem' }}
          />
        )}
        
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            style={{ marginBottom: '1rem' }}
          />
        )}

        <Tabs>
          <TabList aria-label="Settings tabs" contained>
            <Tab>Business Values</Tab>
            <Tab>Strategic Initiatives</Tab>
            <Tab>Calculations</Tab>
          </TabList>
          
          <TabPanels>
            {/* Business Values Tab */}
            <TabPanel>
              <div className="settings-section">
                <h4>Project Value Configuration</h4>
                <p className="settings-description">
                  Configure the average values used to calculate business impact metrics.
                </p>
                
                <div className="settings-grid">
                  <NumberInput
                    id="avgProjectValue"
                    label="Average Project Value ($)"
                    value={localConfig.avgProjectValue}
                    onChange={(e: any) => setLocalConfig(prev => ({ ...prev, avgProjectValue: e.imaginaryTarget.value }))}
                    min={0}
                    step={10000}
                    helperText="Average revenue generated per completed project"
                  />
                  
                  <NumberInput
                    id="avgCostSavings"
                    label="Average Cost Savings ($)"
                    value={localConfig.avgCostSavings}
                    onChange={(e: any) => setLocalConfig(prev => ({ ...prev, avgCostSavings: e.imaginaryTarget.value }))}
                    min={0}
                    step={5000}
                    helperText="Average cost savings per completed project"
                  />
                  
                  <NumberInput
                    id="patentMultiplier"
                    label="Patent Multiplier"
                    value={localConfig.patentMultiplier}
                    onChange={(e: any) => setLocalConfig(prev => ({ ...prev, patentMultiplier: e.imaginaryTarget.value }))}
                    min={0}
                    max={1}
                    step={0.1}
                    helperText="Percentage of projects that result in patents (0.0 - 1.0)"
                  />
                </div>
              </div>
            </TabPanel>

            {/* Strategic Initiatives Tab */}
            <TabPanel>
              <div className="settings-section">
                <div className="section-header">
                  <div>
                    <h4>Strategic Initiatives</h4>
                    <p className="settings-description">
                      Manage your organization's strategic initiatives. These will be tracked in the Strategic Alignment tab.
                    </p>
                  </div>
                  <Button
                    kind="primary"
                    size="sm"
                    renderIcon={Add}
                    onClick={() => setShowAddInitiative(true)}
                  >
                    Add Initiative
                  </Button>
                </div>

                {showAddInitiative && (
                  <div className="add-initiative-form">
                    <TextInput
                      id="newInitiativeName"
                      labelText="Initiative Name"
                      value={newInitiative.name}
                      onChange={(e: any) => setNewInitiative(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., AI Innovation"
                    />
                    <TextInput
                      id="newInitiativeDesc"
                      labelText="Description"
                      value={newInitiative.description}
                      onChange={(e: any) => setNewInitiative(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the initiative"
                    />
                    <div className="form-actions">
                      <Button kind="secondary" size="sm" onClick={() => setShowAddInitiative(false)}>
                        Cancel
                      </Button>
                      <Button kind="primary" size="sm" onClick={handleAddInitiative}>
                        Add
                      </Button>
                    </div>
                  </div>
                )}

                <DataTable
                  rows={localConfig.strategicInitiatives.map((init, index) => ({
                    id: `${index}`,
                    ...init,
                  }))}
                  headers={[
                    { key: 'name', header: 'Initiative Name' },
                    { key: 'description', header: 'Description' },
                    { key: 'priority', header: 'Priority' },
                    { key: 'active', header: 'Status' },
                    { key: 'actions', header: 'Actions' },
                  ]}
                >
                  {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer>
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header) => (
                              <TableHeader {...getHeaderProps({ header })} key={header.key}>
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row, index) => (
                            <TableRow {...getRowProps({ row })} key={row.id}>
                              {row.cells.map((cell) => {
                                if (cell.info.header === 'active') {
                                  return (
                                    <TableCell key={cell.id}>
                                      <Toggle
                                        id={`toggle-${row.id}`}
                                        size="sm"
                                        toggled={cell.value}
                                        onToggle={() => handleToggleInitiative(index)}
                                        labelA="Inactive"
                                        labelB="Active"
                                        hideLabel
                                      />
                                    </TableCell>
                                  );
                                }
                                if (cell.info.header === 'actions') {
                                  return (
                                    <TableCell key={cell.id}>
                                      <IconButton
                                        kind="ghost"
                                        label="Delete"
                                        onClick={() => handleRemoveInitiative(index)}
                                      >
                                        <TrashCan />
                                      </IconButton>
                                    </TableCell>
                                  );
                                }
                                return <TableCell key={cell.id}>{cell.value}</TableCell>;
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </DataTable>
              </div>
            </TabPanel>

            {/* Calculations Tab */}
            <TabPanel>
              <div className="settings-section">
                <h4>Calculation Parameters</h4>
                <p className="settings-description">
                  Configure how metrics are calculated. These multipliers affect ROI and pipeline calculations.
                </p>
                
                <div className="settings-grid">
                  <NumberInput
                    id="roiMultiplier"
                    label="ROI Multiplier"
                    value={localConfig.roiMultiplier}
                    onChange={(e: any) => setLocalConfig(prev => ({ ...prev, roiMultiplier: e.imaginaryTarget.value }))}
                    min={1}
                    max={3}
                    step={0.1}
                    helperText="Multiplier applied to completion + utilization rates"
                  />
                  
                  <NumberInput
                    id="highPerformerTarget"
                    label="High Performer Target (%)"
                    value={localConfig.highPerformerTarget}
                    onChange={(e: any) => setLocalConfig(prev => ({ ...prev, highPerformerTarget: e.imaginaryTarget.value }))}
                    min={0}
                    max={100}
                    step={1}
                    helperText="Target percentage of talent identified as high performers"
                  />
                  
                  <NumberInput
                    id="conversionTarget"
                    label="Conversion Target (%)"
                    value={localConfig.conversionTarget}
                    onChange={(e: any) => setLocalConfig(prev => ({ ...prev, conversionTarget: e.imaginaryTarget.value }))}
                    min={0}
                    max={100}
                    step={1}
                    helperText="Target conversion rate from high performers to candidates"
                  />
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>
      
      <ModalFooter>
        <Button kind="secondary" onClick={handleReset} renderIcon={Renew}>
          Reset to Defaults
        </Button>
        <Button kind="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button kind="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};

export default ExecutiveSettingsModal;

// Made with Bob
