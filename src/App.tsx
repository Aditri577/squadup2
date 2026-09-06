import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Team, TeamRequest, UserRole, TeammateFeedback } from './types';
import { INITIAL_USERS, INITIAL_HACKATHONS, INITIAL_TEAMS, INITIAL_REQUESTS } from './data/mockData';
import { Header } from './components/Header';
import { TeammateDiscovery } from './components/TeammateDiscovery';
import { AssessmentView } from './components/AssessmentView';
import { ProfileView } from './components/ProfileView';
import { TeamWorkspace } from './components/TeamWorkspace';
import { HackathonsList } from './components/HackathonsList';
import { InvitationsModal } from './components/InvitationsModal';
import { AuthView } from './components/AuthView';
import { LeaderboardView } from './components/LeaderboardView';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { VerificationGate } from './components/VerificationGate';
import { LandingPage } from './components/LandingPage';
import { api, ApiError, getToken, setToken, clearToken, fetchDemoMode } from './utils/api';
import { useToast } from './components/Toast';

type AuthState = 'loading' | 'anonymous' | 'authenticated';

// A single proctored badge of any colour unlocks discovery and team workspaces.
const hasProctoredBadge = (user: User) =>
  user.skills.some(s => s.badgeLevel !== 'Unverified') || (user.testResults?.length ?? 0) > 0;

