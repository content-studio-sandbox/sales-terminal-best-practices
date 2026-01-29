/**
 * Database Type Definitions
 * Generated for Supabase schema
 */

// ============================================================================
// Core User Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  display_name?: string;
  role?: string;
  role_id?: string;
  weekly_availability?: number;
  interests?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  skills: UserSkill[];
  products: UserProduct[];
  careerPaths: UserCareerPath[];
}

// ============================================================================
// Skill Types
// ============================================================================

export interface Skill {
  id: string;
  name: string;
  category?: string;
  created_at?: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_experience?: number;
  last_used?: string;
  notes?: string;
  skill?: Skill;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface UserProduct {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  created_at?: string;
}

// ============================================================================
// Role Types
// ============================================================================

export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

// ============================================================================
// Career Path Types
// ============================================================================

export interface CareerPath {
  id: string;
  name: string;
  description?: string;
  required_skills?: string[];
  created_at?: string;
}

export interface UserCareerPath {
  id: string;
  user_id: string;
  path_id: string;
  rank?: number;
  path?: CareerPath;
  created_at?: string;
}

// ============================================================================
// Project Types
// ============================================================================

export interface Project {
  id: string;
  name: string;
  description?: string;
  pm_id?: string;
  status?: 'planning' | 'in progress' | 'complete' | 'on hold';
  deadline?: string;
  ambition_name?: string;
  skills?: string[];
  objectives?: string[];
  roles?: ProjectRole[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectRole {
  role: string;
  description: string;
  count: number;
}

export interface ProjectSkill {
  id: string;
  project_id: string;
  skill_id: string;
  required_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  priority?: 'required' | 'preferred' | 'nice-to-have';
  skill?: Skill;
  created_at?: string;
}

export interface ProjectContributor {
  id: string;
  project_id: string;
  user_id: string;
  project_role?: string;
  joined_at?: string;
  project?: Project;
  user?: User;
}

// ============================================================================
// Ambition Types
// ============================================================================

export interface Ambition {
  id: string;
  name: string;
  title?: string;
  description?: string;
  leader_id?: string;
  status?: 'active' | 'completed' | 'on hold';
  expected_roi?: number;
  budget_allocated?: number;
  target_completion?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Application Types
// ============================================================================

export interface Application {
  id: string;
  user_id: string;
  project_id: string;
  status?: 'pending' | 'approved' | 'rejected';
  message?: string;
  applied_role?: string;
  created_at?: string;
  updated_at?: string;
  project?: Project;
  user?: User;
}

// ============================================================================
// Invitation Types
// ============================================================================

export interface Invitation {
  id: string;
  project_id: string;
  user_id: string;
  status?: 'pending' | 'accepted' | 'declined';
  invited_by?: string;
  created_at?: string;
  updated_at?: string;
  project?: Project;
  user?: User;
}

// ============================================================================
// Learning Types
// ============================================================================

export interface LearningItem {
  id: string;
  title: string;
  description?: string;
  issuer?: string;
  type?: 'course' | 'certification' | 'workshop' | 'conference' | 'other';
  duration_hours?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CompletedLearning {
  id: string;
  user_id: string;
  learning_item_id?: string;
  title: string;
  issuer?: string;
  completion_date?: string;
  evidence_url?: string;
  notes?: string;
  tags?: string[];
  skill_ids?: string[];
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Resume Types
// ============================================================================

export interface Resume {
  id: string;
  user_id?: string;
  candidate_name?: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  notes?: string;
  rating?: number;
  stage?: string;
  uploaded_by?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Task Types (for InternProjectBoard)
// ============================================================================

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  uploaded_by?: string;
  created_at?: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface StrategicAlignment {
  initiative: string;
  projectCount: number;
  completionRate: number;
  impact: 'high' | 'medium' | 'low';
}

export interface TalentPipelineMetric {
  role: string;
  available: number;
  needed: number;
  gap: number;
}

export interface BusinessImpact {
  category: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ExecutiveMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalValue: number;
  costSavings: number;
  patentsFiled: number;
  strategicAlignments: StrategicAlignment[];
  talentPipeline: TalentPipelineMetric[];
  businessImpacts: BusinessImpact[];
}

// ============================================================================
// AI/Matching Types
// ============================================================================

export interface AiMatch {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning?: string;
}

export interface FitAnalysisRequest {
  candidateIds: string[];
  projectId?: string;
  roleDescription?: string;
  customJd?: string;
}

export interface FitAnalysisResponse {
  matches: AiMatch[];
  timestamp: string;
}

// ============================================================================
// Feedback Types
// ============================================================================

export interface Feedback {
  id: string;
  user_id: string;
  category: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface NotificationState {
  kind: 'success' | 'error' | 'warning' | 'info';
  title: string;
  subtitle: string;
}

// ============================================================================
// UI Component Types
// ============================================================================

export interface DropdownOption {
  id: string;
  label: string;
  text?: string;
}

export interface KpiData {
  totalUsers?: number;
  totalProjects?: number;
  completedProjects?: number;
  activeProjects?: number;
}

// ============================================================================
// Supabase Response Types
// ============================================================================

export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// ============================================================================
// Form Data Types
// ============================================================================

export interface AmbitionFormData {
  name: string;
  description: string;
  leader_id: string;
  expected_roi: number;
  budget_allocated: number;
  target_completion: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  ambition_name: string;
  deadline: string;
  objectives: string[];
  roles: ProjectRole[];
  skills: string[];
}

export interface ProfileFormData {
  display_name: string;
  role_id: string;
  skill_ids: string[];
  product_ids: string[];
  interests: string;
  weekly_availability: number;
}

// ============================================================================
// Export all types
// ============================================================================

export type {
  // Re-export for convenience
  User as DatabaseUser,
  Project as DatabaseProject,
  Ambition as DatabaseAmbition,
  Application as DatabaseApplication,
};

// Made with Bob
