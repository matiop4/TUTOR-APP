import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { getHourFromDate } from '../helpers';
import { AuthContext } from '../components/ctx/AuthContext';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

const TutorProfile = (props) => {
  const username = props.match.params.username;
  const [authContext] = useContext(AuthContext);
  const [tutor, setTutor] = useState({});
  const [ratingInfo, setRatingInfo] = useState('');
  const [rating, setRating] = useState(() => {
    const localRating = JSON.parse(localStorage.getItem('rating')) || [];
    const findRating = localRating.find(
      (rating) => rating.username === username
    );

    if (findRating) return findRating.rating;
    else return 0;
  });
  const [reserved, setReserved] = useState(
    JSON.parse(localStorage.getItem('reserved')) || []
  );
  const [occupied, setOccupied] = useState(
    JSON.parse(localStorage.getItem('occupied')) || []
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/Tutors/${username}`
        );

        // Get tutor's schedule
        const { data: scheduleData } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/Schedules/${username}`
        );

        const schedule = scheduleData.map((item) => ({
          ...item,
          topic: '',
        }));

        setTutor({ ...data, schedule });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [username]);

  const handleSelectTopicChange = (scheduleItem, value) => {
    setTutor({
      ...tutor,
      schedule: tutor.schedule.map((item) => {
        if (item.id === scheduleItem.id)
          return {
            ...item,
            topic: value,
          };
        else return item;
      }),
    });
  };

  const handleChangeRating = (rating) => {
    if (authContext.isAuth) {
      setRating(rating);
      const localRating = JSON.parse(localStorage.getItem('rating')) || [];
      const filteredRatings = localRating.filter(
        (item) => item.username !== username
      );

      localStorage.setItem(
        'rating',
        JSON.stringify([...filteredRatings, { username, rating }])
      );

      setRatingInfo({ msg: 'Dziękujemy za ocenę!', type: 'success' });
    } else {
      setRatingInfo({
        msg: 'Zaloguj się, aby zostawić ocenę!',
        type: 'danger',
      });
    }

    setTimeout(() => {
      setRatingInfo({ msg: '', type: '' });
    }, 5000);
  };

  const handleReserveSchedule = async (scheduleItem) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Lessons/Reserve`,
        {
          scheduleId: scheduleItem.id,
          tutorUsername: username,
          isRepeatable: true,
          repeatAfterWeeks: 0,
          startAt: scheduleItem.startAt,
          endAt: scheduleItem.endAt,
          topic: scheduleItem.topic,
        },
        {
          headers: {
            Authorization: `Bearer ${authContext.jwt.token}`,
          },
        }
      );
      const newReserved = [...reserved, scheduleItem.id];
      setReserved(newReserved);
      localStorage.setItem('reserved', JSON.stringify(newReserved));
    } catch (err) {
      console.log(err);
      const newOccupied = [...occupied, scheduleItem.id];
      setOccupied(newOccupied);
      localStorage.setItem('occupied', JSON.stringify(newOccupied));
    }
  };

  return (
    <div>
      <div className='row'>
        <div className='col-12 mx-auto'>
          <div className='card'>
            <div className='card-body'>
              <div className='row'>
                <div className='col-12 col-lg-8 col-md-6'>
                  <h3 className='mb-0 text-truncated'>
                    {tutor.firstName} {tutor.lastName}
                  </h3>
                  <p className='lead'>{tutor.location}</p>
                  <p className='h6'>Opis korepetytora:</p>
                  <p>{tutor.description}</p>
                  <p className='h6'>Nauczane przedmioty:</p>
                  <span>
                    {tutor.topics?.length
                      ? tutor.topics?.map((topic, index) => (
                          <span
                            key={index}
                            className='badge badge-info tags mr-1 p-2'
                          >
                            {topic}
                          </span>
                        ))
                      : 'Brak przedmiotów'}
                  </span>

                  <p className='h6 mt-4'>Ocena prowadzonych zajęć:</p>
                  <div>
                    <StarRatings
                      rating={rating}
                      starRatedColor='#ffc107'
                      changeRating={handleChangeRating}
                      numberOfStars={5}
                      name='rating'
                      starSpacing='0'
                      starDimension='30px'
                      starHoverColor='gold'
                    />
                    {ratingInfo.msg && (
                      <p className={`text-${ratingInfo.type} mt-2`}>
                        {ratingInfo.msg}
                      </p>
                    )}
                  </div>
                </div>
                <div className='col-12 col-lg-4 col-md-6 text-center'>
                  <img
                    src='/images/avatar-placeholder.png'
                    alt=''
                    className='mx-auto w-50 rounded-circle img-fluid'
                  />
                  <br />
                </div>
                {/*/col*/}
              </div>
              {/*/row*/}
            </div>
            {/*/card-block*/}
          </div>
        </div>
      </div>
      {/* Schedule table */}
      <h1 className='mt-5 h3 mb-4'>Zarezerwuj termin korepetycji:</h1>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>Data</th>
            <th scope='col'>Godzina rozpoczęcia</th>
            <th scope='col'>Godzina zakończenia</th>
            <th scope='col'>Wybierz przedmiot</th>
            <th scope='col'>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {!authContext.isAuth ? (
            <tr>
              <td colSpan='5'>
                <Link to='/logowanie'>Zaloguj się</Link> lub{' '}
                <Link to='/rejestracja'>zarejestruj</Link> aby skorzystać z
                korepetycji!
              </td>
            </tr>
          ) : tutor.schedule?.length ? (
            tutor.schedule?.map((scheduleItem) => (
              <tr key={scheduleItem.id}>
                <th scope='row'>
                  {new Date(scheduleItem.startAt).toISOString().slice(0, 10)}
                </th>
                <td>{getHourFromDate(new Date(scheduleItem.startAt))}</td>
                <td>{getHourFromDate(new Date(scheduleItem.endAt))}</td>
                <td>
                  <select
                    value={scheduleItem.topic}
                    className='form-control'
                    disabled={
                      reserved.includes(scheduleItem.id) ||
                      occupied.includes(scheduleItem.id)
                    }
                    name='selectTopic'
                    onChange={({ target: { value } }) =>
                      handleSelectTopicChange(scheduleItem, value)
                    }
                  >
                    <option value='' disabled>
                      Wybierz przedmiot
                    </option>
                    {tutor.topics?.length &&
                      tutor.topics?.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  {reserved.includes(scheduleItem.id) ? (
                    <Link to='/moje-korepetycje' className='btn btn-info'>
                      Sprawdź status
                    </Link>
                  ) : occupied.includes(scheduleItem.id) ? (
                    <button className='btn btn-danger' disabled>
                      Termin jest już zajęty!
                    </button>
                  ) : scheduleItem.topic ? (
                    <button
                      className='btn btn-success'
                      onClick={() => handleReserveSchedule(scheduleItem)}
                    >
                      Zapytaj o rezerwację
                    </button>
                  ) : (
                    <button
                      className='btn btn-warning'
                      disabled
                      onClick={() => handleReserveSchedule(scheduleItem)}
                    >
                      Nie wybrano przedmiotu
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='5'>
                <p>Brak wolnych terminów</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TutorProfile;
