'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { auth } from '@/auth';
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

export async function addStoryCommentAction({
  storyId,
  storySlug,
  content
}: {
  storyId: string;
  storySlug: string;
  content: string;
}) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { 
        success: false, 
        message: 'Bạn cần đăng nhập hoặc tạo tài khoản để có thể bình luận.' 
      };
    }

    const trimmedContent = (content || '').trim();
    if (!trimmedContent || trimmedContent.length < 2) {
      return { 
        success: false, 
        message: 'Vui lòng nhập nội dung bình luận (tối thiểu 2 ký tự).' 
      };
    }

    if (trimmedContent.length > 2000) {
      return { 
        success: false, 
        message: 'Bình luận không được vượt quá 2000 ký tự.' 
      };
    }

    const supabase = getSupabaseServer();

    const userName = session.user.name || session.user.email?.split('@')[0] || 'Thành viên';
    const userEmail = session.user.email || null;
    const userAvatar = session.user.image || null;
    const userId = (session.user as any).id || null;

    const payload: any = {
      story_id: storyId || null,
      story_slug: storySlug,
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      user_avatar: userAvatar,
      content: trimmedContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newComment, error: insertError } = await supabase
      .from('mm_story_comments')
      .insert([payload])
      .select()
      .single();

    if (insertError) {
      console.error('Insert comment error:', insertError);
      return { 
        success: false, 
        message: 'Lỗi lưu bình luận (Có thể cần chạy lệnh SQL tạo bảng mm_story_comments trên Supabase).' 
      };
    }

    revalidatePath(`/story-hub/${storySlug}`);
    revalidatePath('/admin/stories');

    return { 
      success: true, 
      message: 'Bình luận của bạn đã được đăng thành công!',
      comment: newComment 
    };
  } catch (error: any) {
    console.error('Exception in addStoryCommentAction:', error);
    return { success: false, message: error?.message || 'Lỗi hệ thống khi đăng bình luận' };
  }
}

export async function deleteStoryCommentAction(commentId: string, storySlug: string) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();

    // Fetch comment to check ownership
    const { data: comment, error: fetchError } = await supabase
      .from('mm_story_comments')
      .select('id, user_id')
      .eq('id', commentId)
      .single();

    if (fetchError || !comment) {
      return { success: false, message: 'Bình luận không tồn tại.' };
    }

    const currentUserId = (session.user as any).id;
    const isOwner = comment.user_id && comment.user_id === currentUserId;
    const isAdmin = (session.user as any).role === 'admin';

    if (!isOwner && !isAdmin) {
      return { success: false, message: 'Bạn không có quyền xoá bình luận này.' };
    }

    const { error: deleteError } = await supabase
      .from('mm_story_comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      return { success: false, message: deleteError.message };
    }

    revalidatePath(`/story-hub/${storySlug}`);
    revalidatePath('/admin/stories');

    return { success: true, message: 'Đã xoá bình luận.' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Lỗi hệ thống' };
  }
}
