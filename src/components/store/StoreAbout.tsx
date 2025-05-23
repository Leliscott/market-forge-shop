
import React from 'react';

interface StoreAboutProps {
  name: string;
  description: string;
  createdAt: string;
}

const StoreAbout: React.FC<StoreAboutProps> = ({ name, description, createdAt }) => {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">About {name}</h2>
      <p className="mb-4">{description}</p>
      <p className="text-sm text-muted-foreground">
        Store created on {new Date(createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default StoreAbout;
