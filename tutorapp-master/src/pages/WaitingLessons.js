import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/ctx/AuthContext';
import { getHourFromDate } from '../helpers';

const WaitingTuts = () => {
  const [authContext] = useContext(AuthContext);

  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/Lessons/Planned`,
          {
            headers: {
              Authorization: `Bearer ${authContext.jwt.token}`,
            },
          }
        );

        setLessons(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [authContext.jwt.token]);

  const handleAcceptLesson = async (lessonId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Lessons/Accept`,
        { lessonId },
        { headers: { Authorization: `Bearer ${authContext.jwt.token}` } }
      );

      setLessons(
        lessons.map((lesson) => {
          if (lesson.id === lessonId)
            return {
              ...lesson,
              isAccepted: true,
            };
          else return lesson;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleRejectLesson = async (lessonId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/Lessons/Reject`,
        {
          headers: { Authorization: `Bearer ${authContext.jwt.token}` },
          data: {
            lessonId,
          },
        }
      );

      setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className='my-4 h3'>Oczekujące lekcje</h1>
      {/* Table */}
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>Data</th>
            <th scope='col'>Użytkownik</th>
            <th scope='col'>Godzina</th>
            <th scope='col'>Przedmiot</th>
            <th scope='col'>Rezerwacja</th>
            <th scope='col'>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {lessons.length ? (
            lessons.map((lessonItem) => (
              <tr key={lessonItem.id}>
                <th scope='row'>
                  {new Date(lessonItem.startAt).toISOString().slice(0, 10)}
                </th>
                <th>{lessonItem.studentUsername}</th>
                <td>
                  {getHourFromDate(new Date(lessonItem.startAt))} -{' '}
                  {getHourFromDate(new Date(lessonItem.endAt))}
                </td>

                <td>{lessonItem.topic}</td>
                <td>
                  {lessonItem.isAccepted ? (
                    <span className='text-success'>Tak</span>
                  ) : (
                    <span className='text-danger'>Nie</span>
                  )}
                </td>
                <td>
                  {lessonItem.isAccepted ? (
                    <>
                      <button disabled className='btn btn-success disabled'>
                        Zaakceptowano
                      </button>

                      <button
                        className='btn btn-danger ml-2'
                        onClick={() => handleRejectLesson(lessonItem.id)}
                      >
                        Usuń
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className='btn btn-warning'
                        onClick={() => handleAcceptLesson(lessonItem.id)}
                      >
                        Zaakceptuj
                      </button>
                      <button
                        className='btn btn-danger ml-2'
                        onClick={() => handleRejectLesson(lessonItem.id)}
                      >
                        Odrzuć
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='6'>
                <p>Brak terminów</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WaitingTuts;
