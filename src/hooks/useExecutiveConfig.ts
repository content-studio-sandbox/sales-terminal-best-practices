import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ExecutiveConfig {
  // Business Value Configuration
  avgProjectValue: number;
  avgCostSavings: number;
  patentMultiplier: number;
  
  // Strategic Initiatives
  strategicInitiatives: Array<{
    name: string;
    description: string;
    priority: number;
    active: boolean;
  }>;
  
  // ROI Calculation
  roiMultiplier: number;
  
  // Talent Pipeline Targets
  highPerformerTarget: number;
  conversionTarget: number;
}

const DEFAULT_CONFIG: ExecutiveConfig = {
  avgProjectValue: 150000,
  avgCostSavings: 50000,
  patentMultiplier: 0.5,
  strategicInitiatives: [
    { name: 'AI Innovation', description: 'Drive innovation in AI and machine learning', priority: 1, active: true },
    { name: 'Cloud Excellence', description: 'Build world-class cloud solutions', priority: 2, active: true },
    { name: 'Digital Transformation', description: 'Accelerate digital transformation', priority: 3, active: true },
  ],
  roiMultiplier: 1.5,
  highPerformerTarget: 48,
  conversionTarget: 67,
};

export function useExecutiveConfig() {
  const { user } = useAuth();
  const [config, setConfig] = useState<ExecutiveConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all config entries
      const { data, error: fetchError } = await supabase
        .from('executive_config' as any)
        .select('*');

      if (fetchError) {
        console.error('Error loading config:', fetchError);
        // Use default config if table doesn't exist or has errors
        setConfig(DEFAULT_CONFIG);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        // No config exists, use defaults
        setConfig(DEFAULT_CONFIG);
        setLoading(false);
        return;
      }

      // Parse config from database
      const loadedConfig: Partial<ExecutiveConfig> = {};
      
      data.forEach((row: any) => {
        const key = row.config_key;
        const value = row.config_value;
        
        if (key && value !== null && value !== undefined) {
          loadedConfig[key as keyof ExecutiveConfig] = value;
        }
      });

      // Merge with defaults
      setConfig({ ...DEFAULT_CONFIG, ...loadedConfig });
    } catch (err) {
      console.error('Error in loadConfig:', err);
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: Partial<ExecutiveConfig>) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setSaving(true);
      setError(null);

      // Update each config key
      for (const [key, value] of Object.entries(newConfig)) {
        const { error: upsertError } = await supabase
          .from('executive_config' as any)
          .upsert({
            config_key: key,
            config_value: value,
            updated_by: user.id,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'config_key',
          });

        if (upsertError) {
          console.error(`Error saving ${key}:`, upsertError);
          throw upsertError;
        }
      }

      // Update local state
      setConfig(prev => ({ ...prev, ...newConfig }));
      return true;
    } catch (err) {
      console.error('Error saving config:', err);
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    return await saveConfig(DEFAULT_CONFIG);
  };

  return {
    config,
    loading,
    error,
    saving,
    saveConfig,
    resetToDefaults,
    refetch: loadConfig,
  };
}

// Made with Bob
