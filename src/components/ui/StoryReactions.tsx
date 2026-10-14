'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Heart, ThumbsUp, ThumbsDown, Sparkles, MessageCircleHeart } from 'lucide-react';
import { toggleStoryReactionAction, ReactionType } from '@/app/story-hub/actions';

interface StoryReactionsProps {
  storyId: string;
  storySlug: string;
  initialHearts?: number;
  initialLikes?: number;
  initialDislikes?: number;
}

export default function StoryReactions({
  storyId,
  storySlug,
  initialHearts = 0,
  initialLikes = 0,
  initialDislikes = 0
}: StoryReactionsProps) {
  const [hearts, setHearts] = useState(initialHearts);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(null);
  const [isPending, startTransition] = useTransition();
  const [animateBtn, setAnimateBtn] = useState<ReactionType | null>(null);

  const storageKey = `mm_story_reaction_${storyId || storySlug}`;

  // Read saved reaction from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'heart' || saved === 'like' || saved === 'dislike') {
        setCurrentReaction(saved as ReactionType);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [storageKey]);

  // Keep state in sync if initial counts change
  useEffect(() => {
    setHearts(initialHearts);
  }, [initialHearts]);
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);
  useEffect(() => {
    setDislikes(initialDislikes);
  }, [initialDislikes]);

  const handleReact = (type: ReactionType) => {
    const prev = currentReaction;
    const next: ReactionType | null = prev === type ? null : type;

    // Optimistic UI updates
    setAnimateBtn(type);
    setTimeout(() => setAnimateBtn(null), 400);

    // Calculate optimistic counts
    let newHearts = hearts;
    let newLikes = likes;
    let newDislikes = dislikes;

    if (prev === 'heart') newHearts = Math.max(0, newHearts - 1);
    if (prev === 'like') newLikes = Math.max(0, newLikes - 1);
    if (prev === 'dislike') newDislikes = Math.max(0, newDislikes - 1);

    if (next === 'heart') newHearts += 1;
    if (next === 'like') newLikes += 1;
    if (next === 'dislike') newDislikes += 1;

    setHearts(newHearts);
    setLikes(newLikes);
    setDislikes(newDislikes);
    setCurrentReaction(next);

    // Save to localStorage
    try {
      if (next) {
        localStorage.setItem(storageKey, next);
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (e) {
      // Ignore
    }

    // Call server action
    startTransition(async () => {
      const result = await toggleStoryReactionAction({
        storyIdentifier: storyId || storySlug,
        prevReaction: prev,
        newReaction: next
      });

      if (result.success) {
        if (typeof result.hearts === 'number') setHearts(result.hearts);
        if (typeof result.likes === 'number') setLikes(result.likes);
        if (typeof result.dislikes === 'number') setDislikes(result.dislikes);
      } else {
        // Rollback on critical error
        console.warn('Reaction update notice:', result.message);
      }
    });
  };

  const totalInteractions = hearts + likes + dislikes;

  return (
    <div className="w-full bg-[#F5F2EB] border-2 border-foreground/15 rounded-2xl p-6 md:p-8 shadow-[4px_4px_0px_rgba(42,42,39,0.08)] my-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-foreground/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terracotta/10 text-terracotta text-xs font-bold uppercase tracking-wider rounded-full mb-2">
            <MessageCircleHeart className="w-4 h-4" />
            TƯƠNG TÁC BÀI VIẾT
          </div>
          <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tight">
            Bạn cảm nhận thế nào về câu chuyện này?
          </h3>
          <p className="text-sm text-foreground-muted font-medium mt-1">
            Mỗi lượt thả tim và chia sẻ của bạn là nguồn động lực lớn để Một Mảnh tiếp tục hành trình!
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-xl border border-foreground/10 shrink-0 self-start md:self-auto shadow-sm">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-sm font-bold text-foreground">
            {totalInteractions.toLocaleString('vi-VN')}{' '}
            <span className="text-xs font-medium text-foreground-muted">lượt tương tác</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 flex flex-wrap items-center gap-4">
        {/* Heart / Thả tim */}
        <button
          onClick={() => handleReact('heart')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider border-2 transition-all duration-200 shadow-sm active:scale-95 ${
            currentReaction === 'heart'
              ? 'bg-red-500 text-white border-red-500 shadow-[2px_2px_0px_rgba(220,38,38,1)]'
              : 'bg-white text-foreground hover:border-red-400 hover:text-red-500 border-foreground/10'
          } ${animateBtn === 'heart' ? 'scale-110' : ''}`}
          title="Thả tim bài viết"
        >
          <Heart
            className={`w-5 h-5 transition-transform duration-200 ${
              currentReaction === 'heart' ? 'fill-current text-white scale-110' : 'text-red-500'
            }`}
          />
          <span>Thả tim</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-black ${
              currentReaction === 'heart' ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600'
            }`}
          >
            {hearts.toLocaleString('vi-VN')}
          </span>
        </button>

        {/* Like / Thích */}
        <button
          onClick={() => handleReact('like')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider border-2 transition-all duration-200 shadow-sm active:scale-95 ${
            currentReaction === 'like'
              ? 'bg-primary-green text-cream border-primary-green shadow-[2px_2px_0px_rgba(46,91,70,1)]'
              : 'bg-white text-foreground hover:border-primary-green hover:text-primary-green border-foreground/10'
          } ${animateBtn === 'like' ? 'scale-110' : ''}`}
          title="Thích bài viết"
        >
          <ThumbsUp
            className={`w-5 h-5 transition-transform duration-200 ${
              currentReaction === 'like' ? 'fill-current text-cream scale-110' : 'text-primary-green'
            }`}
          />
          <span>Thích</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-black ${
              currentReaction === 'like' ? 'bg-white/20 text-cream' : 'bg-emerald-50 text-primary-green'
            }`}
          >
            {likes.toLocaleString('vi-VN')}
          </span>
        </button>

        {/* Dislike / Không thích */}
        <button
          onClick={() => handleReact('dislike')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider border-2 transition-all duration-200 shadow-sm active:scale-95 ${
            currentReaction === 'dislike'
              ? 'bg-foreground text-background border-foreground'
              : 'bg-white text-foreground/70 hover:border-foreground/30 hover:text-foreground border-foreground/10'
          } ${animateBtn === 'dislike' ? 'scale-110' : ''}`}
          title="Không thích bài viết"
        >
          <ThumbsDown
            className={`w-4 h-4 transition-transform duration-200 ${
              currentReaction === 'dislike' ? 'fill-current' : ''
            }`}
          />
          <span className="text-xs">Không thích</span>
          {dislikes > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black ${
                currentReaction === 'dislike' ? 'bg-white/20 text-background' : 'bg-foreground/5 text-foreground/70'
              }`}
            >
              {dislikes.toLocaleString('vi-VN')}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
