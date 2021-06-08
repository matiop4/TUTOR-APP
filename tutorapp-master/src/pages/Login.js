import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { AuthContext } from '../components/ctx/AuthContext';

const Login = (props) => {
  const [, authDispatch] = useContext(AuthContext);

  const [loginState, setLoginState] = useState({
    username: '',
    password: '',
  });

  const [alert, setAlert] = useState({
    msg: '',
    type: '',
  });

  const handleChange = ({ target: { name, value } }) => {
    setLoginState({
      ...loginState,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const {
        data: { token, expires },
      } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Users/login`,
        loginState
      );

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Check if has a tutor profile
      let tutorData;
      try {
        const { data: tempTutorData } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/Tutors/${data.username}`
        );
        tutorData = tempTutorData;
      } catch {
        tutorData = null;
      }

      setAlert({ msg: 'Zalogowano pomyślnie', type: 'success' });

      authDispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data,
          jwt: { token, expires },
          tutor: tutorData,
        },
      });

      props.history.push('/moj-profil');
    } catch (err) {
      console.error(err.message);

      setAlert({ msg: 'Niepoprawny login i/lub hasło!', type: 'danger' });
      authDispatch({ type: 'LOGIN_ERROR' });
    }
  };

  return (
    <div>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6'>
            <div className='card'>
              <div className='card-header'>Logowanie</div>
              <div className='card-body'>
                <img
                  src='/images/avatar-placeholder.png'
                  alt='Avatar użytkownika'
                  className='w-25 mx-auto d-block my-4'
                />
                {alert.msg && <Alert {...alert} />}
                <form className='form-horizontal' onSubmit={handleSubmit}>
                  <div className='form-group mb-3'>
                    <label
                      htmlFor='username'
                      className='cols-sm-2 control-label mb-2'
                    >
                      Nazwa użytkownika
                    </label>
                    <div className='cols-sm-10'>
                      <input
                        type='text'
                        className='form-control'
                        name='username'
                        id='username'
                        value={loginState.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='form-group mb-3'>
                    <label
                      htmlFor='password'
                      className='cols-sm-2 control-label mb-2'
                    >
                      Hasło
                    </label>
                    <div className='cols-sm-10'>
                      <input
                        type='password'
                        className='form-control'
                        name='password'
                        id='password'
                        value={loginState.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='form-group '>
                    <button
                      type='submit'
                      className='btn btn-primary btn-lg btn-block w-100 login-button'
                    >
                      Zaloguj
                    </button>
                  </div>
                  <div className='login-register mt-4'>
                    Nie masz konta?{' '}
                    <Link to='/rejestracja'>Zarejestruj się</Link>
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

export default Login;
