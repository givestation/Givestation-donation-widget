import React from 'react';
import DonationWidget from '../components/DonationWidget';
import { Project } from '../types';

const EmbedPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const projectData = params.get('project');
  
  if (!projectData) {
    return (
      <div className="p-4 text-red-500">
        Invalid project data
      </div>
    );
  }

  try {
    const project: Project = JSON.parse(decodeURIComponent(projectData));
    return <DonationWidget project={project} />;
  } catch (err) {
    return (
      <div className="p-4 text-red-500">
        Failed to parse project data
      </div>
    );
  }
};

export default EmbedPage;