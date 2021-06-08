import React, { useState } from 'react';
import FilterSidebar from '../components/Layout/FilterSidebar';
import TutorsList from '../components/TutorsList';

const Home = () => {
  const [filters, setFilters] = useState({
    SearchString: '',
    Localization: '',
    SelectedTopics: '',
    RemoteLessons: false,
    LocalLessons: false,
  });
  return (
    <div className='row'>
      <FilterSidebar setFilters={setFilters} filters={filters} />
      <TutorsList filters={filters} />
    </div>
  );
};

export default Home;
