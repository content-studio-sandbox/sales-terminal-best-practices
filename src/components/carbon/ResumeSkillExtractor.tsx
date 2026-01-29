import { useState } from "react";
import { Button, FileUploader, Loading, Tag } from "@carbon/react";

interface ResumeSkillExtractorProps {
  onSkillsExtracted: (skills: string[]) => void;
  extractionDelay?: number; // Allow tests to override delay
}

// Exported for testing
export const mockSkillExtraction = () => {
  const mockSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
    'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication',
    'Data Analysis', 'SQL', 'Machine Learning', 'Cloud Computing', 'Docker'
  ];
  
  // Randomly select 3-7 skills
  const numSkills = Math.floor(Math.random() * 5) + 3;
  return mockSkills
    .sort(() => 0.5 - Math.random())
    .slice(0, numSkills);
};

export default function ResumeSkillExtractor({
  onSkillsExtracted,
  extractionDelay = 2000
}: ResumeSkillExtractorProps) {
  const [extracting, setExtracting] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);

  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    
    // Simulate processing time
    setTimeout(() => {
      const selectedSkills = mockSkillExtraction();
      setExtractedSkills(selectedSkills);
      setExtracting(false);
    }, extractionDelay);
  };

  const handleAddAll = () => {
    onSkillsExtracted(extractedSkills);
    setExtractedSkills([]);
  };

  const handleDismiss = () => {
    setExtractedSkills([]);
  };
  return (
    <div style={{ padding: '16px' }}>
      <h4 style={{ marginBottom: '16px' }}>Extract Skills from Resume</h4>
      <FileUploader
        labelTitle="Upload resume"
        labelDescription="Select or drop PDF file here"
        buttonLabel="Choose file"
        filenameStatus="edit"
        accept={['.pdf']}
        multiple={false}
        onChange={(e) => handleFileUpload(e)}
      />
      {extracting && (
        <div style={{ marginTop: '16px' }}>
          <Loading withOverlay={false} description="Extracting skills from resume..." />
        </div>
      )}
      {extractedSkills.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h5 style={{ marginBottom: '8px' }}>Extracted Skills:</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {extractedSkills.map((skill, index) => (
              <Tag key={index} type="blue" size="sm">
                {skill}
              </Tag>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button size="sm" onClick={handleAddAll}>
              Add All Skills
            </Button>
            <Button kind="secondary" size="sm" onClick={handleDismiss}>
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}