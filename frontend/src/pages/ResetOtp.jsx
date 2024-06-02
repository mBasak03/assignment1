import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

const schema = z.object({
  email: z.string().email('Invalid email format').nonempty('Email is required'),
});

const ResetOtp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const [loading, setLoading]= useState(false);
  
  const onSubmit = async (data) => {
    setLoading(true);
    localStorage.removeItem("token")
    try {
      await axios.post('http://localhost:4000/api/v1/reset-password-otp', {
        email: data.email,
      });

      navigate('/sign-up', { state: { email: data.email } });
      
    } catch (error) {
      console.error("Error during OTP request:", error);
    }
    setLoading(false);
  };
  if(loading){
    return <Loading/>
  }
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-5 text-center">Request OTP for Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email<sup className='text-red-600 text-[20px] -mb-2 '>*</sup></label>
          <input
            id="email"
            {...register('email')}
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : null}
          />
          {errors.email && <p id="email-error" className="text-red-600">{errors.email.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Send OTP</button>
      </form>
    </div>
  );
};

export default ResetOtp;
