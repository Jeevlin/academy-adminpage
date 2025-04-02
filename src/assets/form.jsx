// StudentWorkshopRegistration.jsx
import { useState } from "react";
import "./form.css";

const Form = () => {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        grade: "",
        parent_contact: "",
        workshop: "science",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registration Details:", formData);
        alert("Registration Successful!");
    };

    return (
        <div className="container">
            <h2>Student Workshop Registration</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <label>Student Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                
                <label>Age:</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                
                <label>Grade:</label>
                <input type="text" name="grade" value={formData.grade} onChange={handleChange} required />
                
                <label>Parent/Guardian Contact:</label>
                <input type="tel" name="parent_contact" value={formData.parent_contact} onChange={handleChange} required />
                
                <label>Select Workshop:</label>
                <select name="workshop" value={formData.workshop} onChange={handleChange} required>
                    <option value="science">Science Exploration</option>
                    <option value="math">Mathematics Fun</option>
                    <option value="art">Creative Arts</option>
                    <option value="coding">Introduction to Coding</option>
                </select>
                
                <button type="submit" className="submit-button">Register</button>
            </form>
        </div>
    );
};

export default Form;
