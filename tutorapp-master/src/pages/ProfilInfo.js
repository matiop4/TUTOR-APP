import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/ctx/AuthContext';

const ProfilInfo = () => {
  const [authContext] = useContext(AuthContext);

  const [userState, setUserSate] = useState({
    ...authContext.user,
    password: '',
  });

  const handleChange = ({ target: { value, name } }) => {
    setUserSate({
      ...userState,
      [name]: value,
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   console.log(userState);
  // };

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
                <p className='h5 text-center mb-4'>Edycja Profilu</p>

                <div className='justify-content-center w-100'>
                  {/* <form className='w-100' onSubmit={handleSubmit}> */}
                  <div className='form-group row'>
                    <label
                      htmlFor='username'
                      className='col-md-4 col-form-label text-md-right'
                    >
                      Nazwa
                    </label>
                    <div className='col-md-6'>
                      <input
                        disabled
                        type='text'
                        id='username'
                        className='form-control'
                        name='username'
                        value={userState.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='form-group row'>
                    <label
                      htmlFor='firstName'
                      className='col-md-4 col-form-label text-md-right'
                    >
                      Imie
                    </label>
                    <div className='col-md-6'>
                      <input
                        disabled
                        type='text'
                        id='firstName'
                        className='form-control'
                        name='firstName'
                        value={userState.firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='form-group row'>
                    <label
                      htmlFor='lastName'
                      className='col-md-4 col-form-label text-md-right'
                    >
                      Nazwisko
                    </label>
                    <div className='col-md-6'>
                      <input
                        disabled
                        type='text'
                        id='lastName'
                        className='form-control'
                        name='lastName'
                        value={userState.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='form-group row'>
                    <label
                      htmlFor='email'
                      className='col-md-4 col-form-label text-md-right'
                    >
                      E-mail
                    </label>
                    <div className='col-md-6'>
                      <input
                        disabled
                        type='email'
                        id='email'
                        className='form-control'
                        name='email'
                        value={userState.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {authContext.tutor && (
                    <Link
                      type='submit'
                      to={`/korepetytor/${authContext.user.username}`}
                      className='btn btn-primary w-100 d-block mb-2'
                    >
                      Zobacz moją ofertę
                    </Link>
                  )}
                  <Link
                    type='submit'
                    to='/moj-profil'
                    className='btn btn-primary w-100 d-block'
                  >
                    Powrót
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilInfo;
