import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { http, createConfig } from '@wagmi/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Toaster } from 'sonner';
import {
  mainnet,
  optimism,
  polygon,
  base,
  arbitrum,
  scroll,
  celo,
  zkSync,
  blast
} from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import App from './App.tsx';
import './index.css';

const config = getDefaultConfig({
  appName: 'YouBuidl Donation SDK',
  projectId: '37b5e2fccd46c838885f41186745251e',
  chains: [mainnet, optimism, polygon, base, arbitrum, scroll, celo, zkSync, blast],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [scroll.id]: http(),
    [celo.id]: http(),
    [zkSync.id]: http(),
    [blast.id]: http(),
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'white',
                color: 'black',
                border: '1px solid #E2E8F0',
              },
              className: 'my-toast-class',
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);