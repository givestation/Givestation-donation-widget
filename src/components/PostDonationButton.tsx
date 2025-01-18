import React, { useState } from 'react';
import { Coins } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import DonationWidget from './DonationWidget';

interface PostDonationButtonProps {
  post: {
    id: string;
    title?: string;
    content: string;
    coverImage?: string;
    author: {
      id: string;
      name: string;
      donationConfig?: {
        recipients: {
          address: string;
          chainId: number;
          share: number;
        }[];
        theme?: {
          primaryColor: string;
          buttonStyle: 'default' | 'rounded' | 'pill';
          size: 'small' | 'medium' | 'large';
          darkMode: boolean;
        };
      };
    };
  };
}

export const PostDonationButton: React.FC<PostDonationButtonProps> = ({ post }) => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();

  if (!post.author.donationConfig?.recipients?.length) {
    return null;
  }

  const project = {
    id: post.author.id,
    name: post.author.name,
    recipients: post.author.donationConfig.recipients,
    theme: post.author.donationConfig.theme || {
      primaryColor: '#3B82F6',
      buttonStyle: 'rounded',
      size: 'small',
      darkMode: false
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDonationModal(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
      >
        <Coins className="w-4 h-4" />
        <span>Support</span>
      </button>

      {showDonationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <button
              onClick={() => setShowDonationModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-black/20 transition-colors z-10"
            >
              ×
            </button>
            <DonationWidget
              project={project}
              connectedChainId={chainId}
              userAddress={address}
              postDetails={{
                title: post.title,
                content: post.content,
                coverImage: post.coverImage
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};