import Image from "next/image";

export default function Home() {
 
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
   

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">DRDO Recruitment</h1>
          <p className="text-xl text-gray-600 mb-8">Join us in making India stronger through innovation and technology.</p>
          
          <div className="flex justify-center space-x-4 mb-12">
            <a
              href="/auth/login" Update with actual careers page URL
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Apply Now
            </a>
            <a
              href="/about" // Update with actual about page URL
              className="bg-white text-blue-600 px-6 py-3 rounded-md border border-blue-600 hover:bg-blue-50 transition duration-300"
            >
              Learn More
            </a>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <img src="https://cdn.zeebiz.com/sites/default/files/styles/zeebiz_850x478/public/2019/03/27/79988-drdo-dare-to-dream.jpg?itok=dj_QeS9e"/>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Join DRDO?</h2>
            <ul className="list-disc text-left text-gray-600 pl-6 space-y-2">
              <li>Contribute to national security and technological advancement</li>
              <li>Work on cutting-edge research and development projects</li>
              <li>Collaborate with top scientists and engineers</li>
              <li>Access to state-of-the-art facilities and resources</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">DRDO</h3>
              <p className="mt-2 text-sm text-gray-400">Defence Research and Development Organisation</p>
            </div>
            <div className="w-full md:w-1/3 text-center mb-4 md:mb-0">
              <a href="https://drdo.gov.in/contact" className="hover:text-blue-400 transition duration-300">Contact Us</a>
            </div>
            <div className="w-full md:w-1/3 text-center md:text-right">
              <a href="https://drdo.gov.in/news" className="hover:text-blue-400 transition duration-300">Latest News</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
