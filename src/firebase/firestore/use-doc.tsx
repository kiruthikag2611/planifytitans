'use client';

import {
  doc,
  onSnapshot,
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseDocOptions<T> {
  initialData?: T;
}

export function useDoc<T>(
  pathOrRef: string | DocumentReference<DocumentData> | null,
  options?: UseDocOptions<T>
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(options?.initialData ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const memoizedRef = useMemo<DocumentReference<DocumentData> | null>(() => {
    if (!pathOrRef || !firestore) return null;
    if (typeof pathOrRef === 'string') {
      return doc(firestore, pathOrRef);
    }
    return pathOrRef;
  }, [pathOrRef, firestore]);

  useEffect(() => {
    if (!memoizedRef) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          const docData = snapshot.data();
          const newData = { ...docData, id: snapshot.id } as unknown as T;

          // Prevent unnecessary state updates (deep compare)
          setData((currentData) => {
            try {
              if (JSON.stringify(currentData) === JSON.stringify(newData)) {
                return currentData;
              }
            } catch {
              // If stringify fails for some reason, fall back to updating
            }
            return newData;
          });
        } else {
          // Document does not exist -> clear data
          setData(null);
        }

        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        // Convert/emit permission error and set state
        try {
          const permissionError = new FirestorePermissionError({
            path: memoizedRef.path,
            operation: 'get',
          });
          errorEmitter.emit('permission-error', permissionError);
        } catch {
          // ignore if construction/emit fails
        }

        setError(err);
        setLoading(false);
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch {
        // ignore unsubscribe errors
      }
    };
  }, [memoizedRef]);

  return { data, loading, error };
}


