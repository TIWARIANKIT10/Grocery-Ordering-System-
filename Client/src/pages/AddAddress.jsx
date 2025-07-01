import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { userAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

// ✅ Reusable InputField component
const InputField = ({ type, placeholder, name, handleChange, value }) => (
  <input
    className='w-full px-3 py-2.5 border border-gray-300 rounded outline-none text-gray-600 focus:border-indigo-500 transition'
    type={type}
    placeholder={placeholder}
    name={name}
    onChange={handleChange}
    value={value}
    required
  />
);

const AddAddress = () => {
  const {axios ,User, navigate} = userAppContext()
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  try {
   
    const {data} = await axios.post('http://localhost:4000/api/address/add',{address})
console.log(data);
    if(data.success){
      toast.success(data.message)
      navigate('/cart')
    }else{
      toast.error(data.error)
    }
    
  } catch (error) {
    toast.error(error.message)
    
  }
  };
  useEffect(()=>{if(!User){
    navigate('/cart')
  }},[])

  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-700'>
        Add Shipping <span className='font-semibold text-indigo-500'>Address</span>
      </p>

      <div className='flex flex-col-reverse md:flex-row justify-between mt-10 gap-8'>
        <div className='flex-1 max-w-xl'>
          <form onSubmit={onSubmitHandler} className='space-y-4 mt-6 text-sm'>

            {/* First & Last Name */}
            <div className='flex gap-4'>
              <InputField name='firstName' type='text' placeholder='First Name' value={address.firstName} handleChange={handleChange} />
              <InputField name='lastName' type='text' placeholder='Last Name' value={address.lastName} handleChange={handleChange} />
            </div>

            {/* Email */}
            <InputField name='email' type='email' placeholder='Email' value={address.email} handleChange={handleChange} />

            {/* Street */}
            <InputField name='street' type='text' placeholder='Street Address' value={address.street} handleChange={handleChange} />

            {/* City & State */}
            <div className='flex gap-4'>
              <InputField name='city' type='text' placeholder='City' value={address.city} handleChange={handleChange} />
              <InputField name='state' type='text' placeholder='State' value={address.state} handleChange={handleChange} />
            </div>

            {/* Zip & Country */}
            <div className='flex gap-4'>
              <InputField name='zipcode' type='text' placeholder='Zip Code' value={address.zipcode} handleChange={handleChange} />
              <InputField name='country' type='text' placeholder='Country' value={address.country} handleChange={handleChange} />
            </div>

            {/* Phone */}
            <InputField name='phone' type='tel' placeholder='Phone Number' value={address.phone} handleChange={handleChange} />

            <button
              type="submit"
              className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded transition"
            >
              Save Address
            </button>
          </form>
        </div>

        <img
          className='md:mr-16 mb-8 md:mb-0 max-w-xs'
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
