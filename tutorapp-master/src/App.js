import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import MyProfile from './pages/MyProfile';
import { useContext } from 'react';
import { AuthContext } from './components/ctx/AuthContext';
import ProfilInfo from './pages/ProfilInfo';
import CreateTutorProfile from './pages/CreateTutorProfile';
import TutorProfile from './pages/TutorProfile';
import EditMyTutorSchedule from './pages/EditMyTutorSchedule';
import WaitingLessons from './pages/WaitingLessons';
import MyLessons from './pages/MyLessons';

function App() {
  const [{ isAuth, tutor }] = useContext(AuthContext);

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/rejestracja' component={Register} />
          <Route path='/logowanie' component={Login} />
          <Route path='/moj-profil' component={isAuth ? MyProfile : Home} />
          <Route
            path='/moje-korepetycje'
            component={isAuth ? MyLessons : Home}
          />
          <Route
            path='/moj-plan-korepetycji'
            component={isAuth && tutor ? EditMyTutorSchedule : Home}
          />
          <Route
            path='/oczekujace-lekcje'
            component={isAuth && tutor ? WaitingLessons : Home}
          />
          <Route
            path='/informacje-o-profilu'
            component={isAuth ? ProfilInfo : Home}
          />
          <Route
            path='/stworz-profil-korepetytora'
            component={isAuth ? CreateTutorProfile : Home}
          />
          <Route path='/korepetytor/:username' component={TutorProfile} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
