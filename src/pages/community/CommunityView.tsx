/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DirectMessages } from './DirectMessages';
import {
  Code2,
  Heart,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  PlusCircle,
  Search,
  Send,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PeerCodeReview } from '../../types';

export const CommunityView: React.FC = () => {
 const [section,setSection]=useState<'messages'|'community'>('messages');
 return <div className="max-w-4xl mx-auto space-y-5"><div className="v34-community-tabs" role="tablist" aria-label="Communication sections"><button role="tab" aria-selected={section==='messages'} className={section==='messages'?'active':''} onClick={()=>setSection('messages')}><MessageSquare size={16}/> Conversations</button><button role="tab" aria-selected={section==='community'} className={section==='community'?'active':''} onClick={()=>setSection('community')}><Users size={16}/> Class Community</button></div>{section==='messages'?<DirectMessages/>:<CommunityFeed/>}</div>;
};

const CommunityFeed: React.FC = () => {
  const { communityPosts, likePost, addPost, addComment, currentUser } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Structured Peer Review State
  const [activePeerReviewPostId, setActivePeerReviewPostId] = useState<string | null>(null);
  const [reviewLineNum, setReviewLineNum] = useState<number>(1);
  const [reviewExcerpt, setReviewExcerpt] = useState<string>('');
  const [reviewObservation, setReviewObservation] = useState<string>('');
  const [reviewQuestion, setReviewQuestion] = useState<string>('');
  const [reviewHint, setReviewHint] = useState<string>('');

  // New Post Modal
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postContent, setPostContent] = useState<string>('');
  const [postCategory, setPostCategory] = useState<'showcase' | 'question' | 'tips' | 'code_review'>('showcase');
  const [postCodeSnippet, setPostCodeSnippet] = useState<string>('');

  const categories = ['All', 'announcement', 'showcase', 'question', 'tips', 'code_review'];

  const filteredPosts = communityPosts.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    addPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      title: postTitle.trim(),
      content: postContent.trim(),
      category: postCategory,
      codeSnippet: postCodeSnippet.trim() || undefined,
    });

    setShowNewPostModal(false);
    setPostTitle('');
    setPostContent('');
    setPostCodeSnippet('');
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addComment(postId, text.trim());
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleSendPeerReview = (postId: string) => {
    if (!reviewObservation.trim() || !reviewQuestion.trim()) {
      alert('Please include both an observation and a guiding question.');
      return;
    }

    const peerReview: PeerCodeReview = {
      lineNumber: Number(reviewLineNum) || 1,
      codeExcerpt: reviewExcerpt.trim() || 'Selected line',
      observation: reviewObservation.trim(),
      guidingQuestion: reviewQuestion.trim(),
      constructiveSuggestion: reviewHint.trim() || undefined,
    };

    addComment(postId, 'Added structured peer code review.', peerReview);
    setActivePeerReviewPostId(null);
    setReviewExcerpt('');
    setReviewObservation('');
    setReviewQuestion('');
    setReviewHint('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Class Community & Peer Code Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Share Python project showcases, ask questions, and practice constructive peer code review.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Discussion Post</span>
        </button>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search community posts, snippets, and questions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Discussions' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-5">
        {filteredPosts.map(post => {
          const isPeerReviewOpen = activePeerReviewPostId === post.id;

          return (
            <div
              key={post.id}
              className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4"
            >
              {/* Author & Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {post.authorName}
                      </span>
                      {post.authorRole === 'teacher' && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          Educator
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{post.timestamp}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {post.category.replace('_', ' ')}
                </span>
              </div>

              {/* Post Content */}
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Code Snippet if present */}
              {post.codeSnippet && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Python Excerpt</span>
                    <button
                      onClick={() => {
                        setActivePeerReviewPostId(isPeerReviewOpen ? null : post.id);
                        setReviewExcerpt(post.codeSnippet?.split('\n')[0] || '');
                      }}
                      className="text-sky-600 hover:text-sky-800 font-semibold font-sans text-xs flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isPeerReviewOpen ? 'Close Review Form' : 'Add Peer Review'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap border border-slate-800">
                    {post.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Structured Peer Code Review Form */}
              {isPeerReviewOpen && (
                <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600" /> Structured Peer Code Review
                    </span>
                    <button
                      onClick={() => setActivePeerReviewPostId(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sky-900/90 text-[11px] leading-relaxed">
                    Help your classmate think! Share what you observe and ask a guiding question.
                    Never spoil the whole solution directly.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Line #:</label>
                      <input
                        type="number"
                        min="1"
                        value={reviewLineNum}
                        onChange={e => setReviewLineNum(Number(e.target.value))}
                        className="w-full p-2 bg-white rounded border border-slate-200 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="font-bold text-slate-700 block mb-1">
                        Code Excerpt:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. for count in [3, 2, 1]:"
                        value={reviewExcerpt}
                        onChange={e => setReviewExcerpt(e.target.value)}
                        className="w-full p-2 bg-white rounded border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      1. What does this code appear to do? (Observation)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. This loop counts down through each item in the list..."
                      value={reviewObservation}
                      onChange={e => setReviewObservation(e.target.value)}
                      className="w-full p-2 bg-white rounded border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      2. Guiding question to help author think:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. What would happen if you wanted to count down from 20 instead?"
                      value={reviewQuestion}
                      onChange={e => setReviewQuestion(e.target.value)}
                      className="w-full p-2 bg-white rounded border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      3. Constructive suggestion (No full spoilers):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. You might explore range(start, stop, step) to make it flexible!"
                      value={reviewHint}
                      onChange={e => setReviewHint(e.target.value)}
                      className="w-full p-2 bg-white rounded border border-slate-200 text-xs"
                    />
                  </div>

                  <button
                    onClick={() => handleSendPeerReview(post.id)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    Submit Constructive Peer Review
                  </button>
                </div>
              )}

              {/* Likes & Comments Counter */}
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <button
                  onClick={() => likePost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.hasLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${post.hasLiked ? 'fill-current text-rose-500' : ''}`}
                  />
                  <span>{post.likes} Likes</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>{post.comments.length} Comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-3 pt-2">
                {post.comments.map(c => (
                  <div
                    key={c.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.authorAvatar}
                          alt={c.authorName}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="font-bold text-slate-900">{c.authorName}</span>
                        {c.authorRole === 'teacher' && (
                          <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded">
                            Teacher
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">{c.content}</p>

                    {/* Render Peer Code Review Box if attached */}
                    {c.peerReview && (
                      <div className="p-3 bg-white border border-sky-200 rounded-lg space-y-1.5 text-[11px] text-slate-800">
                        <div className="flex items-center justify-between text-sky-800 font-bold">
                          <span>Peer Code Review (Line {c.peerReview.lineNumber})</span>
                          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                            {c.peerReview.codeExcerpt}
                          </span>
                        </div>
                        <p>
                          <strong>Observation:</strong> {c.peerReview.observation}
                        </p>
                        <p>
                          <strong>Guiding Question:</strong> {c.peerReview.guidingQuestion}
                        </p>
                        {c.peerReview.constructiveSuggestion && (
                          <p className="text-sky-900">
                            <strong>Constructive Tip:</strong>{' '}
                            {c.peerReview.constructiveSuggestion}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Comment Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Write an encouraging reply or answer..."
                    value={commentInputs[post.id] || ''}
                    onChange={e =>
                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                    }
                    onKeyDown={e => e.key === 'Enter' && handleSendComment(post.id)}
                    className="flex-1 p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={() => handleSendComment(post.id)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3 h-3" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create Community Post</h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Post Title *</label>
                <input
                  type="text"
                  placeholder="e.g. How I built a Rocket Countdown timer!"
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={postCategory}
                  onChange={e => setPostCategory(e.target.value as any)}
                  className="w-full p-2 text-xs rounded border border-slate-200 bg-white"
                >
                  <option value="showcase">Project Showcase</option>
                  <option value="question">Question / Help Needed</option>
                  <option value="tips">Learning Tip</option>
                  <option value="code_review">Request Peer Review</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Message *</label>
                <textarea
                  rows={3}
                  placeholder="Share your thoughts, discovery, or question with classmates..."
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-sky-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Optional Python Code Snippet:
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste relevant lines for friends to see..."
                  value={postCodeSnippet}
                  onChange={e => setPostCodeSnippet(e.target.value)}
                  className="w-full p-2 font-mono text-xs rounded border border-slate-200 focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded shadow-xs"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
