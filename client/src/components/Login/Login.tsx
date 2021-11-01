import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField } from '@material-ui/core';
import './Login.css';
import Box from '@mui/material/Box';
import { setUser } from '../../redux/actions';
import { useHistory } from 'react-router-dom';
import loginService from '../../services/loginService';
import { typeState } from '../../redux/reducers/index';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

type LogIn = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required(),
});

function Ingresar() {
  const [error, setError] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state: typeState) => state.user);

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<LogIn>({ resolver: yupResolver(schema) });

  // useEffect(() => {
  //   if (window.localStorage.getItem('token')) {
  //     history.push('/home');
  //   }
  // }, []);

  const onSubmit = handleSubmit(async data => {
    const response = await loginService(data);
    if (response.error) {
      setValue('email', '');
      setValue('password', '');
      Swal.fire({
        title: 'Error',
        text: 'El email o la contraseña no son válidos',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      });
    } else {
      history.push('/home');
    }
  });
  //Login Facebook
  const responseFacebook = async (response: any) => {
    let respLogin;
    try {
      console.log(response)
      respLogin = await axios.post('http://localhost:3001/user/login', {
        username: response.email,
        password: response.id,
      });
      console.log('ok', respLogin);
    } catch (err: any) {
      console.log('errror', err.message);
      setError(err.message);
      registerWithFacebook(response); //Invoco a la funcion para registrar
    }
  }

    const registerWithFacebook = async (response: any) => {
      let respSignup: any;
      try {
        respSignup = await axios.post('http://localhost:3001/user/signup', {
        name: response.first_name,
        lastname: response.last_name,
        email: response.email,
        password: response.id,
      });
      console.log('ok', respSignup.status);
      if (respSignup.status === 200) {
        Swal.fire({
          title: 'Registro exitoso',
          text: 'Ahora puedes iniciar sesión',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        // history.push('/home') Ver como podríamos avisarle al cliente cual es su contraseña
      }
    }
    catch(err){
      Swal.fire({
        title: 'Error',
        text: 'No se pudo registrar',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };
  //Login Google
  const responseGoogle = async (response: any) => {
    let respLogin;
    try {
      respLogin = await axios.post('http://localhost:3001/user/login', {
        username: response.profileObj.email,
        password: response.profileObj.googleId,
      });
      console.log('ok', respLogin);
    } catch (err: any) {
      console.log('errror', err.message);
      setError(err.message);
      registerWithGoogle(response) //Invoco a la funcion para registrar
    }
  }

    const registerWithGoogle = async (response: any) => {
      let respSignup: any;
      try {
        respSignup = await axios.post('http://localhost:3001/user/signup', {
        name: response.profileObj.givenName,
        lastname: response.profileObj.familyName,
        email: response.profileObj.email,
        password: response.profileObj.googleId,
      });
      console.log('ok', respSignup.status);
      if (respSignup.status === 200) {
        Swal.fire({
          title: 'Registro exitoso',
          text: 'Ahora puedes iniciar sesión',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        // history.push('/home') Ver como podríamos avisarle al cliente cual es su contraseña
      }
    }
    catch(err){
      Swal.fire({
        title: 'Error',
        text: 'No se pudo registrar',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: 'wihte' }} className='container'>
      <div className='title'>
        <h1>Ingresa</h1>
      </div>
      <form onSubmit={onSubmit}>
        <div className='inputs'>
          <Controller
            name='email'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                label='Email'
                variant='outlined'
                error={!!errors.email}
                helperText={errors.email ? errors.email?.message : ''}
                fullWidth
                margin='dense'
              />
            )}
          />

          <br />
          <Controller
            name='password'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                type='password'
                label='Contraseña'
                variant='outlined'
                error={!!errors.password}
                helperText={errors.password ? errors.password?.message : ''}
                fullWidth
                margin='dense'
              />
            )}
          />
        </div>
        <Button variant='contained' type='submit'>
          Ingresar
        </Button>
        <FacebookLogin
          appId="275207664365572"
          autoLoad={false}
          fields="first_name,email,picture,last_name"
          // onClick={componentClicked}
          callback={responseFacebook} />
        <GoogleLogin
          clientId='73850795306-qqjla4o7l7d8mha6209tu8h87asqu073.apps.googleusercontent.com'
          buttonText='Login'
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
      />
      </form>
    </Box>
  );
}

export default Ingresar;
