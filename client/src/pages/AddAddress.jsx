import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
    className="w-full border border-gray-300 px-3 py-2 outline-none rounded"
  />
);

const AddAddress = () => {
  const { axios, navigate, user } = useAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/address/add", { address });

      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      toast.error("Please login first to add an address");
      navigate("/cart");
    }
  }, []);

  return (
    <div className="mt-8 md:mt-16 pb-16">
      <div className="flex flex-col items-center md:items-start">
        <p className="text-2xl md:text-3xl text-gray-500 text-center md:text-left">
          Add Shipping <span className="font-semibold text-primary">Address</span>
        </p>
        <div className="w-16 h-1 bg-primary rounded-full mt-2 md:hidden"></div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row justify-between items-center lg:items-start mt-6 lg:mt-12 gap-12">
        <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <form onSubmit={onSubmitHandler} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              name="email"
              type="email"
              placeholder="Email address"
            />

            <InputField
              handleChange={handleChange}
              address={address}
              name="street"
              type="text"
              placeholder="Street"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="city"
                type="text"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="state"
                type="text"
                placeholder="State"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="zipcode"
                type="text"
                placeholder="Zip code"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              name="phone"
              type="text"
              placeholder="Phone"
            />

            <button className="w-full mt-4 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dull transition-all shadow-md shadow-primary/20 cursor-pointer uppercase tracking-wider active:scale-[0.98]">
              Save Address
            </button>
          </form>
        </div>

        <div className="w-full max-w-md lg:max-w-sm shrink-0">
          <img
            className="w-full h-auto rounded-2xl"
            src={assets.add_address_iamge}
            alt="Add Address"
          />
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
