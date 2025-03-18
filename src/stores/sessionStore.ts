import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { ref, set as firebaseSet, onValue, off, update } from 'firebase/database';
import { database } from '@src/firebase/config';

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
      
      // Save to Firebase
      await firebaseSet(ref(database, `sessions/${sessionId}`), session);
      
      // Listen for changes
      const sessionRef = ref(database, `sessions/${sessionId}`);
      onValue(sessionRef, (snapshot) => {
        const updatedSession = snapshot.val();
        if (updatedSession) {
          set({ currentSession: updatedSession });
        }
      });
      
      set({ 
        currentSession: session, 
        currentParticipant: participant,
        loading: false 
      });
      
      return sessionId;
    } catch (error) {
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
      // Check if session exists
      const sessionRef = ref(database, `sessions/${sessionId}`);
      
      return new Promise<void>((resolve, reject) => {
        onValue(sessionRef, async (snapshot) => {
          const session = snapshot.val() as Session | null;
          
          if (!session) {
            set({ 
              error: 'Session not found', 
              loading: false 
            });
            off(sessionRef);
            reject(new Error('Session not found'));
            return;
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
          const updatedParticipants = {
            ...session.participants,
            [participantId]: participant
          };
          
          await update(ref(database, `sessions/${sessionId}`), {
            participants: updatedParticipants
          });
          
          set({ 
            currentSession: { ...session, participants: updatedParticipants },
            currentParticipant: participant,
            loading: false 
          });
          
          // Keep listening for changes
          onValue(sessionRef, (snapshot) => {
            const updatedSession = snapshot.val();
            if (updatedSession) {
              set({ currentSession: updatedSession });
            }
          });
          
          resolve();
        }, { onlyOnce: true });
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to join session', 
        loading: false 
      });
      throw error;
    }
  },
  
  leaveSession: async () => {
    const { currentSession, currentParticipant } = get();
    if (!currentSession || !currentParticipant) return;
    
    set({ loading: true, error: null });
    try {
      const sessionRef = ref(database, `sessions/${currentSession.id}`);
      
      // Remove listener
      off(sessionRef);
      
      const updatedParticipants = { ...currentSession.participants };
      delete updatedParticipants[currentParticipant.id];
      
      // If no participants left, delete the session
      if (Object.keys(updatedParticipants).length === 0) {
        await firebaseSet(ref(database, `sessions/${currentSession.id}`), null);
      } else {
        // Otherwise update participants
        await update(ref(database, `sessions/${currentSession.id}`), {
          participants: updatedParticipants
        });
      }
      
      set({ 
        currentSession: null, 
        currentParticipant: null,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to leave session', 
        loading: false 
      });
    }
  },
  
  castVote: async (vote: string) => {
    const { currentSession, currentParticipant } = get();
    if (!currentSession || !currentParticipant) return;
    
    set({ loading: true, error: null });
    try {
      const updatedParticipant = {
        ...currentParticipant,
        vote,
      };
      
      await update(
        ref(database, `sessions/${currentSession.id}/participants/${currentParticipant.id}`), 
        { vote }
      );
      
      set({ 
        currentParticipant: updatedParticipant,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cast vote', 
        loading: false 
      });
    }
  },
  
  revealVotes: async () => {
    const { currentSession } = get();
    if (!currentSession) return;
    
    set({ loading: true, error: null });
    try {
      await update(ref(database, `sessions/${currentSession.id}`), {
        isRevealed: true
      });
      
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reveal votes', 
        loading: false 
      });
    }
  },
  
  resetVotes: async () => {
    const { currentSession } = get();
    if (!currentSession) return;
    
    set({ loading: true, error: null });
    try {
      // Reset votes for all participants
      const updatedParticipants = { ...currentSession.participants };
      
      Object.values(updatedParticipants).forEach((participant) => {
        participant.vote = null;
      });
      
      await update(ref(database, `sessions/${currentSession.id}`), {
        isRevealed: false,
        participants: updatedParticipants
      });
      
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset votes', 
        loading: false 
      });
    }
  },
}));

export default useSessionStore; 