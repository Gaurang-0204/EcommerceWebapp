import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditProfile() {
  const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [pincode, setPincode] = useState('');
    const [state, setState] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            setError('No token found. Please login.');
            return;
        }

        try {
            const response = await axios.patch('http://127.0.0.1:8000/api/update/user/', {
                city,
                street,
                pincode,
                state,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            setSuccess('Profile updated successfully!');
            setError(null);  // Reset any previous errors
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile.');
            setSuccess(null);
        }
    };
  return (
    <div>
            <h1>Update Profile</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>City</label>
                    <input 
                        type="text" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Street</label>
                    <input 
                        type="text" 
                        value={street} 
                        onChange={(e) => setStreet(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Pincode</label>
                    <input 
                        type="text" 
                        value={pincode} 
                        onChange={(e) => setPincode(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>State</label>
                    <input 
                        type="text" 
                        value={state} 
                        onChange={(e) => setState(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
  );
}