export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [authState, setAuthState] = useState<AuthState>('loading');
  const [demoMode, setDemoMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Discovery filters that can be set from other tabs
  const [hackathonFilter, setHackathonFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  // Application Data State loaded from Backend API
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [requests, setRequests] = useState<TeamRequest[]>(INITIAL_REQUESTS);
  const [feedbacks, setFeedbacks] = useState<TeammateFeedback[]>([]);
  const [hackathons] = useState(INITIAL_HACKATHONS);

  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const loadState = useCallback(async () => {
    const data = await api<{ users: User[]; teams: Team[]; requests: TeamRequest[]; feedback: TeammateFeedback[] }>('/api/state');
    setUsers(data.users || []);
    setTeams(data.teams || []);
    setRequests(data.requests || []);
    setFeedbacks(data.feedback || []);
    return data;
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    setCurrentUser(INITIAL_USERS[0]);
    setAuthState('anonymous');
  }, []);

  // Resolve the stored session token on boot.
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const isDemo = await fetchDemoMode();
      if (!cancelled) setDemoMode(isDemo);

      const token = getToken();
      if (!token) {
        if (!cancelled) setAuthState('anonymous');
        return;
      }

      try {
        const { user } = await api<{ user: User }>('/api/auth/me');
        if (cancelled) return;
        setCurrentUser(user);
        setAuthState('authenticated');
        const data = await loadState();
        if (!cancelled) {
          // Re-read from state so XP/badges awarded server-side are reflected.
          const fresh = (data.users || []).find((u: User) => u.id === user.id);
          if (fresh) setCurrentUser(fresh);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
        } else {
          console.error('Failed to restore session', err);
        }
        setAuthState('anonymous');
      }
    };

    bootstrap();
    return () => { cancelled = true; };
  }, [loadState]);

  // Any expired session anywhere in the app drops back to the login screen.
  const runAuthenticated = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return null;
      }
      const message = err instanceof ApiError ? err.message : 'Something went wrong';
      toast.error(message);
      return null;
    }
  }, [signOut]);

  const handleAuthSuccess = async (token: string, user: User) => {
    setToken(token);
    setCurrentUser(user);
    setAuthState('authenticated');
    await runAuthenticated(async () => {
      const data = await loadState();
      const fresh = (data.users || []).find((u: User) => u.id === user.id);
      if (fresh) setCurrentUser(fresh);
    });
    navigate('/discover', { replace: true });
  };

  const handleSwitchIdentity = async (userId: string) => {
    const result = await runAuthenticated(() =>
      api<{ token: string; user: User }>('/api/auth/demo-switch', { method: 'POST', body: { userId } })
    );
    if (!result) return;
    setToken(result.token);
    setCurrentUser(result.user);
    await runAuthenticated(loadState);
    navigate('/discover');
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const result = await runAuthenticated(() =>
      api<{ user: User }>(`/api/users/${updatedUser.id}`, { method: 'PUT', body: updatedUser })
    );
    if (!result) return;
    await runAuthenticated(loadState);
    setCurrentUser(prev => (prev.id === result.user.id ? result.user : prev));
  };

  const handleSendTeamRequest = async (requestData: Omit<TeamRequest, 'id' | 'createdAt' | 'status'>) => {
    const result = await runAuthenticated(() =>
      api<{ request: TeamRequest }>('/api/requests', {
        method: 'POST',
        body: {
          teamId: requestData.teamId,
          teamName: requestData.teamName,
          hackathonName: requestData.hackathonName,
          receiverId: requestData.receiverId,
          proposedRole: requestData.proposedRole,
          message: requestData.message
        }
      })
    );
    if (!result) return;
    await runAuthenticated(loadState);
    toast.success('Invitation sent successfully! 🎉');
  };

  const handleRespondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    const result = await runAuthenticated(() =>
      api(`/api/requests/${requestId}`, { method: 'PUT', body: { status } })
    );
    if (!result) return;
    await runAuthenticated(loadState);
    if (status === 'accepted') {
      toast.success('Invitation accepted! Welcome to the team 🚀');
      const me = await runAuthenticated(() => api<{ user: User }>('/api/auth/me'));
      if (me) setCurrentUser(me.user);
      navigate('/teams');
    } else {
      toast.info('Invitation declined.');
    }
  };

  const handleCreateTeam = async (newTeamData: Omit<Team, 'id' | 'createdAt'>) => {
    const result = await runAuthenticated(() =>
      api<{ team: Team }>('/api/teams', {
        method: 'POST',
        body: {
          name: newTeamData.name,
          hackathonId: newTeamData.hackathonId,
          hackathonName: newTeamData.hackathonName,
          description: newTeamData.description,
          lookingForRoles: newTeamData.lookingForRoles,
          projectIdea: newTeamData.projectIdea
        }
      })
    );
    if (!result) return;
    await runAuthenticated(loadState);
    const me = await runAuthenticated(() => api<{ user: User }>('/api/auth/me'));
    if (me) setCurrentUser(me.user);
    toast.success(`Team "${result.team.name}" created! 🎉`);
    navigate('/teams');
  };

  const handleSendFeedback = async (feedbackData: { senderId: string; senderName: string; receiverId: string; teamId: string; rating: number; comment: string; tags: string[] }) => {
    const result = await runAuthenticated(() =>
      api('/api/feedback', {
        method: 'POST',
        body: {
          receiverId: feedbackData.receiverId,
          teamId: feedbackData.teamId,
          rating: feedbackData.rating,
          comment: feedbackData.comment,
          tags: feedbackData.tags
        }
      })
    );
    if (!result) return;
    await runAuthenticated(loadState);
    const me = await runAuthenticated(() => api<{ user: User }>('/api/auth/me'));
    if (me) setCurrentUser(me.user);
  };

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#0c0915] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-purple-300 font-bold tracking-widest uppercase">Connecting to Database...</p>
        </div>
      </div>
    );
  }

  if (authState === 'anonymous') {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onGetStarted={() => navigate('/login')}
              onLogin={() => navigate('/login')}
            />
          }
        />
        <Route
          path="/login"
          element={
            <AuthView
              demoMode={demoMode}
              allUsers={users}
              onAuthSuccess={handleAuthSuccess}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  const pendingRequestsForUser = requests.filter(r => r.receiverId === currentUser.id && r.status === 'pending');
  const currentTeam = teams.find(t => t.id === currentUser.teamId) || null;
  const isVerified = hasProctoredBadge(currentUser);
  const verificationGate = <VerificationGate currentUser={currentUser} onNavigate={(path) => navigate(path)} />;

  return (
    <div className="min-h-screen w-full overflow-x-hidden nixtio-bg text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-white">

      <Header
        currentUser={currentUser}
        allUsers={users}
        demoMode={demoMode}
        onSwitchIdentity={handleSwitchIdentity}
        pendingRequestsCount={pendingRequestsForUser.length}
        onOpenRequestsModal={() => setShowRequestsModal(true)}
        onLogout={signOut}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <motion.main
        key={location.pathname}
        className="pb-16"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/login" element={<Navigate to="/discover" replace />} />
          <Route
            path="/discover"
            element={
              isVerified ? (
                <TeammateDiscovery
                  currentUser={currentUser}
                  allUsers={users}
                  onSelectUser={(u) => navigate(`/u/${u.id}`)}
                  onSendTeamRequest={handleSendTeamRequest}
                  activeTeamName={currentTeam?.name || 'Team Nexus'}
                  activeHackathonName={currentTeam?.hackathonName || 'AI Innovations Global Hackathon 2026'}
                  onNavigateToAssessment={() => navigate('/assessment')}
                  initialHackathonFilter={hackathonFilter}
                  initialRoleFilter={roleFilter}
                  onClearFilters={() => { setHackathonFilter(''); setRoleFilter(''); }}
                />
              ) : verificationGate
            }
          />

          <Route
            path="/u/:userId"
            element={
              <UserProfileRoute
                users={users}
                currentUser={currentUser}
                feedbacks={feedbacks}
              />
            }
          />

          <Route
            path="/assessment"
            element={
              <AssessmentView
                currentUser={currentUser}
                onUpdateUserSkills={handleUpdateUser}
              />
            }
          />

          <Route
            path="/leaderboard"
            element={
              <LeaderboardView
                allUsers={users}
                feedbacks={feedbacks}
                currentUser={currentUser}
              />
            }
          />

          <Route
            path="/profile"
            element={
              <ProfileView
                user={currentUser}
                isCurrentUser={true}
                onUpdateProfile={handleUpdateUser}
                onTakeTestClick={() => navigate('/assessment')}
                feedbacks={feedbacks.filter(f => f.receiverId === currentUser.id)}
              />
            }
          />

          <Route
            path="/teams"
            element={
              isVerified ? (
                <TeamWorkspace
                  currentUser={currentUser}
                  allUsers={users}
                  activeTeam={currentTeam}
                  onCreateTeam={handleCreateTeam}
                  onNavigateToDiscoveryWithRole={(role: UserRole) => {
                    setRoleFilter(role);
                    navigate('/discover');
                  }}
                  onSendFeedback={handleSendFeedback}
                />
              ) : verificationGate
            }
          />

          <Route
            path="/t/:teamId"
            element={
              isVerified ? (
                <TeamRoute
                  teams={teams}
                  currentUser={currentUser}
                  allUsers={users}
                  onCreateTeam={handleCreateTeam}
                  onSendFeedback={handleSendFeedback}
                />
              ) : verificationGate
            }
          />

          <Route
            path="/hackathons"
            element={
              <HackathonsList
                hackathons={hackathons}
                onSelectHackathonFilter={(hackathonName) => {
                  setHackathonFilter(hackathonName);
                  navigate('/discover');
                }}
              />
            }
          />

          <Route path="*" element={<Navigate to="/discover" replace />} />
        </Routes>
      </motion.main>

      {showRequestsModal && (
        <InvitationsModal
          requests={pendingRequestsForUser}
          onClose={() => setShowRequestsModal(false)}
          onAcceptRequest={(id) => handleRespondToRequest(id, 'accepted')}
          onRejectRequest={(id) => handleRespondToRequest(id, 'rejected')}
        />
      )}

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        users={users}
        hackathons={hackathons}
        onSelectUser={(u) => navigate(`/u/${u.id}`)}
        onNavigatePath={(path) => navigate(path)}
      />

    </div>
  );
}

