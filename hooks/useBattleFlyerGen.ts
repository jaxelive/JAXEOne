
import { useState, useCallback } from 'react';
import { supabase } from '@/app/integrations/supabase/client';

export type BattleFlyerParams = {
  title: string;
  creatorName: string;
  opponentName: string;
  battleDate: string;
  image: { uri: string; name?: string; type?: string };
};

export type BattleFlyerResult = {
  url: string;
  path: string;
  width: number;
  height: number;
  duration_ms: number;
};

type State =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: BattleFlyerResult; error: null }
  | { status: 'error'; data: null; error: string };

export function useBattleFlyerGen() {
  const [state, setState] = useState<State>({ status: 'idle', data: null, error: null });

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  const generate = useCallback(async (params: BattleFlyerParams): Promise<BattleFlyerResult | null> => {
    console.log('Starting flyer generation with params:', {
      title: params.title,
      creatorName: params.creatorName,
      opponentName: params.opponentName,
      battleDate: params.battleDate,
      hasImage: !!params.image.uri
    });

    if (!params.title.trim() || params.title.length > 40) {
      setState({ status: 'error', data: null, error: 'Title must be 1-40 characters.' });
      return null;
    }

    if (!params.creatorName.trim() || params.creatorName.length > 40) {
      setState({ status: 'error', data: null, error: 'Creator name must be 1-40 characters.' });
      return null;
    }

    if (!params.opponentName.trim() || params.opponentName.length > 40) {
      setState({ status: 'error', data: null, error: 'Opponent name must be 1-40 characters.' });
      return null;
    }

    if (!params.battleDate.trim()) {
      setState({ status: 'error', data: null, error: 'Battle date is required.' });
      return null;
    }

    if (!params.image.uri) {
      setState({ status: 'error', data: null, error: 'Face photo is required.' });
      return null;
    }

    setState({ status: 'loading', data: null, error: null });

    try {
      console.log('Getting Supabase session...');
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated. Please log in again.');
      }

      console.log('Creating FormData...');
      const form = new FormData();
      form.append('title', params.title);
      form.append('creatorName', params.creatorName);
      form.append('opponentName', params.opponentName);
      form.append('battleDate', params.battleDate);
      form.append('image', {
        uri: params.image.uri,
        name: params.image.name ?? 'photo.jpg',
        type: params.image.type ?? 'image/jpeg',
      } as any);

      const url = `${supabase.supabaseUrl}/functions/v1/generate-battle-flyer`;
      console.log('Calling edge function:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: form,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to generate flyer';
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          errorMessage = errorData.detail || errorData.error || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json() as BattleFlyerResult;
      console.log('Flyer generated successfully:', result);
      setState({ status: 'success', data: result, error: null });
      return result;
    } catch (err: any) {
      const message = err?.message ?? 'Unknown error occurred';
      console.error('Error generating flyer:', message, err);
      setState({ status: 'error', data: null, error: message });
      return null;
    }
  }, []);

  const loading = state.status === 'loading';
  const error = state.status === 'error' ? state.error : null;
  const data = state.status === 'success' ? state.data : null;

  return { generate, loading, error, data, reset };
}
