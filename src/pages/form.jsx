import { useState } from "react";
import "./form.css";
import { db, serverTimestamp } from "../assets/firebase"; // Firebase config
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        grade: "",
        email: "",
        parent_contact: "",
        workshop: "Science Exploration",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "students"), {
                ...formData,
                registeredTime: serverTimestamp(),
            });

            alert("Student Registered Successfully!");
            setFormData({
                name: "",
                age: "",
                grade: "",
                email: "",
                parent_contact: "",
                workshop: "Science Exploration",
            });
        } catch (error) {
            console.error("Error adding document:", error);
            alert("Failed to register student.");
        }
    };

    return (
        <div>
            <nav className="navbar">
                <div className="logo">SkillStation</div>
                <button className="admin-btn" onClick={()=>navigate('/login')}>Admin Login</button>
            </nav>
            <div><h2>Student Registration Form</h2></div>

            <div className="container">
              
                <form onSubmit={handleSubmit} className="form-container">
                    <label>Student Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    
                    <label>Age:</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                    
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    
                    <label>Grade:</label>
                    <input type="text" name="grade" value={formData.grade} onChange={handleChange} required />
                    
                    <label>Parent/Guardian Contact:</label>
                    <input type="tel" name="parent_contact" value={formData.parent_contact} onChange={handleChange} required />
                    
                    <label>Select Workshop:</label>
                    <select name="workshop" value={formData.workshop} onChange={handleChange} required>
                        <option value="Science Exploration">Science Exploration</option>
                        <option value="Mathematics Fun">Mathematics Fun</option>
                        <option value="Creative Arts">Creative Arts</option>
                        <option value="Introduction to Coding">Introduction to Coding</option>
                    </select>
                    
                    <button type="submit" className="submit-button">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Form;
