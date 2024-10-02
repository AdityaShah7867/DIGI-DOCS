import React from 'react'
import NewsCard from './NewsCard.jsx';

const NewsPage = () => {
  const newsItems = [
    {
      title: 'DRDO Develops New Lightweight Bulletproof Jacket',
      date: '2023-11-15',
      summary: 'DRDO scientists have successfully created a new lightweight bulletproof jacket that offers enhanced protection while reducing fatigue for soldiers.',
    },
    {
      title: 'RAC Announces Recruitment Drive for Scientists',
      date: '2023-11-10',
      summary: 'The Recruitment and Assessment Centre (RAC) under DRDO has announced a new recruitment drive for scientists in various disciplines.',
    },
    {
      title: 'DRDO Successfully Tests New Missile Defense System',
      date: '2023-11-05',
      summary: 'DRDO has successfully conducted tests of its latest missile defense system, showcasing India\'s growing capabilities in defense technology.',
    },
    // Add more news items as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">RAC-DRDO News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((item, index) => (
          <NewsCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default NewsPage;