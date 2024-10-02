import React from 'react'
import Image from 'next/image'

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">About RAC - DRDO</h1>
      
      <div className="mb-8 text-center">
        <Image
          src="/download.png"
          alt="DRDO Logo"
          width={200}
          height={200}
          className="mx-auto rounded-lg shadow-lg"
        />
      </div>
      
      <section className="mb-12 md:flex md:items-center">
        <div className="md:w-1/2 md:pr-8">
          <h2 className="text-2xl font-semibold mb-4">Recruitment and Assessment Centre (RAC)</h2>
          <p className="text-lg">
            The Recruitment and Assessment Centre (RAC) is a pivotal division of the Defence Research and Development Organisation (DRDO). We are responsible for the recruitment of scientific and technical personnel for various DRDO laboratories and establishments across India.
          </p>
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0">
          <Image
            src="/download.jpg"
            alt="DRDO Building"
            width={500}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      <section className="mb-12 bg-gray-100 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg">
          Our mission is to identify, assess, and recruit the most talented and qualified individuals to contribute to India's defence research and development initiatives. We strive to ensure a fair, transparent, and efficient recruitment process.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features of Our Portal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Online application', icon: '📝' },
            { name: 'Document verification', icon: '✅' },
            { name: 'Status tracking', icon: '🔍' },
            { name: 'Candidate management', icon: '👥' },
            { name: 'Job updates', icon: '🔔' }
          ].map((feature, index) => (
            <div key={index} className="bg-blue-100 p-4 rounded-lg shadow flex items-center">
              <span className="text-4xl mr-3">{feature.icon}</span>
              <p className="text-lg font-semibold">{feature.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="list-decimal list-inside text-lg space-y-2">
          <li>Create an account on our portal</li>
          <li>Complete your profile and upload necessary documents</li>
          <li>Browse and apply for suitable job openings</li>
          <li>Track your application status</li>
          <li>Receive notifications for further steps in the recruitment process</li>
        </ol>
      </section>

      <section className="bg-gray-200 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="text-lg">
          For any queries regarding the recruitment process or technical support, please contact us at{' '}
          <a href="mailto:support@rac-drdo.gov.in" className="text-blue-600 hover:underline">support@rac-drdo.gov.in</a> or visit our{' '}
          <a href="/faq" className="text-blue-600 hover:underline">FAQ page</a>.
        </p>
      </section>
    </div>
  )
}

export default AboutPage