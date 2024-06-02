import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setLoading, setUsername } from "../reducer/slices/authSlice";
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import axios from 'axios';

const schema = z.object({
  username: z.string().nonempty('Username is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
  otp: z.string().length(6, 'OTP should be of 6 digits'),
  terms: z.boolean().refine(val => val === true, 'Terms and conditions must be accepted'),
});

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(()=>{
    const userToken= localStorage.getItem("token")
    console.log(userToken);
    if(userToken){
      navigate("/")
    }
    else{
      navigate("/sign-in")
    }
  }, [])
  
  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    

    try {
      const response = await axios.post('http://localhost:4000/api/v1/sign-up', {
        username: data.username,
        email: data.email,
        password: data.password,
        otp: data.otp
      });

      console.log("result: ", response.data);
      dispatch(setUsername(data.username));
      dispatch(setEmail(data.email));
      navigate("/");
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-5 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Username<sup className=' text-red-600 text-[20px] -mb-2 '>*</sup></label>
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
          <label htmlFor="email" className="block mb-2">Email<sup className=' text-red-600 text-[20px] -mb-2 '>*</sup></label>
          <input
            id="email"
            {...register('email')}
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : null}
          />
          {errors.email && <p id="email-error" className="text-red-600">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password<sup className=' text-red-600 text-[20px] -mb-2 '>*</sup></label>
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

        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            id="name"
            {...register('name')}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="otp" className="block mb-2">OTP<sup className=' text-red-600 text-[20px] -mb-2 '>*</sup></label>
          <input
            id="otp"
            {...register('otp')}
            className={`w-full p-2 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded`}
            aria-invalid={errors.otp ? "true" : "false"}
            aria-describedby={errors.otp ? "otp-error" : null}
          />
          {errors.otp && <p id="otp-error" className="text-red-600">{errors.otp.message}</p>}
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register('terms')}
              className="form-checkbox"
              aria-invalid={errors.terms ? "true" : "false"}
              aria-describedby={errors.terms ? "terms-error" : null}
            />
            <span className="ml-2">I agree to the terms and conditions</span>
          </label>
          {errors.terms && <p id="terms-error" className="text-red-600">{errors.terms.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
