import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Copy, ExternalLink, QrCode, Code, Globe, Download, Upload, Moon, Sun, Palette } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import { toast } from 'sonner';
import { Chain, Project } from '../types';
import { SUPPORTED_CHAINS } from '../config/chains';
import { generateEmbedCode } from '../embed';
import DonationWidget from '../components/DonationWidget';

const THEME_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6B7280', // Gray
];

const CustomizerPage: React.FC = () => {
  const [project, setProject] = useState<Project>({
    id: crypto.randomUUID(),
    name: '',
    description: '',
    recipients: [{ address: '', chainId: 1, share: 100 }],
    theme: {
      primaryColor: '#3B82F6',
      buttonStyle: 'default',
      size: 'medium',
      darkMode: false,
    }
  });

  const [embedType, setEmbedType] = useState<'iframe' | 'button' | 'link' | 'qr' | 'npm'>('iframe');
  const [showPreview, setShowPreview] = useState(true);

  const addRecipient = () => {
    if (project.recipients.length < 5) {
      setProject(prev => ({
        ...prev,
        recipients: [...prev.recipients, { address: '', chainId: 1, share: 0 }]
      }));
      toast.success('Added new recipient');
    } else {
      toast.error('Maximum 5 recipients allowed');
    }
  };

  const removeRecipient = (index: number) => {
    if (project.recipients.length > 1) {
      setProject(prev => ({
        ...prev,
        recipients: prev.recipients.filter((_, i) => i !== index)
      }));
      toast.success('Removed recipient');
    }
  };

  const updateRecipient = (index: number, field: keyof Project['recipients'][0], value: string | number) => {
    setProject(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => 
        i === index ? { ...recipient, [field]: value } : recipient
      )
    }));
  };

  const copyToClipboard = async () => {
    try {
      const code = generateEmbedCode(project, embedType);
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy code');
    }
  };

  const isValidProject = () => {
    return (
      project.name.trim() !== '' &&
      project.recipients.every(r => r.address.match(/^0x[a-fA-F0-9]{40}$/)) &&
      project.recipients.reduce((sum, r) => sum + r.share, 0) === 100
    );
  };

  const embedCode = isValidProject() ? generateEmbedCode(project, embedType) : '';

  const exportProject = () => {
    try {
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(project, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${project.name.toLowerCase().replace(/\s+/g, '-')}-donation-config.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Project configuration exported successfully!');
    } catch (err) {
      console.error('Failed to export:', err);
      toast.error('Failed to export project configuration');
    }
  };

  const importProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedProject = JSON.parse(e.target?.result as string);
          setProject(importedProject);
          toast.success('Project configuration imported successfully!');
        } catch (err) {
          console.error('Failed to import project:', err);
          toast.error('Failed to import project configuration');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`min-h-screen ${project.theme.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src="https://youbuidl-x.vercel.app/logo-blue.svg"
              alt="YouBuidl"
              className="h-8 w-8"
            />
            <h1 className="text-4xl font-bold">YouBuidl Donation SDK</h1>
          </div>
          <p className="text-lg opacity-80">Create and customize your donation widget</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Project Configuration */}
            <div className={`rounded-xl shadow-lg p-6 ${project.theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Project Details</h2>
                <div className="flex gap-2">
                  <button
                    onClick={exportProject}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Export Configuration"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <label className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" title="Import Configuration">
                    <Upload className="w-5 h-5" />
                    <input
                      type="file"
                      accept=".json"
                      onChange={importProject}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => {
                      setProject(prev => ({
                        ...prev,
                        theme: { ...prev.theme, darkMode: !prev.theme.darkMode }
                      }));
                      toast.success(`Switched to ${project.theme.darkMode ? 'light' : 'dark'} mode`);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Toggle Dark Mode"
                  >
                    {project.theme.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={e => setProject(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      project.theme.darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="My Awesome Project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={project.description}
                    onChange={e => setProject(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      project.theme.darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Brief description of your project"
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium">
                      Recipients
                    </label>
                    <button
                      onClick={addRecipient}
                      disabled={project.recipients.length >= 5}
                      className={`text-blue-500 hover:text-blue-600 disabled:opacity-50 flex items-center ${
                        project.theme.darkMode ? 'text-blue-400 hover:text-blue-300' : ''
                      }`}
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Add Recipient
                    </button>
                  </div>

                  <div className="space-y-4">
                    {project.recipients.map((recipient, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={recipient.address}
                            onChange={e => updateRecipient(index, 'address', e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border ${
                              project.theme.darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300'
                            } focus:ring-2 focus:ring-blue-500`}
                            placeholder="0x..."
                          />
                        </div>

                        <div className="w-40">
                          <select
                            value={recipient.chainId}
                            onChange={e => updateRecipient(index, 'chainId', parseInt(e.target.value))}
                            className={`w-full px-3 py-2 rounded-lg border ${
                              project.theme.darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300'
                            } focus:ring-2 focus:ring-blue-500`}
                          >
                            {SUPPORTED_CHAINS.map(chain => (
                              <option key={chain.id} value={chain.id}>
                                {chain.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-24">
                          <input
                            type="number"
                            value={recipient.share}
                            onChange={e => updateRecipient(index, 'share', parseInt(e.target.value) || 0)}
                            className={`w-full px-3 py-2 rounded-lg border ${
                              project.theme.darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300'
                            } focus:ring-2 focus:ring-blue-500`}
                            placeholder="Share %"
                            min="0"
                            max="100"
                          />
                        </div>

                        <button
                          onClick={() => removeRecipient(index)}
                          disabled={project.recipients.length <= 1}
                          className="text-red-500 hover:text-red-600 disabled:opacity-50"
                        >
                          <MinusCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {project.recipients.reduce((sum, r) => sum + r.share, 0) !== 100 && (
                    <p className="text-red-500 text-sm mt-2">
                      Total share must equal 100%
                    </p>
                  )}
                </div>

                {/* Theme Customization */}
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Theme Customization
                  </label>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Color</label>
                      <div className="flex gap-2 flex-wrap">
                        {THEME_COLORS.map(color => (
                          <button
                            key={color}
                            onClick={() => setProject(prev => ({
                              ...prev,
                              theme: { ...prev.theme, primaryColor: color }
                            }))}
                            className={`w-8 h-8 rounded-full ${
                              project.theme.primaryColor === color ? 'ring-2 ring-offset-2' : ''
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <input
                          type="color"
                          value={project.theme.primaryColor}
                          onChange={e => setProject(prev => ({
                            ...prev,
                            theme: { ...prev.theme, primaryColor: e.target.value }
                          }))}
                          className="w-8 h-8 p-1 rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Button Style</label>
                      <div className="flex gap-2">
                        {(['default', 'rounded', 'pill'] as const).map(style => (
                          <button
                            key={style}
                            onClick={() => setProject(prev => ({
                              ...prev,
                              theme: { ...prev.theme, buttonStyle: style }
                            }))}
                            className={`px-4 py-2 border ${
                              project.theme.buttonStyle === style
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : project.theme.darkMode
                                ? 'border-gray-600 hover:border-gray-500'
                                : 'border-gray-300 hover:border-gray-400'
                            } ${
                              style === 'pill' ? 'rounded-full' :
                              style === 'rounded' ? 'rounded-lg' :
                              'rounded'
                            }`}
                          >
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Size</label>
                      <div className="flex gap-2">
                        {(['small', 'medium', 'large'] as const).map(size => (
                          <button
                            key={size}
                            onClick={() => setProject(prev => ({
                              ...prev,
                              theme: { ...prev.theme, size }
                            }))}
                            className={`px-4 py-2 border ${
                              project.theme.size === size
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : project.theme.darkMode
                                ? 'border-gray-600 hover:border-gray-500'
                                : 'border-gray-300 hover:border-gray-400'
                            } rounded-lg`}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Embed Options */}
            <div className={`rounded-xl shadow-lg p-6 ${project.theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-6">Embed Options</h2>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                <button
                  onClick={() => setEmbedType('iframe')}
                  className={`p-4 rounded-lg border ${
                    embedType === 'iframe'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : project.theme.darkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  } flex flex-col items-center gap-2`}
                >
                  <Globe className="w-6 h-6" />
                  <span>Website</span>
                </button>

                <button
                  onClick={() => setEmbedType('button')}
                  className={`p-4 rounded-lg border ${
                    embedType === 'button'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : project.theme.darkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  } flex flex-col items-center gap-2`}
                >
                  <Code className="w-6 h-6" />
                  <span>Button</span>
                </button>

                <button
                  onClick={() => setEmbedType('link')}
                  className={`p-4 rounded-lg border ${
                    embedType === 'link'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : project.theme.darkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  } flex flex-col items-center gap-2`}
                >
                  <ExternalLink className="w-6 h-6" />
                  <span>Link</span>
                </button>

                <button
                  onClick={() => setEmbedType('qr' )}
                  className={`p-4 rounded-lg border ${
                    embedType === 'qr'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : project.theme.darkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  } flex flex-col items-center gap-2`}
                >
                  <QrCode className="w-6 h-6" />
                  <span>QR Code</span>
                </button>

                <button
                  onClick={() => setEmbedType('npm')}
                  className={`p-4 rounded-lg border ${
                    embedType === 'npm'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : project.theme.darkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  } flex flex-col items-center gap-2`}
                >
                  <Code className="w-6 h-6" />
                  <span>NPM</span>
                </button>
              </div>

              <div className="relative">
                <pre className={`p-4 rounded-lg overflow-x-auto ${
                  project.theme.darkMode ? 'bg-gray-900' : 'bg-gray-900 text-gray-100'
                }`}>
                  <code>{embedCode || 'Complete the project details to generate embed code'}</code>
                </pre>

                {isValidProject() && (
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-8 space-y-4">
            <div className={`rounded-xl shadow-lg p-6 ${project.theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Live Preview</h2>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`text-sm px-3 py-1 rounded-lg ${
                    project.theme.darkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>

              {showPreview && (
                <div className={`p-4 rounded-lg ${
                  project.theme.darkMode ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                  <DonationWidget project={project} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizerPage;