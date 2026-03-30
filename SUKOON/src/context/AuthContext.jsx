import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isMock = !auth || auth.app?.options?.apiKey === 'YOUR_API_KEY';

  useEffect(() => {
    if (isMock) {
      setTimeout(() => setLoading(false), 0);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [isMock]);

  const login = async (email, password) => {
    if (isMock) {
      setUser({ uid: 'mock-1', email, displayName: email.split('@')[0] });
      return;
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    if (isMock) {
      setUser({ uid: 'mock-1', email, displayName: email.split('@')[0] });
      return;
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    if (isMock) {
      setUser({ uid: 'mock-1', email: 'guest@example.com', displayName: 'Guest User' });
      return;
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (isMock) {
      setUser(null);
      return;
    }
    return signOut(auth);
  };

  const value = { user, loading, login, signup, loginWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
