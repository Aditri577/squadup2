import React, { useState, useEffect } from 'react';
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

export function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('squadup_is_authenticated') === 'true';
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<'discovery' | 'assessment' | 'profile' | 'teams' | 'hackathons' | 'leaderboard'>('discovery');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Application Data State loaded from Backend API
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [requests, setRequests] = useState<TeamRequest[]>(INITIAL_REQUESTS);
  const [feedbacks, setFeedbacks] = useState<TeammateFeedback[]>([]);
  const [hackathons] = useState(INITIAL_HACKATHONS);

  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load state from backend on mount
  const loadState = async () => {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      if (data) {
        setUsers(data.users || []);
        setTeams(data.teams || []);
        setRequests(data.requests || []);
        setFeedbacks(data.feedback || []);
        
        // Sync current user with latest server data
        const savedCurrent = localStorage.getItem('squadup_current_user');
        let currentParsed = savedCurrent ? JSON.parse(savedCurrent) : null;
        if (currentParsed) {
          const updatedCurrent = (data.users || []).find((u: any) => u.id === currentParsed.id);
          if (updatedCurrent) {
            setCurrentUser(updatedCurrent);
          } else {
            setCurrentUser((data.users || [])[0] || currentParsed);
          }
        } else {
          setCurrentUser((data.users || [])[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load backend state, falling back to mock defaults", err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadState();
  }, []);

  // Sync auth state to LocalStorage
  React.useEffect(() => {
    localStorage.setItem('squadup_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('squadup_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Filter pending requests for current user
  const pendingRequestsForUser = requests.filter(r => r.receiverId === currentUser.id && r.status === 'pending');

  // Active Team of current user
  const currentTeam = teams.find(t => t.id === currentUser.teamId) || null;

  // Handler: Switch User Identity
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setSelectedProfileUser(null);
  };

  // Handler: Register User
  const handleRegisterUser = async (newUser: User) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (data.success) {
        await loadState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Update Current User Skills / Badges
  const handleUpdateUserSkills = async (updatedUser: User) => {
    try {
      const res = await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      const data = await res.json();
      if (data.success) {
        await loadState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Update User Profile Info
  const handleUpdateProfile = async (updatedUser: User) => {
    try {
      const res = await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      const data = await res.json();
      if (data.success) {
        await loadState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Send Team Invitation Request
  const handleSendTeamRequest = async (newRequestData: Omit<TeamRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: TeamRequest = {
      ...newRequestData,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
      const data = await res.json();
      if (data.success) {
        await loadState();
        alert(`Invitation request sent to receiver!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Accept Team Invitation Request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' })
      });
      const data = await res.json();
      if (data.success) {
        await loadState();
        alert("Invitation accepted! Workspace loaded.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Reject Team Request
  const handleRejectRequest = async (requestId: string) => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      const data = await res.json();
      if (data.success) {
        await loadState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Create Team
  const handleCreateTeam = async (newTeamData: Omit<Team, 'id' | 'createdAt'>) => {
    const teamId = `team-${Date.now()}`;
    const newTeam: Team = {
      ...newTeamData,
      id: teamId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam)
      });
      const data = await res.json();
      if (data.success) {
        await loadState();
        alert(`Success! Team ${newTeam.name} created.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Submit Teammate Feedback Endorsement
  const handleSendFeedback = async (feedbackData: { senderId: string; senderName: string; receiverId: string; teamId: string; rating: number; comment: string; tags: string[] }) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      const data = await res.json();
      if (data.success) {
        await loadState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Navigate to Discovery with Role filter
  const handleNavigateToDiscoveryWithRole = (role: UserRole) => {
    setActiveTab('discovery');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0915] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-purple-300 font-bold tracking-widest uppercase">Connecting to Database...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, render Auth Gateway screen
  if (!isAuthenticated) {
    return (
      <AuthView
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
        allUsers={users}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  return (
    <div className="min-h-screen nixtio-bg text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedProfileUser(null);
          setActiveTab(tab);
        }}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        pendingRequestsCount={pendingRequestsForUser.length}
        onOpenRequestsModal={() => setShowRequestsModal(true)}
        onLogout={() => setIsAuthenticated(false)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main View Container */}
      <main className="pb-16">
        
        {/* DISCOVERY TAB */}
        {activeTab === 'discovery' && (
          selectedProfileUser ? (
            <ProfileView
              user={selectedProfileUser}
              isCurrentUser={selectedProfileUser.id === currentUser.id}
              feedbacks={feedbacks.filter(f => f.receiverId === selectedProfileUser.id)}
            />
          ) : (
            <TeammateDiscovery
              currentUser={currentUser}
              allUsers={users}
              onSelectUser={(u) => setSelectedProfileUser(u)}
              onSendTeamRequest={handleSendTeamRequest}
              activeTeamName={currentTeam?.name || 'Team Nexus'}
              activeHackathonName={currentTeam?.hackathonName || 'AI Innovations Global Hackathon 2026'}
              onNavigateToAssessment={() => setActiveTab('assessment')}
            />
          )
        )}

        {/* SKILL ASSESSMENT ENGINE TAB */}
        {activeTab === 'assessment' && (
          <AssessmentView
            currentUser={currentUser}
            onUpdateUserSkills={handleUpdateUserSkills}
          />
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            allUsers={users}
            feedbacks={feedbacks}
            currentUser={currentUser}
          />
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <ProfileView
            user={currentUser}
            isCurrentUser={true}
            onUpdateProfile={handleUpdateProfile}
            onTakeTestClick={() => setActiveTab('assessment')}
            feedbacks={feedbacks.filter(f => f.receiverId === currentUser.id)}
          />
        )}

        {/* TEAMS & WORKSPACE TAB */}
        {activeTab === 'teams' && (
          <TeamWorkspace
            currentUser={currentUser}
            allUsers={users}
            activeTeam={currentTeam}
            onCreateTeam={handleCreateTeam}
            onNavigateToDiscoveryWithRole={handleNavigateToDiscoveryWithRole}
            onSendFeedback={handleSendFeedback}
          />
        )}

        {/* HACKATHONS TAB */}
        {activeTab === 'hackathons' && (
          <HackathonsList
            hackathons={hackathons}
            onSelectHackathonFilter={(hackathonTitle) => {
              setActiveTab('discovery');
            }}
          />
        )}

      </main>

      {/* INVITATIONS MODAL / DRAWER */}
      {showRequestsModal && (
        <InvitationsModal
          requests={pendingRequestsForUser}
          onClose={() => setShowRequestsModal(false)}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
        />
      )}

      {/* GLOBAL COMMAND PALETTE MODAL (CMD + K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        users={users}
        hackathons={hackathons}
        onSelectUser={(u) => setSelectedProfileUser(u)}
        onNavigateTab={(tab) => {
          setSelectedProfileUser(null);
          setActiveTab(tab);
        }}
      />

    </div>
  );
}

export default App;