// Public profile deep link: /u/:userId
function UserProfileRoute({ users, currentUser, feedbacks }: {
  users: User[];
  currentUser: User;
  feedbacks: TeammateFeedback[];
}) {
  const { userId } = useParams();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return <Navigate to="/discover" replace />;
  }

  return (
    <ProfileView
      user={user}
      isCurrentUser={user.id === currentUser.id}
      feedbacks={feedbacks.filter(f => f.receiverId === user.id)}
    />
  );
}

// Team deep link: /t/:teamId
function TeamRoute({ teams, currentUser, allUsers, onCreateTeam, onSendFeedback }: {
  teams: Team[];
  currentUser: User;
  allUsers: User[];
  onCreateTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  onSendFeedback: (feedback: { senderId: string; senderName: string; receiverId: string; teamId: string; rating: number; comment: string; tags: string[] }) => void;
}) {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const team = teams.find(t => t.id === teamId);

  if (!team) {
    return <Navigate to="/teams" replace />;
  }

  return (
    <TeamWorkspace
      currentUser={currentUser}
      allUsers={allUsers}
      activeTeam={team}
      onCreateTeam={onCreateTeam}
      onNavigateToDiscoveryWithRole={(_role: UserRole) => navigate('/discover')}
      onSendFeedback={onSendFeedback}
    />
  );
}

export default App;
