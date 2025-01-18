import React from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareProps {
  projectName: string;
  projectUrl: string;
  amount: string;
  chainSymbol: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  projectName,
  projectUrl,
  amount,
  chainSymbol
}) => {
  const message = `I just donated ${amount} ${chainSymbol} to ${projectName}! Support public goods on YouBuidl 🌱`;
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(projectUrl)}&hashtags=FundPublicGoods,YouBuidl`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}&quote=${encodeURIComponent(message)}`;
  const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(projectUrl)}&title=${encodeURIComponent(`Support ${projectName}`)}&summary=${encodeURIComponent(message)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="mt-4">
      <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
        <Share2 className="w-4 h-4" />
        Share
      </div>
      <div className="flex gap-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity"
        >
          <Twitter className="w-5 h-5" />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-[#4267B2] text-white hover:opacity-90 transition-opacity"
        >
          <Facebook className="w-5 h-5" />
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-[#0077B5] text-white hover:opacity-90 transition-opacity"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Link2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};