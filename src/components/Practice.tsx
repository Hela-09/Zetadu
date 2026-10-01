import React, { useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Quiz from './Quiz';
import { ALL_SUBJECTS } from '../data/subjects';
import { appNavigateBack } from '../utils/navigationHistory';

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

  const isSessionActive = searchParams.get('session') === 'active';

  const handleBack = () => {
    if (isSessionActive) {
      // In active session: back goes to the subject setup
      if (matchedSubject) {
        navigate(`/practice/${matchedSubject.id}`);
      } else {
        navigate('/practice');
      }
    } else if (matchedSubject) {
      // On subject setup: back goes to practice subject list or previous screen
      appNavigateBack(navigate, { fallback: '/practice' });
    } else {
      // On practice list: back goes to wherever user came from (e.g. /learn, /home)
      appNavigateBack(navigate, { fallback: '/learn' });
    }
  };

  return (
    <Quiz
      key={`${matchedSubject?.id || 'general-practice'}-${isSessionActive ? 'session' : 'setup'}`}
      setView={setView}
      initialConfig={initialConfig}
      onBack={handleBack}
      onSelectSubject={(selectedSub) => {
        navigate(`/practice/${selectedSub.id}`);
      }}
      onBackToSubjects={() => {
        appNavigateBack(navigate, { fallback: '/practice' });
      }}
      onStartSession={() => {
        const subId = matchedSubject?.id || subjectId || 'general';
        navigate(`/practice/${subId}?session=active`);
      }}
    />
  );
}

