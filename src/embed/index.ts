import { Project } from '../types';

export const generateEmbedCode = (project: Project, type: 'iframe' | 'button' | 'link' | 'qr' | 'npm') => {
  const baseUrl = 'https://youbuidl.xyz';
  const projectData = encodeURIComponent(JSON.stringify(project));

  switch (type) {
    case 'iframe':
      return `<iframe
  src="${baseUrl}/embed?project=${projectData}"
  width="100%"
  height="400px"
  style="border:none;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"
  title="YouBuidl Donation Widget - ${project.name}"
></iframe>`;

    case 'button':
      return `<button
  onclick="window.open('${baseUrl}/donate?project=${projectData}', 'youbuidl-donation-widget', 'width=400,height=600')"
  style="background:${project.theme.primaryColor};color:white;padding:8px 16px;border-radius:${
    project.theme.buttonStyle === 'pill' ? '9999px' :
    project.theme.buttonStyle === 'rounded' ? '8px' :
    '4px'
  };border:none;cursor:pointer;font-family:system-ui,-apple-system,sans-serif;font-size:${
    project.theme.size === 'small' ? '14px' :
    project.theme.size === 'large' ? '18px' :
    '16px'
  };"
>
  Support ${project.name}
</button>`;

    case 'link':
      return `${baseUrl}/donate?project=${projectData}`;

    case 'qr':
      return `${baseUrl}/qr?project=${projectData}`;

    case 'npm':
      return `npm install @youbuidl/donation-sdk

import { DonationWidget } from '@youbuidl/donation-sdk';

const project = ${JSON.stringify(project, null, 2)};

<DonationWidget project={project} />`;

    default:
      throw new Error('Invalid embed type');
  }
};