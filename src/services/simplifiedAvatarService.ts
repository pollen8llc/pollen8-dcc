import { supabase } from "@/integrations/supabase/client";

export interface IonsAvatar {
  id: string;
  name: string;
  svg_definition: string;
  network_score_threshold: number;
  rarity_tier: string;
  animation_type: string;
  color_scheme: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvatarSelection {
  selected_avatar_id?: string;
  network_score: number;
  unlocked_avatars: string[];
}

export class AvatarService {
  
  static async getAvatarById(id: string): Promise<IonsAvatar | null> {
    const { data, error } = await supabase
      .from('ions_avatar')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) {
      console.error('Failed to fetch avatar:', error);
      return null;
    }
    
    return data;
  }

  static async getUserAvatarSelection(userId: string): Promise<AvatarSelection> {
    const { data, error } = await supabase
      .from('profiles')
      .select('selected_avatar_id, network_score, unlocked_avatars')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Failed to fetch user avatar selection:', error);
      return {
        network_score: 0,
        unlocked_avatars: []
      };
    }
    
    if (!data) {
      return {
        network_score: 0,
        unlocked_avatars: []
      };
    }
    
    return {
      selected_avatar_id: data?.selected_avatar_id || undefined,
      network_score: data?.network_score || 0,
      unlocked_avatars: data?.unlocked_avatars || []
    };
  }

  static async updateUserSelectedAvatar(userId: string, avatarId: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ selected_avatar_id: avatarId })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Failed to update user selected avatar:', error);
      return false;
    }
    
    return true;
  }

  static renderAvatarSvg(avatar: IonsAvatar, uniqueId: string): string {
    return avatar.svg_definition.replace(/{id}/g, uniqueId);
  }

  // Keep admin methods for avatar management
  static async getAllActiveAvatars(): Promise<IonsAvatar[]> {
    const { data, error } = await supabase
      .from('ions_avatar')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error('Failed to fetch avatars:', error);
      return [];
    }
    
    return data || [];
  }

  static async createAvatar(avatar: Omit<IonsAvatar, 'id' | 'created_at' | 'updated_at'>): Promise<IonsAvatar | null> {
    const { data, error } = await supabase
      .from('ions_avatar')
      .insert(avatar)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Failed to create avatar:', error);
      return null;
    }
    
    return data;
  }

  static async updateAvatar(id: string, updates: Partial<IonsAvatar>): Promise<boolean> {
    const { error } = await supabase
      .from('ions_avatar')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Failed to update avatar:', error);
      return false;
    }
    
    return true;
  }

  static async deleteAvatar(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('ions_avatar')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) {
      console.error('Failed to delete avatar:', error);
      return false;
    }
    
    return true;
  }
}
