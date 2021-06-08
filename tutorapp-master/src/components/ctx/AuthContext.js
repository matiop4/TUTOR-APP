import axios from 'axios';
import React, { createContext, useEffect, useReducer } from 'react';

export const AuthContext = createContext();

const initState = {
  isAuth: false,
  user: {
    id: null,
    username: null,
    firstName: null,
    lastName: null,
    email: null,
  },
  tutor: null,
  jwt: {
    token: null,
    expires: null,
  },
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
    case 'AUTH_SUCCESS':
      const userData = {
        isAuth: true,
        user: action.payload.user,
        jwt: action.payload.jwt,
        tutor: action.payload.tutor,
      };

      localStorage.setItem('token', JSON.stringify(userData.jwt));
      return {
        ...state,
        ...userData,
      };

    case 'REGISTER_ERROR':
    case 'LOGIN_ERROR':
    case 'AUTH_ERROR':
    case 'LOGOUT_SUCCESS':
      localStorage.removeItem('token');
      return initState;
    case 'CREATE_TUTOR':
      return {
        ...state,
        tutor: action.payload,
      };
    case 'DELETE_TUTOR':
      return {
        ...state,
        tutor: null,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initState);

  useEffect(() => {
    // Get data from saved token
    if (localStorage.getItem('token')) {
      const jwt = JSON.parse(localStorage.getItem('token'));

      if (new Date(jwt.expires) > new Date()) {
        (async () => {
          try {
            const { data } = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/Users`,
              {
                headers: {
                  Authorization: `Bearer ${jwt.token}`,
                },
              }
            );

            // Check if has a tutor profile
            let tutorData;
            try {
              const { data: tempTutorData } = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/Tutors/${data.username}`
              );
              tutorData = tempTutorData;
            } catch (err) {
              tutorData = null;
            }

            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: data,
                jwt,
                tutor: tutorData,
              },
            });
          } catch (err) {
            console.error(err.message);
            dispatch({ type: 'AUTH_ERROR' });
          }
        })();
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
