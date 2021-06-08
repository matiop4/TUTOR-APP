import axios from 'axios';
import React, { useContext, useState } from 'react';
import Alert from '../components/Alert';
import { AuthContext } from '../components/ctx/AuthContext';

const CreateTutorProfile = (props) => {
  const [authContext, authDispatch] = useContext(AuthContext);

  const [tutorState, setTutorState] = useState({
    location: '',
    remoteLessons: false,
    onSiteLessons: false,
    description: '',
    subjects: '',
  });
  const [alert, setAlert] = useState({ msg: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const topics = tutorState.subjects.split(' ');

      const tutorBody = {
        location: tutorState.location,
        hasRemoteLessons: tutorState.remoteLessons,
        hasLocalLessons: tutorState.onSiteLessons,
        description: tutorState.description,
        topics,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Tutors/Create`,
        tutorBody,
        {
          headers: {
            Authorization: `Bearer ${authContext.jwt.token}`,
          },
        }
      );

      setAlert({ msg: 'Gratulacje! Zostałeś korepetytorem!', type: 'success' });
      authDispatch({ type: 'CREATE_TUTOR', payload: tutorBody });
      props.history.push('/moj-profil');
    } catch (err) {
      console.error(err.message);
      setAlert({
        msg: 'Wystąpił błąd podczas tworzenia profilu',
        type: 'danger',
      });
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setTutorState({
      ...tutorState,
      [name]: value,
    });
  };

  const handleCheckboxChange = ({ target: { name, checked } }) => {
    setTutorState({
      ...tutorState,
      [name]: checked,
    });
  };

  return (
    <div>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6'>
            <div className='card'>
              <div className='card-body bg-light'>
                <img
                  src='/images/avatar-placeholder.png'
                  alt='Avatar użytkownika'
                  className='w-25 mx-auto d-block my-4'
                />
                {alert.msg && <Alert {...alert} />}
                <form className='form-horizontal' onSubmit={handleSubmit}>
                  <div className='form-group mb-3'>
                    <label
                      htmlFor='location'
                      className='cols-sm-2 control-label mb-2'
                    >
                      Lokalizacja
                    </label>
                    <div className='cols-sm-10'>
                      <input
                        type='text'
                        className='form-control'
                        name='location'
                        placeholder='np. Rzeszów'
                        id='location'
                        onChange={handleChange}
                        value={tutorState.location}
                      />
                    </div>
                  </div>

                  <div className='mb-3'>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        defaultValue
                        id='remoteLessons'
                        name='remoteLessons'
                        checked={tutorState.remoteLessons}
                        onChange={handleCheckboxChange}
                      />
                      <label
                        className='form-check-label'
                        htmlFor='remoteLessons'
                      >
                        Zajęcia zdalne
                      </label>
                    </div>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='onSiteLessons'
                        name='onSiteLessons'
                        checked={tutorState.onSiteLessons}
                        onChange={handleCheckboxChange}
                      />
                      <label
                        className='form-check-label'
                        htmlFor='onSiteLessons'
                      >
                        Zajęcia na miejscu
                      </label>
                    </div>
                  </div>

                  <div className='form-group mb-3'>
                    <label
                      htmlFor='description'
                      className='cols-sm-2 control-label mb-2'
                    >
                      Opisz siebie
                    </label>
                    <div className='cols-sm-10'>
                      <textarea
                        className='form-control'
                        placeholder='Czego uczysz, czym się interesujesz?'
                        name='description'
                        id='description'
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='form-group mb-3'>
                    <label
                      htmlFor='subjects'
                      className='cols-sm-2 control-label mb-2'
                    >
                      Przedmioty (po spacji)
                    </label>
                    <div className='cols-sm-10'>
                      <input
                        type='text'
                        className='form-control'
                        name='subjects'
                        placeholder='np. Matematyka Fizyka Chemia'
                        id='subjects'
                        onChange={handleChange}
                        value={tutorState.subjects}
                      />
                    </div>
                  </div>

                  <div className='form-group '>
                    <button
                      type='submit'
                      className='btn btn-primary btn-block w-100 login-button'
                    >
                      Stwórz profil korepetytora
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTutorProfile;
