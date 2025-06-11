import React from 'react';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen w-full bg-gray-900 p-6 font-sans text-white">
      <h1 className="mb-6 text-3xl font-semibold">{title}</h1>
      {children}
    </div>
  );
};
