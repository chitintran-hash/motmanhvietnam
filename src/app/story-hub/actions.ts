'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export type ReactionType = 'heart' | 'like' | 'dislike';

interface ToggleReactionParams {
  storyIdentifier: string; // id or slug
  prevReaction: ReactionType | null;
  newReaction: ReactionType | null;
}

export async function toggleStoryReactionAction({
  storyIdentifier,
  prevReaction,
  newReaction
}: ToggleReactionParams) {
  try {
    const supabase = getSupabaseServer();

    // Query story by id (if UUID) or by slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storyIdentifier);
    const query = supabase
      .from('mm_stories')
      .select('id, slug, hearts_count, likes_count, dislikes_count');

    const { data: story, error: fetchError } = isUuid
      ? await query.eq('id', storyIdentifier).single()
      : await query.eq('slug', storyIdentifier).single();

    if (fetchError || !story) {
      console.error('Fetch story error:', fetchError);
      return { success: false, message: 'Không tìm thấy bài viết.' };
    }

    let hearts = Math.max(0, Number(story.hearts_count) || 0);
    let likes = Math.max(0, Number(story.likes_count) || 0);
    let dislikes = Math.max(0, Number(story.dislikes_count) || 0);

    // Trừ tương tác cũ nếu có
    if (prevReaction === 'heart') hearts = Math.max(0, hearts - 1);
    if (prevReaction === 'like') likes = Math.max(0, likes - 1);
    if (prevReaction === 'dislike') dislikes = Math.max(0, dislikes - 1);

    // Cộng tương tác mới nếu có
    if (newReaction === 'heart') hearts += 1;
    if (newReaction === 'like') likes += 1;
    if (newReaction === 'dislike') dislikes += 1;

    // Cập nhật lại vào Supabase
    const { error: updateError } = await supabase
      .from('mm_stories')
      .update({
        hearts_count: hearts,
        likes_count: likes,
        dislikes_count: dislikes
      })
      .eq('id', story.id);

    if (updateError) {
      console.error('Update story reactions error:', updateError);
      return { 
        success: false, 
        message: 'Lỗi cập nhật tương tác (Có thể cần chạy lệnh SQL tạo cột trên Supabase).' 
      };
    }

    revalidatePath('/story-hub');
    revalidatePath(`/story-hub/${story.slug}`);
    revalidatePath('/admin/stories');

    return {
      success: true,
      hearts,
      likes,
      dislikes,
      total: hearts + likes + dislikes
    };
  } catch (error: any) {
    console.error('Exception in toggleStoryReactionAction:', error);
    return { success: false, message: error?.message || 'Lỗi hệ thống' };
  }
}
