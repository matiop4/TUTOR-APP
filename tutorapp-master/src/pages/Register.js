import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { AuthContext } from '../components/ctx/AuthContext';

const Register = (props) => {
  const [, authDispatch] = useContext(AuthContext);

  const [registerState, setRegisterState] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [alert, setAlert] = useState({
    msg: '',
    type: '',
  });

  const handleChange = ({ target: { name, value } }) => {
    setRegisterState({
      ...registerState,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Users/register`,
        registerState
      );

      setAlert({ msg: 'Rejestracja zakończyła się sukcesem', type: 'success' });

      authDispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: registerState,
          jwt: { token: data.token, expires: data.expires },
        },
      });

      props.history.push('/moj-profil');
    } catch (err) {
      setAlert({
        msg: 'Wystąpił błąd podczas walidacji danych',
        type: 'danger',
      });
      authDispatch({ type: 'REGISTER_ERROR' });
    }
  };

  return (
    <div>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6'>
            <div className='card'>
              <div className='card-header'>Rejestracja</div>
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
                        value={registerState.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='form-group mb-3'>
                    <label
                      htmlFor='firstName'
                      className='cols-sm-2 control-label mb-2'
                    >
                      Imie
                    </label>
                    <div className='cols-sm-10'>
                      <input
                        type='text'
                        className='form-control'
                        name='firstName'
                        id='firstName'
                        value={registerState.firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='form-group mb-3'>
                    <label
                      htmlFor='lastName'
                      className='cols-sm-2 control-label mb-2'
                    >
                      Nazwisko
                    </label>
                    <div className='cols-sm-10'>
                      <input
                        type='text'
                        className='form-control'
                        name='lastName'
                        id='lastName'
                        value={registerState.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='form-group mb-3'>
                    <label
                      htmlFor='email'
                      className='cols-sm-2 control-label mb-2'
                    >
                      Email
                    </label>
                    <div className='cols-sm-10'>
                      <input
                        type='email'
                        className='form-control'
                        name='email'
                        id='email'
                        value={registerState.email}
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
                        value={registerState.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='form-group '>
                    <button
                      type='submit'
                      className='btn btn-primary btn-lg btn-block w-100 login-button'
                    >
                      Zarejestruj
                    </button>
                  </div>
                  <div className='login-register mt-4'>
                    Masz już konto? <Link to='/logowanie'>Zaloguj się</Link>
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

export default Register;
