import React from 'react';

export const Test = ({ callback }: { callback: (code: string) => void }) => {
  return (
    <>
      <button onClick={() => callback('test')} />
    </>
  );
};
