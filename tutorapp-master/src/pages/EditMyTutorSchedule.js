import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/ctx/AuthContext';
import { getHourFromDate } from '../helpers';

const EditMyTutorSchedule = () => {
  const [authContext] = useContext(AuthContext);

  const [schedule, setSchedule] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    dateString: '',
    startHourString: '',
    endHourString: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/Schedules/${authContext.user.username}`
        );
        setSchedule(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [authContext.user.username]);

  const handleNewScheduleChange = ({ target: { value, name } }) => {
    setNewSchedule({
      ...newSchedule,
      [name]: value,
    });
  };

  const handleDeleteFromSchedule = async (id) => {
    setSchedule(schedule.filter((item) => item.id !== id));

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/Schedules/Delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authContext.jwt.token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToSchedule = async (e) => {
    e.preventDefault();
    try {
      const startDate = new Date(newSchedule.dateString);
      const startDateHour = newSchedule.startHourString.split(':');
      startDate.setHours(Number(startDateHour[0]));
      startDate.setMinutes(startDateHour[1]);

      const endDate = new Date(newSchedule.dateString);
      const endDateHour = newSchedule.endHourString.split(':');

      endDate.setHours(Number(endDateHour[0]));
      endDate.setMinutes(endDateHour[1]);

      const tempScheduleBody = {
        isRepeatable: true,
        repeatAfterWeeks: 0,
        endOfRepetition: endDate.toISOString(),
        startAt: startDate.toISOString(),
        endAt: endDate.toISOString(),
      };

      startDate.setHours(Number(startDateHour[0]) + 2);
      endDate.setHours(Number(endDateHour[0]) + 2);

      const newScheduleBody = {
        isRepeatable: true,
        repeatAfterWeeks: 0,
        endOfRepetition: endDate.toISOString(),
        startAt: startDate.toISOString(),
        endAt: endDate.toISOString(),
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Schedules/Create`,
        newScheduleBody,
        {
          headers: {
            Authorization: `Bearer ${authContext.jwt.token}`,
          },
        }
      );

      setSchedule([...schedule, tempScheduleBody]);

      setNewSchedule({
        dateString: '',
        startHourString: '',
        endHourString: '',
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className='h4 mt-3'>Dodaj termin</h1>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>Data korepetycji</th>
            <th scope='col'>Godzina rozpoczęcia</th>
            <th scope='col'>Godzina zakończenia</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type='text'
                className='input'
                value={newSchedule.dateString}
                onChange={handleNewScheduleChange}
                name='dateString'
                placeholder='mm-dd-rrrr'
              />
            </td>
            <td>
              <input
                type='text'
                name='startHourString'
                onChange={handleNewScheduleChange}
                value={newSchedule.startHourString}
                className='input'
                placeholder='hh:mm'
              />
            </td>
            <td>
              <input
                type='text'
                className='input'
                name='endHourString'
                value={newSchedule.endHourString}
                onChange={handleNewScheduleChange}
                placeholder='hh:mm'
              />
            </td>
            <td>
              <button className='btn btn-success' onClick={handleAddToSchedule}>
                Dodaj termin
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <h1 className='h4 mt-5'>Moje terminy</h1>
      {/* Table */}
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>Data</th>
            <th scope='col'>Godzina rozpoczęcia</th>
            <th scope='col'>Godzina zakończenia</th>
            <th scope='col'>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {schedule.length ? (
            schedule.map((scheduleItem) => (
              <tr key={scheduleItem.id}>
                <th scope='row'>
                  {new Date(scheduleItem.startAt).toISOString().slice(0, 10)}
                </th>
                <td>{getHourFromDate(new Date(scheduleItem.startAt))}</td>
                <td>{getHourFromDate(new Date(scheduleItem.endAt))}</td>
                <td>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDeleteFromSchedule(scheduleItem.id)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4'>
                <p>Brak terminów</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EditMyTutorSchedule;
