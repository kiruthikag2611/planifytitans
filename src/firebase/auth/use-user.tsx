
'use client';

import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuth } from '../provider';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
<<<<<<< HEAD

type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLogin: any;
  answers?: { [key: string]: string };
}
=======
>>>>>>> 44a3bc7 (Try fixing this error: `Console Error: FirebaseError: Missing or insuffi)

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    if (!auth) {
      setStatus('loading');
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setStatus('authenticated');
        
        // Save user to firestore
        if (firestore) {
          const userRef = doc(firestore, 'users', firebaseUser.uid);
<<<<<<< HEAD
          const userData: Partial<UserProfile> = {
=======
          const userData = {
>>>>>>> 44a3bc7 (Try fixing this error: `Console Error: FirebaseError: Missing or insuffi)
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            lastLogin: serverTimestamp(),
          };
<<<<<<< HEAD
          setDoc(userRef, userData, { merge: true }).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'update',
=======
          
          setDoc(userRef, userData, { merge: true }).catch((serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'update', // or 'create' depending on logic
>>>>>>> 44a3bc7 (Try fixing this error: `Console Error: FirebaseError: Missing or insuffi)
              requestResourceData: userData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
        }
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, status };
}
