import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useSwitchChain, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Coins, ExternalLink, Share2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Chain, Project } from '../types';
import { SUPPORTED_CHAINS } from '../config/chains';
import { SocialShare } from './SocialShare';

interface PostDetails {
  title?: string;
  content: string;
  coverImage?: string;
}

interface DonationWidgetProps {
  project: Project;
  postDetails?: PostDetails;
}

const DonationWidget: React.FC<DonationWidgetProps> = ({ project, postDetails }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [selectedChain, setSelectedChain] = useState<Chain>(SUPPORTED_CHAINS[0]);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');

  const { data: balance } = useBalance({
    address,
    chainId: selectedChain.id,
  });

  const handleChainSelect = async (chain: Chain) => {
    setSelectedChain(chain);
    if (switchChain) {
      try {
        await switchChain({ chainId: chain.id });
        toast.success(`Switched to ${chain.name}`);
      } catch (err) {
        console.error('Failed to switch network:', err);
        toast.error(`Failed to switch to ${chain.name}`);
      }
    }
  };

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      setError('Please enter a valid amount');
      return;
    }

    const promise = async () => {
      try {
        setLoading(true);
        setError('');

        if (!address) {
          throw new Error('Please connect your wallet');
        }

        if (chainId !== selectedChain.id) {
          throw new Error(`Please switch to ${selectedChain.name}`);
        }

        const chainRecipients = project.recipients.filter(r => r.chainId === selectedChain.id);
        
        if (chainRecipients.length === 0) {
          throw new Error(`No recipients configured for ${selectedChain.name}`);
        }

        const totalShares = chainRecipients.reduce((sum, r) => sum + r.share, 0);
        const valueInWei = parseEther(amount);

        for (const recipient of chainRecipients) {
          const recipientAmount = (valueInWei * BigInt(recipient.share)) / BigInt(totalShares);
          
          const { hash } = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: address,
              to: recipient.address,
              value: `0x${recipientAmount.toString(16)}`,
            }],
          });

          setTxHash(hash);
        }
        
        setSuccess(true);
        setAmount('');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Transaction failed';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    };

    toast.promise(promise(), {
      loading: 'Processing donation...',
      success: 'Thank you for your donation! 🎉',
      error: (err) => err.message,
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Banner Area */}
      {postDetails?.coverImage && (
        <div className="relative h-40 w-full">
          <img
            src={postDetails.coverImage}
            alt={postDetails.title || project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {postDetails.title && (
              <h3 className="text-lg font-semibold mb-1">{postDetails.title}</h3>
            )}
            <p className="text-sm opacity-90 line-clamp-2">{postDetails.content}</p>
          </div>
        </div>
      )}

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src="https://youbuidl-x.vercel.app/logo-blue.svg"
              alt="YouBuidl"
              className="h-6 w-6 mr-2"
            />
            <h2 className="text-xl font-bold text-gray-800">{project.name}</h2>
          </div>
          {address && (
            <div className="text-sm text-gray-500">
              Balance: {balance ? formatEther(balance.value) : '0'} {selectedChain.nativeCurrency.symbol}
            </div>
          )}
        </div>

        {project.description && (
          <p className="text-gray-600 text-sm mb-4">{project.description}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Network
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SUPPORTED_CHAINS.map((chain) => (
              <button
                key={chain.id}
                onClick={() => handleChainSelect(chain)}
                className={`flex items-center justify-center p-2 rounded-lg border ${
                  selectedChain.id === chain.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <img
                  src={chain.iconUrl}
                  alt={chain.name}
                  className="w-6 h-6"
                />
              </button>
            ))}
          </div>
        </div>

        {!address ? (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Coins className="w-5 h-5 mr-2" />
                Connect Wallet
              </button>
            )}
          </ConnectButton.Custom>
        ) : success ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-green-100">
              <Heart className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-green-500 font-semibold mb-2">
              Thank you for your donation!
            </div>
            <a
              href={`${selectedChain.blockExplorerUrls[0]}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 flex items-center justify-center gap-1 mb-2"
            >
              View on Explorer
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => setSuccess(false)}
              className="text-blue-500 hover:text-blue-600 mb-4"
            >
              Make another donation
            </button>
            <SocialShare
              projectName={project.name}
              projectUrl={window.location.href}
              amount={amount}
              chainSymbol={selectedChain.nativeCurrency.symbol}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ({selectedChain.nativeCurrency.symbol})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleDonate}
              disabled={loading || !amount}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Donate'}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {address && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>

      {/* YouBuidl Branding */}
      <div className="px-6 py-3 border-t border-gray-100">
        <a
          href="https://youbuidl.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-600 transition-colors"
        >
          <img
            src="https://youbuidl-x.vercel.app/logo-blue.svg"
            alt="YouBuidl"
            className="h-4 w-4"
          />
          <span>Powered by YouBuidl</span>
        </a>
      </div>
    </div>
  );
};

export default DonationWidget;