import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';

const TutorListItem = (tutor) => {
  const {
    firstName,
    description = 'Brak opisu',
    lastName,
    username,
  } = tutor.tutor;

  return (
    <div className='p-0 col-md-4 p-2'>
      <div className='card h-100'>
        <div className='card-header w-100 font-weight-bold'>{username}</div>
        <div className='card-body'>
          <img
            src='/images/avatar-placeholder.png'
            alt='avatar'
            className='d-block w-25 mx-auto'
          />
          <h5 className='card-title text-center mt-2'>
            {firstName} {lastName}
          </h5>
          <p className='card-text'>{description}</p>
        </div>
        <Link to={`/korepetytor/${username}`} className='btn btn-secondary m-2'>
          Zobacz profil
        </Link>
      </div>
    </div>
  );
};

const TutorsList = ({ filters }) => {
  const [tutorsList, setTutorsList] = useState([]);

  useEffect(() => {
    (async () => {
      let generateFilters = {};

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          generateFilters = {
            ...generateFilters,
            [key]: filters[key],
          };
        }
      });

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Tutors`,
        {
          params: generateFilters,
          paramsSerializer: (params) => qs.stringify(params),
        }
      );

      setTutorsList(data);
    })();
  }, [filters]);

  return (
    <div className='col-sm-9 row flex-row'>
      {tutorsList.length ? (
        tutorsList.map((tutor, index) => (
          <TutorListItem key={index} tutor={tutor} />
        ))
      ) : (
        <div className='p-4 mt-2 w-100 bg-light card'>
          <h1 className='h3'>Brak korepetytorów</h1>
        </div>
      )}
    </div>
  );
};

export default TutorsList;
