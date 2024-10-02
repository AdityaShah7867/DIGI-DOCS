'use client'
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import { useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import Script from 'next/script';  // Import Script to handle script injections

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/get/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = await response.json();
        
        if (userData.uploadedDocs) {
          const documentNames = userData.uploadedDocs.map(doc => doc?.documentId?.documentName);
          localStorage.setItem('documentNames', JSON.stringify(documentNames));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <Toaster position="top-center" />
        
        {/* Add the gtranslate wrapper div */}
        <div className="gtranslate_wrapper" style={{ position: 'fixed', bottom: '20px', right: '20px' }}></div>
        
        {/* Add the gtranslate settings script */}
        <Script id="gtranslate-settings" strategy="afterInteractive">
          {`
            window.gtranslateSettings = {
              default_language: "en",
              languages: ["en", "gu", "mr", "ta", "ml", "hi"],
              wrapper_selector: ".gtranslate_wrapper",
              switcher_horizontal_position: "left",
              switcher_vertical_position: "bottom",
              float_switcher_open_direction: "top",
              flag_style: "3d",
              dropdown_languages: ["en", "gu", "mr", "ta", "ml", "hi"]
            };
          `}
        </Script>

        {/* Add the external gtranslate script */}
        <Script 
          src="https://cdn.gtranslate.net/widgets/latest/float.js" 
          strategy="lazyOnload" 
          defer 
        />
        
        {children}
      </body>
    </html>
  );
}
