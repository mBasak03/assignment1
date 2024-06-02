import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setToken, setUsername } from "../reducer/slices/authSlice";
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import axios from 'axios';

const schema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
});

const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {loading}= useSelector((state)=>state.auth)
  const onSubmit = async (data) => {
    dispatch(setLoading(true));

    try {
      const response = await axios.post('http://localhost:4000/api/v1/sign-in', {
        username: data.username,
        password: data.password,
      });

      const token = response.data.token;
      localStorage.setItem('token', JSON.stringify(token));
      const storedToken= JSON.parse(localStorage.getItem("token"))
      console.log('Token stored in local storage:', storedToken);
      dispatch(setToken(token));
      dispatch(setUsername(data.username));
      navigate("/");
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  if(loading){
    return <Loading/>
  }
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-5 text-center">Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Username<sup className='text-red-600 text-[20px] -mb-2 '>*</sup></label>
          <input
            id="username"
            {...register('username')}
            className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded`}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : null}
          />
          {errors.username && <p id="username-error" className="text-red-600">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password<sup className='text-red-600 text-[20px] -mb-2 '>*</sup></label>
          <div className="flex items-center gap-2">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : null}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-blue-500 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p id="password-error" className="text-red-600">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
