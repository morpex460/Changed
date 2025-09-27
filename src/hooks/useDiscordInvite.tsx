import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface DiscordInviteData {
  invite_url: string;
  code: string;
}

interface DiscordInviteState {
  inviteUrl: string | null;
  isLoading: boolean;
  error: string | null;
  hasRequested: boolean;
}

export const useDiscordInvite = () => {
  const [state, setState] = useState<DiscordInviteState>({
    inviteUrl: null,
    isLoading: false,
    error: null,
    hasRequested: false
  });

  const getDiscordInvite = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('Requesting Discord invite...');
      
      const { data, error } = await supabase.functions.invoke('get-discord-invite', {
        body: {}
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw new Error(error.message || 'Failed to get Discord invite');
      }

      // Check if Edge Function returned a business logic error (HTTP 200 but with error message)
      if (data?.error) {
        console.log('Business logic error received:', data.error);
        throw new Error(data.error);
      }

      // Edge Function возвращает данные в свойстве data
      const inviteData: DiscordInviteData | null = data?.data || data;
      
      if (!inviteData || !inviteData.invite_url) {
        throw new Error('No available invites');
      }

      console.log('Discord invite successfully received:', inviteData.code);
      
      setState(prev => ({
        ...prev,
        inviteUrl: inviteData.invite_url,
        isLoading: false,
        hasRequested: true
      }));

    } catch (err: any) {
      console.error('Error while getting Discord invite:', err);
      
      let errorMessage = 'Failed to get Discord invite';
      
      if (err.message.includes('пуле')) {
        errorMessage = 'There are no invites available at the moment. Please contact the administrator.';
      } else if (err.message.includes('configuration')) {
        errorMessage = 'Server configuration issue. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        hasRequested: true
      }));
    }
  };

  const resetState = () => {
    setState({
      inviteUrl: null,
      isLoading: false,
      error: null,
      hasRequested: false
    });
  };

  const openDiscordInvite = () => {
    if (state.inviteUrl) {
      window.open(state.inviteUrl, '_blank');
    }
  };

  return {
    ...state,
    getDiscordInvite,
    resetState,
    openDiscordInvite
  };
};