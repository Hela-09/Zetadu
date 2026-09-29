import React, { useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Quiz from './Quiz';
import { ALL_SUBJECTS } from '../data/subjects';

export default function Practice({ setView }: { setView?: (v: any) => void }) {
  const { subjectId } = useParams<{ subjectId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const querySubject = subjectId || searchParams.get('subject');

  const matchedSubject = useMemo(() => {
    if (!querySubject) return null;
    return (
      ALL_SUBJECTS.find(
        (s) =>
          s.id.toLowerCase() === querySubject.toLowerCase() ||
          s.name.toLowerCase() === querySubject.toLowerCase()
      ) || null
    );
  }, [querySubject]);

  const initialConfig = useMemo(() => {
    if (!matchedSubject) return undefined;
    return {
      subject: matchedSubject.name,
      subjectId: matchedSubject.id,
    };
  }, [matchedSubject]);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else if (matchedSubject) {
      navigate(`/subjects/${matchedSubject.id}`);
    } else if (setView) {
      setView('learn');
    } else {
      navigate('/home');
    }
  };

  return (
    <Quiz
      key={matchedSubject?.id || 'general-practice'}
      setView={setView}
      initialConfig={initialConfig}
      onBack={handleBack}
    />
  );
}

