export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface Chain {
  id: number;
  name: string;
  nativeCurrency: NativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconUrl: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  image?: string;
  recipients: {
    address: string;
    chainId: number;
    share: number;
  }[];
  theme: {
    primaryColor: string;
    buttonStyle: 'default' | 'rounded' | 'pill';
    size: 'small' | 'medium' | 'large';
    darkMode: boolean;
  };
}