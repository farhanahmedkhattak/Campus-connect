import React, { useState, useEffect } from 'react';
import RoleSwitcher from './components/ui/RoleSwitcher';
import LeftSidebar from './components/layout/LeftSidebar';
import RightSidebar from './components/layout/RightSidebar';
import MobileNav from './components/layout/MobileNav';
import Header from './components/layout/Header';
import Toast from './components/ui/Toast';

import FeedView from './components/feed/FeedView';
import CreatePostModal from './components/feed/CreatePostModal';
import AnnouncementsView from './components/announcements/AnnouncementsView';
import EventsView from './components/events/EventsView';
import SocietiesView from './components/societies/SocietiesView';
import PastPapersView from './components/pastpapers/PastPapersView';
import PollsView from './components/polls/PollsView';
import FeedbackView from './components/feedback/FeedbackView';
import BookmarksView from './components/bookmarks/BookmarksView';
import NotificationsView from './components/notifications/NotificationsView';
import ProfileView from './components/profile/ProfileView';
import ModerationView from './components/moderation/ModerationView';
import AuthModal from './components/auth/AuthModal';

import { useAuth } from './context/AuthContext';
import { DEMO_USERS } from './constants/auKamra';
import { 
  INITIAL_POSTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_POLLS, 
  INITIAL_EVENTS, 
  INITIAL_SOCIETIES, 
  INITIAL_PAST_PAPERS, 
  INITIAL_NOTIFICATIONS 
} from './mockData/initialData';

