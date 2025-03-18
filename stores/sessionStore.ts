import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { database } from '../firebase/config';
import { 
  ref, 
  set as firebaseSet,
  get as firebaseGet,
  onValue,
  remove,
  update,
  onDisconnect,
  off,
  DataSnapshot,
  DatabaseReference
} from 'firebase/database';

// Define paths for Firebase
const SESSIONS_PATH = 'sessions';

// Helper function to get Firebase reference
const getSessionRef = (sessionId: string): DatabaseReference => ref(database, `${SESSIONS_PATH}/${sessionId}`);
const getParticipantRef = (sessionId: string, participantId: string): DatabaseReference => 
  ref(database, `${SESSIONS_PATH}/${sessionId}/participants/${participantId}`);

export type Participant = {
  id: string;
  name: string;
  vote: string | null;
  isRevealed: boolean;
  image: string | null;
};

export type Session = {
  id: string;
  name: string;
  participants: Record<string, Participant>;
  creator: string;
  isRevealed: boolean;
  createdAt: number;
};

// Helper function to get image based on participant initials
const getParticipantImage = (name: string): string | null => {
  if (!name) return null;
  
  // Extract initials from name
  const nameParts = name.split(' ');
  let initials;
  
  if (nameParts.length >= 2) {
    // First letter of first and last name
    initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
  } else {
    // If only one name, use first two letters or just first letter
    initials = name.length >= 2 ? name.substring(0, 2) : `${name[0]}`;
  }
  
  // Return the initials only, we'll resolve the actual image path later
  return initials.toUpperCase();
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

const useSessionStore = create<SessionState>((set, get) => {
  // Store references to unsubscribe from Firebase listeners
  let sessionUnsubscribe: (() => void) | null = null;
  
  return {
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
          image: getParticipantImage(creatorName)
        };
        
        const session: Session = {
          id: sessionId,
          name: `${creatorName}'s Session`,
          participants: { [participantId]: participant },
          creator: participantId,
          isRevealed: false,
          createdAt: Date.now(),
        };
        
        try {
          // Firebase implementation
          console.log('Saving session to Firebase:', sessionId);
          const sessionRef = getSessionRef(sessionId);
          await firebaseSet(sessionRef, session);
          console.log('Session saved to Firebase successfully');
          
          // Subscribe to session changes
          const unsubscribe = onValue(sessionRef, (dataSnapshot: DataSnapshot) => {
            const updatedSessionData = dataSnapshot.val();
            if (updatedSessionData) {
              const updatedSession = updatedSessionData as Session;
              set({
                currentSession: updatedSession,
                loading: false
              });
            }
          });
          
          // Clean up previous subscription if exists
          if (sessionUnsubscribe) {
            sessionUnsubscribe();
          }
          sessionUnsubscribe = unsubscribe;
          
          set({
            currentSession: session,
            currentParticipant: participant,
            loading: false
          });
          
          console.log('Session created successfully with ID:', sessionId);
          return sessionId;
        } catch (firebaseError) {
          console.error('Firebase error creating session:', firebaseError);
          set({ 
            error: firebaseError instanceof Error ? firebaseError.message : 'Failed to save session to Firebase', 
            loading: false 
          });
          throw firebaseError;
        }
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
        
        // Create participant with same details for both implementations
        const participantId = uuidv4();
        const participant: Participant = {
          id: participantId,
          name: participantName,
          vote: null,
          isRevealed: false,
          image: getParticipantImage(participantName)
        };
        
        try {
          const sessionRef = getSessionRef(sessionId);
          const snapshot = await firebaseGet(sessionRef);
          
          // Type safety with Firebase DataSnapshot - explicitly handle snapshot methods
          if (snapshot && typeof snapshot.exists === 'function' && !snapshot.exists()) {
            console.error('Session not found:', sessionId);
            set({
              error: 'Session not found',
              loading: false
            });
            throw new Error('Session not found');
          }
          
          // We know the data exists at this point
          const sessionData = snapshot && typeof snapshot.val === 'function' ? snapshot.val() : null;
          if (!sessionData) {
            console.error('Invalid session data for ID:', sessionId);
            set({
              error: 'Invalid session data',
              loading: false
            });
            throw new Error('Invalid session data');
          }
          
          const session = sessionData as Session;
          console.log('Successfully retrieved session:', session.id, 'with', Object.keys(session.participants || {}).length, 'participants');
          
          // Add participant to session
          const participantRef = getParticipantRef(sessionId, participantId);
          await firebaseSet(participantRef, participant);
          console.log('Added participant to session:', participantId);
          
          // Set up automatic cleanup on disconnect
          await onDisconnect(participantRef).remove();
          
          // Subscribe to session changes
          const unsubscribe = onValue(sessionRef, (dataSnapshot: DataSnapshot) => {
            const updatedSessionData = dataSnapshot.val();
            if (updatedSessionData) {
              const updatedSession = updatedSessionData as Session;
              set({
                currentSession: updatedSession,
                loading: false
              });
            } else {
              // Session was deleted
              set({
                currentSession: null,
                currentParticipant: null,
                loading: false,
                error: 'Session ended'
              });
              
              // Clean up subscription
              if (sessionUnsubscribe) {
                sessionUnsubscribe();
                sessionUnsubscribe = null;
              }
            }
          });
          
          // Clean up previous subscription if exists
          if (sessionUnsubscribe) {
            sessionUnsubscribe();
          }
          sessionUnsubscribe = unsubscribe;
          
          set({
            currentSession: session,
            currentParticipant: participant,
            loading: false
          });
        } catch (error) {
          console.error('Firebase error joining session:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to join session with Firebase', 
            loading: false 
          });
          throw error;
        }
        
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
        // Firebase implementation
        const participantRef = getParticipantRef(currentSession.id, currentParticipant.id);
        await remove(participantRef);
        
        // Unsubscribe from session updates
        if (sessionUnsubscribe) {
          sessionUnsubscribe();
          sessionUnsubscribe = null;
        }
        
        // If user is creator and there are no other participants, delete the session
        if (currentSession.creator === currentParticipant.id) {
          const participantCount = Object.keys(currentSession.participants).length;
          if (participantCount <= 1) {
            const sessionRef = getSessionRef(currentSession.id);
            await remove(sessionRef);
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
        // Firebase implementation
        const participantRef = getParticipantRef(currentSession.id, currentParticipant.id);
        await update(participantRef, { vote });
        
        const updatedParticipant = {
          ...currentParticipant,
          vote,
        };
        
        set({
          currentParticipant: updatedParticipant,
          loading: false
        });
        
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
        // Firebase implementation
        const sessionRef = getSessionRef(currentSession.id);
        await update(sessionRef, { isRevealed: true });
        
        set({
          loading: false
        });
        
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
        // Firebase implementation
        const sessionRef = getSessionRef(currentSession.id);
        
        // First update isRevealed flag
        await update(sessionRef, { isRevealed: false });
        
        // Then reset all votes
        const participantUpdates: Record<string, any> = {};
        
        Object.keys(currentSession.participants).forEach(participantId => {
          participantUpdates[`participants/${participantId}/vote`] = null;
        });
        
        await update(sessionRef, participantUpdates);
        
        // Update local participant
        const { currentParticipant } = get();
        if (currentParticipant) {
          const updatedParticipant = {
            ...currentParticipant,
            vote: null,
          };
          
          set({
            currentParticipant: updatedParticipant,
            loading: false
          });
        } else {
          set({
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
  };
});

export default useSessionStore; 