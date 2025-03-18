import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

// Mock implementation for sessions - no Firebase dependencies
const mockSessions: Record<string, Session> = {};

export type Participant = {
  id: string;
  name: string;
  vote: string | null;
  isRevealed: boolean;
};

export type Session = {
  id: string;
  name: string;
  participants: Record<string, Participant>;
  creator: string;
  isRevealed: boolean;
  createdAt: number;
};

interface SessionState {
  currentSession: Session | null;
  currentParticipant: Participant | null;
  loading: boolean;
  error: string | null;
  
  // Session actions
  createSession: (creatorName: string) => Promise<string>;
  joinSession: (sessionId: string, participantName: string) => Promise<void>;
  leaveSession: () => Promise<void>;
  
  // Voting actions
  castVote: (vote: string) => Promise<void>;
  revealVotes: () => Promise<void>;
  resetVotes: () => Promise<void>;
}

const useSessionStore = create<SessionState>((set, get) => ({
  currentSession: null,
  currentParticipant: null,
  loading: false,
  error: null,
  
  createSession: async (creatorName: string) => {
    set({ loading: true, error: null });
    try {
      console.log('Creating session for:', creatorName);
      // Generate session ID
      const sessionId = uuidv4().substring(0, 8).toUpperCase();
      const participantId = uuidv4();
      
      const participant: Participant = {
        id: participantId,
        name: creatorName,
        vote: null,
        isRevealed: false,
      };
      
      const session: Session = {
        id: sessionId,
        name: `${creatorName}'s Session`,
        participants: { [participantId]: participant },
        creator: participantId,
        isRevealed: false,
        createdAt: Date.now(),
      };
      
      // Save to mock storage
      mockSessions[sessionId] = session;
      
      set({ 
        currentSession: session, 
        currentParticipant: participant,
        loading: false 
      });
      
      console.log('Session created successfully with ID:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create session', 
        loading: false 
      });
      throw error;
    }
  },
  
  joinSession: async (sessionId: string, participantName: string) => {
    set({ loading: true, error: null });
    try {
      console.log('Joining session:', sessionId, 'as', participantName);
      
      // Check if session exists in mock storage
      const session = mockSessions[sessionId];
      if (!session) {
        const error = new Error('Session not found');
        set({ 
          error: 'Session not found', 
          loading: false 
        });
        throw error;
      }
      
      // Create participant
      const participantId = uuidv4();
      const participant: Participant = {
        id: participantId,
        name: participantName,
        vote: null,
        isRevealed: false,
      };
      
      // Add participant to session
      session.participants[participantId] = participant;
      
      set({ 
        currentSession: session,
        currentParticipant: participant,
        loading: false 
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error joining session:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to join session', 
        loading: false 
      });
      throw error;
    }
  },
  
  leaveSession: async () => {
    const { currentSession, currentParticipant } = get();
    if (!currentSession || !currentParticipant) return Promise.resolve();
    
    set({ loading: true, error: null });
    try {
      // Remove participant from session
      const session = mockSessions[currentSession.id];
      if (session) {
        delete session.participants[currentParticipant.id];
        
        // If no participants left, delete the session
        if (Object.keys(session.participants).length === 0) {
          delete mockSessions[currentSession.id];
        }
      }
      
      set({ 
        currentSession: null, 
        currentParticipant: null,
        loading: false 
      });
      
      return Promise.resolve();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to leave session', 
        loading: false 
      });
      return Promise.resolve();
    }
  },
  
  castVote: async (vote: string) => {
    const { currentSession, currentParticipant } = get();
    if (!currentSession || !currentParticipant) return Promise.resolve();
    
    set({ loading: true, error: null });
    try {
      // Update participant vote
      const session = mockSessions[currentSession.id];
      if (session && session.participants[currentParticipant.id]) {
        session.participants[currentParticipant.id].vote = vote;
        
        const updatedParticipant = {
          ...currentParticipant,
          vote,
        };
        
        set({ 
          currentParticipant: updatedParticipant,
          currentSession: session,
          loading: false 
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cast vote', 
        loading: false 
      });
      return Promise.resolve();
    }
  },
  
  revealVotes: async () => {
    const { currentSession } = get();
    if (!currentSession) return Promise.resolve();
    
    set({ loading: true, error: null });
    try {
      // Update session to reveal votes
      const session = mockSessions[currentSession.id];
      if (session) {
        session.isRevealed = true;
        set({ 
          currentSession: session,
          loading: false 
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reveal votes', 
        loading: false 
      });
      return Promise.resolve();
    }
  },
  
  resetVotes: async () => {
    const { currentSession } = get();
    if (!currentSession) return Promise.resolve();
    
    set({ loading: true, error: null });
    try {
      // Reset votes and isRevealed state
      const session = mockSessions[currentSession.id];
      if (session) {
        session.isRevealed = false;
        
        // Reset votes for all participants
        Object.keys(session.participants).forEach(participantId => {
          session.participants[participantId].vote = null;
        });
        
        set({ 
          currentSession: session,
          loading: false 
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset votes', 
        loading: false 
      });
      return Promise.resolve();
    }
  },
}));

export default useSessionStore; 