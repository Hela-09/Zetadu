import React from 'react';
import Quiz from './Quiz';

export default function Practice({ setView }: { setView: (v: any) => void }) {
  return <Quiz setView={setView} />;
}
