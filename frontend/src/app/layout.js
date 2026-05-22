import '../styles/globals.css';
import { AppProvider } from '../context/AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';
import AlertNotifications from '../components/AlertNotifications';

export const metadata = {
  title: 'Pooja & Festival Essentials Platform | Sacred E-Commerce',
  description: 'Order authentic pooja items, customizable festival kits, and access step-by-step spiritual guides tailored to regional traditions in India.',
  keywords: 'Pooja kits, Festival essentials, Satyanarayana Vratham, Diwali Pooja, Hindu rituals, Indian traditional items',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Razorpay SDK for Web Payments */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-cream text-darkslate transition-colors duration-300">
        <AppProvider>
          <Header />
          <main className="flex-grow bg-mandala pb-16">
            {children}
          </main>
          <Footer />
          <AIChatbot />
          <AlertNotifications />
        </AppProvider>
      </body>
    </html>
  );
}
