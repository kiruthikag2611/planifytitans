'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // The custom error provides a detailed message.
      // We don't need a generic title and description anymore.
      // The error message itself is now informative enough.
      console.error("Firestore Permission Error:", error.message);
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: error.message, // The error itself contains the rich context
        duration: 20000, // Show for longer
      });

      // We re-throw the error here to make it visible in the Next.js dev overlay
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
