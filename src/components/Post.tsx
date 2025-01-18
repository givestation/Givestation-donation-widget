import React from 'react';
import { PostDonationButton } from './PostDonationButton';

interface PostProps {
  post: {
    id: string;
    content: string;
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

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{post.author.name}</h3>
          <p className="mt-2">{post.content}</p>
        </div>
        <PostDonationButton author={post.author} />
      </div>
    </div>
  );
};