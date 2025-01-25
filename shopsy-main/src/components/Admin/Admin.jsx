// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Admin = () => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState(0);
//   const [category, setCategory] = useState('');
//   const [availableSizes, setAvailableSizes] = useState('');
//   const [color, setColor] = useState('');
//   const [stock, setStock] = useState(0);
//   const [image, setImage] = useState(null);
//   const [isActive, setIsActive] = useState(true);
//   const [categories, setCategories] = useState([]);
//   const [message, setMessage] = useState('');

//   // useEffect(() => {
//   //   const fetchCategories = async () => {
//   //     try {
//   //       const response = await axios.get('http://127.0.0.1:8000/api/products/add/');

//   //       setCategories(response.data);
//   //     } catch (error) {
//   //       console.error('Error fetching categories:', error);
//   //     }
//   //   };
//   //   fetchCategories();
//   // }, []);

//   // const handleImageChange = (e) => {
//   //   setImage(e.target.files[0]);
//   // };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   if (!name || !description || !price || !category || !availableSizes || !color || !stock || !image) {
//   //     setMessage('Please fill out all fields and upload an image.');
//   //     return;
//   //   }

//   //   const formData = new FormData();
//   //   formData.append('name', name);
//   //   formData.append('description', description);
//   //   formData.append('price', price);
//   //   formData.append('category', category);
//   //   formData.append('available_sizes', availableSizes);
//   //   formData.append('color', color);
//   //   formData.append('stock', stock);
//   //   formData.append('is_active', isActive);
//   //   formData.append('image', image);

//   //   try {
//   //     const response = await axios.post('http://127.0.0.1:8000/api/categories/', formData, {
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data',
//   //       },
//   //     });
//   //     setMessage('Product added successfully!');
//   //   } catch (error) {
//   //     if (error.response && error.response.data) {
//   //       setMessage('Error adding product: ' + (error.response.data.error || 'Unknown error'));
//   //     } else {
//   //       setMessage('Error adding product: Server is unreachable.');
//   //     }
//   //   }
//   // };

//   return (
//     <div>
//       <h1>Add a New Product</h1>
//       <form >
//         <div>
//           <label>Name:</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Description:</label>
//           <textarea
//             value={description}
//             // onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Price:</label>
//           <input
//             type="number"
//             value={price}
//             // onChange={(e) => setPrice(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Category:</label>
//           <select
//             value={category}
//             // onChange={(e) => setCategory(e.target.value)}
//             required
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.name}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label>Available Sizes:</label>
//           <input
//             type="text"
//             value={availableSizes}
//             // onChange={(e) => setAvailableSizes(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Color:</label>
//           <input
//             type="text"
//             value={color}
//             // onChange={(e) => setColor(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Stock:</label>
//           <input
//             type="number"
//             value={stock}
//             // onChange={(e) => setStock(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Image:</label>
//           <input
//             type="file"
//             // onChange={handleImageChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Active:</label>
//           <input
//             type="checkbox"
//             checked={isActive}
//             // onChange={() => setIsActive(!isActive)}
//           />
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//       {/* // {message && (
//       //   <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>
//       // )} */}
//     </div>
//   );
// };

// export default Admin;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [availableSizes, setAvailableSizes] = useState('');
  const [color, setColor] = useState('');
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !category || !availableSizes || !color || !stock || !image) {
      setMessage('Please fill out all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('available_sizes', availableSizes);
    formData.append('color', color);
    formData.append('stock', stock);
    formData.append('is_active', isActive);
    formData.append('image', image);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/products/add/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Product added successfully!');
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage('Error adding product: ' + (error.response.data.error || 'Unknown error'));
      } else {
        setMessage('Error adding product: Server is unreachable.');
      }
    }
  };

  return (
    <div>
      <h1>Add a New Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Available Sizes:</label>
          <input
            type="text"
            value={availableSizes}
            onChange={(e) => setAvailableSizes(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Color:</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
          />
        </div>
        <div>
          <label>Active:</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && (
        <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>
      )}
    </div>
  );
};

export default Admin;
