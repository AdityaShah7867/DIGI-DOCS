'use client'
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import { useEffect } from 'react';
import { Toaster } from "react-hot-toast";


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
        {children}
      </body>
    </html>
  );
}