export default function App() {
  const { profile, setDemoUser, isDemoMode, updateProfile } = useAuth();
  const currentUser = profile;
  const [currentTab, setCurrentTab] = useState('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Helper for displaying notifications
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // State initialization with localStorage fallback
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_announcements');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [polls, setPolls] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_polls');
      return saved ? JSON.parse(saved) : INITIAL_POLLS;
    } catch {
      return INITIAL_POLLS;
    }
  });

  const [pastPapers, setPastPapers] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_past_papers');
      return saved ? JSON.parse(saved) : INITIAL_PAST_PAPERS;
    } catch {
      return INITIAL_PAST_PAPERS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cc_posts', JSON.stringify(posts));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('cc_announcements', JSON.stringify(announcements));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('cc_polls', JSON.stringify(polls));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [polls]);

  useEffect(() => {
    try {
      localStorage.setItem('cc_past_papers', JSON.stringify(pastPapers));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [pastPapers]);

  useEffect(() => {
    try {
      localStorage.setItem('cc_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [notifications]);

  // Reset demo data to clean defaults
  const handleResetData = () => {
    localStorage.removeItem('cc_posts');
    localStorage.removeItem('cc_announcements');
    localStorage.removeItem('cc_polls');
    localStorage.removeItem('cc_past_papers');
    localStorage.removeItem('cc_notifications');
    setPosts(INITIAL_POSTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setPolls(INITIAL_POLLS);
    setPastPapers(INITIAL_PAST_PAPERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Platform reset to clean sample data.', 'info');
  };

  // Likes Interaction
  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  // Bookmark Interaction (Private)
  const handleBookmark = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isBookmarked = !p.isBookmarked;
          showToast(
            isBookmarked ? 'Saved to private bookmarks.' : 'Removed from bookmarks.',
            'info'
          );
          return { ...p, isBookmarked };
        }
        return p;
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId, content) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: currentUser.fullName,
      username: currentUser.username,
      department: currentUser.department,
      content,
      timestamp: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      })
    );
    showToast('Comment posted.');
  };

  // Delete Comment
  const handleDeleteComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: Math.max(0, p.commentsCount - 1),
            comments: p.comments.filter((c) => c.id !== commentId),
          };
        }
        return p;
      })
    );
    showToast('Comment deleted.', 'info');
  };

  // Create Post Workflow
  const handleCreatePost = ({ content, department, imageUrls }) => {
    const isStudent = currentUser.role === 'student';

    const newPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      username: currentUser.username,
      department,
      batch: String(currentUser.batchYear || 2024),
      authorAvatar: currentUser.avatarUrl,
      content,
      imageUrls,
      status: isStudent ? 'pending' : 'approved',
      moderatedBy: isStudent ? null : currentUser.fullName,
      moderatedAt: isStudent ? null : new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      isBookmarked: false,
      timestamp: 'Just now',
      comments: [],
    };

    setPosts([newPost, ...posts]);

    if (isStudent) {
      showToast('Post submitted! It is in the pending queue awaiting moderator review.', 'info');
    } else {
      showToast('Post published directly to campus feed.');
    }
  };

  // Moderation: Approve Post
  const handleApprovePost = (postId) => {
    const post = posts.find((p) => p.id === postId);
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            status: 'approved',
            moderatedBy: currentUser.fullName,
            moderatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    // Add in-app notification for author
    if (post) {
      const notif = {
        id: `notif-${Date.now()}`,
        type: 'post_approved',
        actorName: currentUser.fullName,
        actorAvatar: currentUser.avatarUrl,
        message: 'Your campus post was approved and is now visible on the public feed.',
        timestamp: 'Just now',
        isRead: false,
      };
      setNotifications([notif, ...notifications]);
    }

    showToast('Post approved for public campus feed!');
  };

  // Moderation: Reject Post
  const handleRejectPost = (postId, reason) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            status: 'rejected',
            rejectionReason: reason,
            moderatedBy: currentUser.fullName,
            moderatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
    showToast(`Post rejected (${reason}).`, 'error');
  };

  // Poll Voting
  const handleVotePoll = (pollId, optionId) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId && !poll.hasVoted) {
          return {
            ...poll,
            hasVoted: true,
            userVotedOptionId: optionId,
            totalVotes: poll.totalVotes + 1,
            options: poll.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          };
        }
        return poll;
      })
    );
    showToast('Your vote has been recorded securely!');
  };

  // Add Poll
  const handleCreatePoll = (newPoll) => {
    setPolls([newPoll, ...polls]);
    showToast('New campus poll launched!');
  };

  // Add Announcement (Faculty/Admin only)
  const handleAddAnnouncement = (newAnnouncement) => {
    setAnnouncements([newAnnouncement, ...announcements]);
    showToast('Official university notice published!');
  };

  // Upload Past Paper
  const handleUploadPaper = (newPaper) => {
    setPastPapers([newPaper, ...pastPapers]);
    showToast('Past exam paper uploaded to academic repository.');
  };

  // Notifications
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const pendingPostsCount = posts.filter((p) => p.status === 'pending').length;
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30">
      
      {/* Role Switcher Pill Bar for Instant Testing Without Backend */}
      <RoleSwitcher
        currentUser={currentUser}
        onSelectUser={(u) => setDemoUser(u)}
        onResetData={handleResetData}
      />

      {/* Mobile Top Header */}
      <Header
        currentTab={currentTab}
        currentUser={currentUser}
        unreadNotifsCount={unreadNotifsCount}
        onSelectTab={setCurrentTab}
        pendingPostsCount={pendingPostsCount}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main 3-Column Desktop / 1-Column Mobile Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex justify-center">
        
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden lg:block">
          <LeftSidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            currentUser={currentUser}
            pendingPostsCount={pendingPostsCount}
            unreadNotifsCount={unreadNotifsCount}
            onOpenCreatePost={() => setIsCreateModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            isDemoMode={isDemoMode}
          />
        </div>

        {/* Center Main Stage (Feed / Tab Views) */}
        <main className="flex-1 max-w-2xl min-w-0 px-3 sm:px-6 py-4 pb-24 lg:pb-8">
          {currentTab === 'home' && (
            <FeedView
              posts={posts}
              currentUser={currentUser}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onApprovePost={handleApprovePost}
              onRejectPost={handleRejectPost}
              onOpenCreatePost={() => setIsCreateModalOpen(true)}
            />
          )}

          {currentTab === 'announcements' && (
            <AnnouncementsView
              announcements={announcements}
              currentUser={currentUser}
              onAddAnnouncement={handleAddAnnouncement}
            />
          )}

          {currentTab === 'events' && (
            <EventsView events={INITIAL_EVENTS} />
          )}

          {currentTab === 'societies' && (
            <SocietiesView societies={INITIAL_SOCIETIES} />
          )}

          {currentTab === 'pastpapers' && (
            <PastPapersView
              pastPapers={pastPapers}
              currentUser={currentUser}
              onUploadPaper={handleUploadPaper}
            />
          )}

          {currentTab === 'polls' && (
            <PollsView
              polls={polls}
              currentUser={currentUser}
              onVotePoll={handleVotePoll}
              onCreatePoll={handleCreatePoll}
            />
          )}

          {currentTab === 'feedback' && (
            <FeedbackView currentUser={currentUser} />
          )}

          {currentTab === 'bookmarks' && (
            <BookmarksView
              posts={posts}
              currentUser={currentUser}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          )}

          {currentTab === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              posts={posts}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onSaveProfile={(updates) => {
                updateProfile(updates);
                showToast('Academic profile updated.');
              }}
            />
          )}

          {currentTab === 'moderation' && (
            <ModerationView
              posts={posts}
              currentUser={currentUser}
              onApprovePost={handleApprovePost}
              onRejectPost={handleRejectPost}
            />
          )}
        </main>

        {/* Right Rail Sidebar (Desktop Only) */}
        <div className="hidden lg:block">
          <RightSidebar
            announcements={announcements}
            events={INITIAL_EVENTS}
            poll={polls[0]}
            onVotePoll={handleVotePoll}
            onSelectTab={setCurrentTab}
          />
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreatePost={() => setIsCreateModalOpen(true)}
        unreadNotifsCount={unreadNotifsCount}
      />

      {/* Create Campus Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitPost={handleCreatePost}
        currentUser={currentUser}
      />

      {/* Sign In & Student Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
