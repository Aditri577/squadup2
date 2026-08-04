import React, { useState } from 'react';
import { User, Team, TeamRequest, UserRole } from './types';
import { INITIAL_USERS, INITIAL_HACKATHONS, INITIAL_TEAMS, INITIAL_REQUESTS } from './data/mockData';
import { Header } from './components/Header';
import { TeammateDiscovery } from './components/TeammateDiscovery';
import { AssessmentView } from './components/AssessmentView';
import { ProfileView } from './components/ProfileView';
import { TeamWorkspace } from './components/TeamWorkspace';
import { HackathonsList } from './components/HackathonsList';
import { InvitationsModal } from './components/InvitationsModal';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'discovery' | 'assessment' | 'profile' | 'teams' | 'hackathons'>('discovery');

  // Application Data State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default to Aditi Saxena
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);
  
  const [hackathons] = useState(INITIAL_HACKATHONS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [requests, setRequests] = useState<TeamRequest[]>(INITIAL_REQUESTS);

  const [showRequestsModal, setShowRequestsModal] = useState(false);

  // Filter pending requests for current user
  const pendingRequestsForUser = requests.filter(r => r.receiverId === currentUser.id && r.status === 'pending');

  // Active Team of current user
  const currentTeam = teams.find(t => t.id === currentUser.teamId) || null;

  // Handler: Switch User Identity
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setSelectedProfileUser(null);
  };

  // Handler: Update Current User Skills / Badges
  const handleUpdateUserSkills = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  // Handler: Update User Profile Info
  const handleUpdateProfile = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  // Handler: Send Team Invitation Request
  const handleSendTeamRequest = (newRequestData: Omit<TeamRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: TeamRequest = {
      ...newRequestData,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setRequests(prev => [newReq, ...prev]);
  };

  // Handler: Accept Team Invitation Request
  const handleAcceptRequest = (requestId: string) => {
    const targetReq = requests.find(r => r.id === requestId);
    if (!targetReq) return;

    // Update Request status
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r));

    // Update Team Membership
    setTeams(prev => prev.map(t => {
      if (t.id === targetReq.teamId) {
        return {
          ...t,
          members: [
            ...t.members,
            {
              userId: currentUser.id,
              role: targetReq.proposedRole,
              joinedAt: new Date().toISOString().split('T')[0],
              isLeader: false
            }
          ]
        };
      }
      return t;
    }));

    // Update User's teamId
    const updatedUser = { ...currentUser, teamId: targetReq.teamId };
    handleUpdateUserSkills(updatedUser);

    alert(`Success! You have joined ${targetReq.teamName}. Workspace updated.`);
  };

  // Handler: Reject Team Request
  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
  };

  // Handler: Create Team
  const handleCreateTeam = (newTeamData: Omit<Team, 'id' | 'createdAt'>) => {
    const teamId = `team-${Date.now()}`;
    const newTeam: Team = {
      ...newTeamData,
      id: teamId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTeams(prev => [newTeam, ...prev]);

    // Attach teamId to current user
    const updatedUser = { ...currentUser, teamId };
    handleUpdateUserSkills(updatedUser);
  };

  // Handler: Navigate to Discovery with Role filter
  const handleNavigateToDiscoveryWithRole = (role: UserRole) => {
    setActiveTab('discovery');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      
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
      />

      {/* Main View Container */}
      <main className="pb-16">
        
        {/* DISCOVERY TAB */}
        {activeTab === 'discovery' && (
          selectedProfileUser ? (
            <ProfileView
              user={selectedProfileUser}
              isCurrentUser={selectedProfileUser.id === currentUser.id}
            />
          ) : (
            <TeammateDiscovery
              currentUser={currentUser}
              allUsers={users}
              onSelectUser={(u) => setSelectedProfileUser(u)}
              onSendTeamRequest={handleSendTeamRequest}
              activeTeamName={currentTeam?.name || 'Team Nexus'}
              activeHackathonName={currentTeam?.hackathonName || 'AI Innovations Global Hackathon 2026'}
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

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <ProfileView
            user={currentUser}
            isCurrentUser={true}
            onUpdateProfile={handleUpdateProfile}
            onTakeTestClick={() => setActiveTab('assessment')}
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

    </div>
  );
}

export default App;
