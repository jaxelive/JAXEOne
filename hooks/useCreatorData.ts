
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';

export interface CreatorData {
  id: string;
  first_name: string;
  last_name: string;
  creator_handle: string;
  email: string;
  profile_picture_url: string | null;
  avatar_url: string | null;
  region: string | null;
  creator_type: string[] | null;
  diamonds_monthly: number;
  total_diamonds: number;
  diamonds_30d: number;
  live_days_30d: number;
  live_duration_seconds_30d: number;
  hours_streamed: number;
  graduation_status: string | null;
  silver_target: number | null;
  gold_target: number | null;
  assigned_manager_id: string | null;
  is_active: boolean;
}

export interface CreatorStats {
  monthlyDiamonds: number;
  totalDiamonds: number;
  liveDays: number;
  liveHours: number;
  diamondsToday: number;
  streak: number;
  currentProgress: number;
  remaining: number;
  nextTarget: string;
  targetAmount: number;
  currentStatus: string;
}

export function useCreatorData(creatorHandle?: string) {
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCreatorData();
  }, [creatorHandle]);

  const fetchCreatorData = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('creators')
        .select('*')
        .eq('is_active', true);

      if (creatorHandle) {
        query = query.eq('creator_handle', creatorHandle);
      }

      const { data, error: fetchError } = await query.single();

      if (fetchError) {
        console.error('Error fetching creator data:', fetchError);
        setError(fetchError.message);
        return;
      }

      if (data) {
        console.log('Creator data fetched successfully:', data.creator_handle);
        setCreator(data as CreatorData);
      }
    } catch (err) {
      console.error('Unexpected error fetching creator data:', err);
      setError('Failed to fetch creator data');
    } finally {
      setLoading(false);
    }
  };

  const getCreatorStats = (): CreatorStats | null => {
    if (!creator) return null;

    const liveHours = Math.floor(creator.live_duration_seconds_30d / 3600);
    const silverTarget = creator.silver_target || 200000;
    const goldTarget = creator.gold_target || 500000;
    
    let nextTarget = 'Silver';
    let targetAmount = silverTarget;
    
    if (creator.total_diamonds >= silverTarget) {
      nextTarget = 'Gold';
      targetAmount = goldTarget;
    }

    const remaining = Math.max(0, targetAmount - creator.total_diamonds);
    const currentProgress = targetAmount > 0 
      ? ((creator.total_diamonds / targetAmount) * 100).toFixed(1)
      : '0.0';

    return {
      monthlyDiamonds: creator.diamonds_monthly || 0,
      totalDiamonds: creator.total_diamonds || 0,
      liveDays: creator.live_days_30d || 0,
      liveHours: liveHours,
      diamondsToday: creator.diamonds_30d || 0,
      streak: creator.live_days_30d || 0,
      currentProgress: parseFloat(currentProgress),
      remaining: remaining,
      nextTarget: nextTarget,
      targetAmount: targetAmount,
      currentStatus: creator.graduation_status || 'Rookie (New)',
    };
  };

  return {
    creator,
    loading,
    error,
    stats: getCreatorStats(),
    refetch: fetchCreatorData,
  };
}
