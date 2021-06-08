import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { AuthContext } from '../components/ctx/AuthContext';

const MyProfile = () => {
  const [authContext, authDispatch] = useContext(AuthContext);
  const [alert, setAlert] = useState({ msg: '', type: '' });

  const handleDeleteTutor = async (e) => {
    try {
      axios.delete(`${process.env.REACT_APP_API_URL}/api/Tutors/Delete`, {
        headers: {
          Authorization: `Bearer ${authContext.jwt.token}`,
        },
      });

      authDispatch({ type: 'DELETE_TUTOR' });
      setAlert({ msg: 'Nie jesteś już korepetytorem!', type: 'success' });
    } catch (err) {
      console.err(err);
      setAlert({ msg: 'Wystąpił błąd!', type: 'danger' });
    }
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
                <p className='h5 text-center mb-4'>
                  Witaj {authContext.user.username}
                </p>
                {alert.msg && <Alert {...alert} />}
                <Link
                  className='btn btn-primary btn-block w-100 login-button'
                  to={'/informacje-o-profilu'}
                >
                  Informacje o profilu
                </Link>
                {!authContext.tutor && (
                  <Link
                    className='btn btn-primary btn-block w-100 login-button'
                    to={'/moje-korepetycje'}
                  >
                    Moje korepetycje
                  </Link>
                )}
                {authContext.tutor && (
                  <>
                    <Link
                      className='btn btn-primary btn-block w-100 login-button'
                      to='/oczekujace-lekcje'
                    >
                      Oczekujące lekcje
                    </Link>
                    <Link
                      className='btn btn-primary btn-block w-100 login-button'
                      to='/moj-plan-korepetycji'
                    >
                      Edytuj mój plan korepetycji
                    </Link>
                  </>
                )}
                {authContext.tutor ? (
                  <button
                    className='btn btn-danger btn-block w-100 login-button'
                    onClick={handleDeleteTutor}
                  >
                    Usuń profil korepetytora
                  </button>
                ) : (
                  <Link
                    className='btn btn-primary btn-block w-100 login-button'
                    to={'/stworz-profil-korepetytora'}
                  >
                    Stwórz profil korepetytora
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
