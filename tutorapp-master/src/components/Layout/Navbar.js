import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../ctx/AuthContext';

const Navbar = () => {
  const [authContext, authDispatch] = useContext(AuthContext);

  const handleLogout = () => {
    authDispatch({ type: 'LOGOUT_SUCCESS' });
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <div className='container'>
        <Link className='navbar-brand' to='/'>
          Tutor
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item active'>
              <Link className='nav-link' to='/'>
                Strona główna
              </Link>
            </li>
            {!authContext.isAuth && (
              <>
                <li className='nav-item'>
                  <Link className='nav-link' to='/rejestracja'>
                    Rejestracja
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to='/logowanie'>
                    Logowanie
                  </Link>
                </li>
              </>
            )}
          </ul>
          {authContext.isAuth && (
            <div className='dropdown'>
              <button
                className='btn btn-secondary dropdown-toggle'
                type='button'
                id='dropdownMenuButton'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                Witaj {authContext.user.username}
              </button>
              <div
                className='dropdown-menu'
                aria-labelledby='dropdownMenuButton'
              >
                <Link className='dropdown-item' to='/moj-profil'>
                  Mój profil
                </Link>
                <Link className='dropdown-item' to='/informacje-o-profilu'>
                  O mnie
                </Link>
                <div className='dropdown-divider'></div>
                <button
                  className='dropdown-item text-danger'
                  onClick={handleLogout}
                >
                  Wyloguj
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
