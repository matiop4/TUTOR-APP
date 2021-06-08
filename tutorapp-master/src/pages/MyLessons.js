import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/ctx/AuthContext';
import { getHourFromDate } from '../helpers';

const MyLessons = () => {
  const [authContext] = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/Lessons/Planned`,
          { headers: { Authorization: `Bearer ${authContext.jwt.token}` } }
        );

        setLessons(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [authContext.jwt.token]);

  return (
    <div>
      <h1 className='my-4 h3'>Moje korepetycje</h1>
      {/* Table */}
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>Data</th>
            <th scope='col'>Korepetytor</th>
            <th scope='col'>Godzina</th>
            <th scope='col'>Przedmiot</th>
            <th scope='col'>Status</th>
          </tr>
        </thead>
        <tbody>
          {lessons.length ? (
            lessons.map((lessonItem) => (
              <tr key={lessonItem.id}>
                <th scope='row'>
                  {new Date(lessonItem.startAt).toISOString().slice(0, 10)}
                </th>
                <th>{lessonItem.tutorUsername}</th>
                <td>
                  {getHourFromDate(new Date(lessonItem.startAt))} -{' '}
                  {getHourFromDate(new Date(lessonItem.endAt))}
                </td>
                <td>{lessonItem.topic}</td>
                <td>
                  {lessonItem.isAccepted ? (
                    <span className='text-success'>Zaakceptowane</span>
                  ) : (
                    <span className='text-warning'>Oczekuje na akceptację</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='6'>
                <p>Brak korepetycji</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyLessons;
