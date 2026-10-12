import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'DineIntellect | AI Restaurant Operations & Retention Copilot',
  description: 'Enterprise AI decision-support intelligence and customer retention copilot for restaurant general managers.',
  openGraph: {
    title: 'DineIntellect | AI Restaurant Operations & Retention Copilot',
    description: 'Enterprise AI decision-support intelligence and customer retention copilot for restaurant general managers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DineIntellect | AI Restaurant Operations & Retention Copilot',
    description: 'Enterprise AI decision-support intelligence and customer retention copilot for restaurant general managers.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
