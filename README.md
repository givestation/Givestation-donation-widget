# GiveStation Donation SDK Documentation

## Overview
The GiveStation Donation SDK provides an easy and customizable way to integrate crypto donation functionalities into your platforms. It supports multiple blockchain networks, various embed options, and extensive customization for seamless integration into your web applications or content platforms.

---

## Core Components

### 1. **DonationWidget**
The primary widget for accepting crypto donations. It can be embedded as an iframe or directly integrated into React applications.

### 2. **PostDonationButton**
A button component for embedding donations directly into blog posts or articles, enabling seamless monetization for creators.

### 3. **CustomizerPage**
A visual builder for creating and customizing donation widgets. This feature allows users to personalize their widgets to match their brand identity.

---

## Features
- **Multi-chain Support**: Supports Ethereum, Optimism, Polygon, Base, Arbitrum, Scroll, Celo, zkSync, and Blast networks.
- **Multiple Recipients**: Customizable share splits among multiple recipients.
- **Theme Customization**: Modify colors, button styles, sizes, and enable dark mode.
- **Embed Options**:
  - iframe
  - Button
  - Link
  - QR Code
  - NPM package
- **Wallet Connection**: Powered by RainbowKit.
- **Transaction Handling**: Utilizes ethers.js for seamless transaction processing.
- **Type Safety**: Built with TypeScript for robust development.

---

## Installation Guide

### 1. Websites (Using iframe)
Embed the widget in your website with a simple iframe:

```html
<iframe
  src="https://youbuidl.xyz/embed?project={PROJECT_CONFIG}"
  width="100%"
  height="400px"
  style="border:none;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"
  title="Donation Widget"
></iframe>
```

### 2. React Applications (Using NPM Package)
#### Installation
Run the following command to install the package:
```bash
npm install @youbuidl/donation-sdk
```

#### Usage
Import and integrate the `DonationWidget` into your React component:

```javascript
import { DonationWidget } from '@youbuidl/donation-sdk';

const MyPage = () => {
  const project = {
    id: 'unique-id',
    name: 'My Project',
    recipients: [
      {
        address: '0x...', // Recipient wallet address
        chainId: 1, // Ethereum Mainnet
        share: 100 // Percentage share
      }
    ],
    theme: {
      primaryColor: '#3B82F6',
      buttonStyle: 'rounded',
      size: 'medium',
      darkMode: false
    }
  };

  return <DonationWidget project={project} />;
};
```

### 3. Blog Platforms
#### Integration
Use the `PostDonationButton` to add donation functionalities to blog posts:

```javascript
import { PostDonationButton } from '@youbuidl/donation-sdk';

const BlogPost = ({ post }) => {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <PostDonationButton
        post={{
          id: post.id,
          title: post.title,
          content: post.excerpt,
          coverImage: post.image,
          author: {
            id: 'author-id',
            name: 'Author Name',
            donationConfig: {
              recipients: [
                {
                  address: '0x...',
                  chainId: 1,
                  share: 100
                }
              ]
            }
          }
        }}
      />
    </article>
  );
};
```

### 4. Individual Creators (Quick Setup)
1. Visit [Givestation/widget](https://youbuidl.xyz).
2. Click **"Create Widget"**.
3. Fill in your details:
   - Name and description
   - Wallet addresses and networks
4. Customize the appearance of your widget.
5. Choose your preferred embed option:
   - Website embed code
   - Shareable link
   - QR code for mobile
6. Copy and use the generated code or link.

---

## Supported Networks
- **Ethereum Mainnet**
- **Optimism**
- **Polygon**
- **Base**
- **Arbitrum One**
- **Scroll**
- **Celo**
- **zkSync Era**
- **Blast**

---

## Best Practices

### Multiple Recipients
- Use multiple recipients to split donations among team members.
- Ensure shares add up to 100%.
- Consider using a multisig wallet for team funds.

### Network Selection
- Choose networks with lower gas fees for smaller donations.
- Support multiple networks to provide donors with options.
- Leverage Layer 2 solutions for better user experiences.

### Integration Tips
- Test the widget thoroughly before deployment.
- Provide clear donation instructions.
- Add suggested donation amounts for guidance.
- Show appreciation messages after successful donations.

### Customization
- Match widget colors to your brand identity.
- Choose button sizes that fit your design.
- Enable dark mode for compatibility with dark themes.
- Use clear call-to-action text on buttons.

---

## Security Considerations
- **Verify Recipient Addresses**: Double-check recipient wallet addresses.
- **Use Secure Wallets**: Always use hardware wallets for receiving funds.
- **Multisig Wallets**: Consider using multisig wallets for team projects.
- **Monitor Transactions**: Regularly review transactions for anomalies.
- **Private Key Management**: Keep private keys secure and confidential.

---

## Conclusion
This documentation provides a comprehensive guide to integrating and customizing the GiveStation Donation SDK. Follow the installation and integration steps carefully, and leverage the customization options to enhance donor engagement. If you have any questions or require further assistance, feel free to contact our support team.

