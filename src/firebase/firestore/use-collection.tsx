
'use client';

import {
  collection,
  onSnapshot,
  query,
  where,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseCollectionOptions<T> {
  initialData?: T[];
}

export function useCollection<T>(
  pathOrQuery: string | Query | null,
  options?: UseCollectionOptions<T>
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(options?.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  
  const memoizedQuery = useMemo(() => {
    if (!pathOrQuery || !firestore) return null;
    if (typeof pathOrQuery === 'string') {
        const ref = collection(firestore, pathOrQuery);
        return query(ref); // Always return a query
    }
    return pathOrQuery;
  }, [pathOrQuery, firestore]);

  useEffect(() => {
    if (!memoizedQuery) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();
          // Use a consistent ID property, preferring a field like eventId or activityId, but falling back to the document ID.
          const docId = docData.eventId || docData.activityId || doc.id;
          result.push({ ...docData, id: docId, eventId: docId } as T);
        });
        
        setData(prevData => {
            // Prevent re-render if the new data is identical to the old data.
            if (JSON.stringify(prevData) === JSON.stringify(result)) {
              return prevData;
            }
            return result;
        });

        setLoading(false);
        setError(null);
      },
      async (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: 'path' in memoizedQuery ? memoizedQuery.path : 'unknown path',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);

        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery]);

  return { data, loading, error };
}
