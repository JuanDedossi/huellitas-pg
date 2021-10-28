import { Route } from 'react-router-dom';
import Navbar from './components/navBar/NavBar';
import Title from './components/Title/Title';
import { ThemeProvider } from '@mui/material/styles';
import theme from './themeConfig';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className='App'>
        <Route path='/'>
          <Navbar />
        </Route>
        <Route exact path='/'>
          <Title />
        </Route>
        <Route path='/login'>
          {/* <login /> */}
        </Route>
        <Route path='/alldogs'>
          {/* <Alldogs /> */}
        </Route>
        <Route exact path='/menssage'>
          {/* <Menssage /> */}
        </Route>
        <Route exact path='/notification'>
          {/* <Notification /> */}
        </Route>
        <Route path='/register'>
          {/* <Register /> */}
        </Route>
        <Route path='/found'>
          {/* <Found/> */}
        </Route>
        <Route path='/lost'>
          {/* <Lost/> */}
        </Route>
        <Route path='/adoption'>
          {/* <Adoption /> */}
        </Route>
      </div>
    </ThemeProvider>
  );
}

export default App;
