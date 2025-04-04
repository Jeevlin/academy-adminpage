import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import'./login.css'



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const auth = getAuth();
  const db = getFirestore();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const usersCollection = collection(db, "users");
      const userDocs = await getDocs(usersCollection);

      let userRole = null;
      let userName = null;

      userDocs.forEach((doc) => {
        const userData = doc.data();
        if (userData.email === email) {
          userRole = userData.role;
          userName = userData.name; 
        }
      });

      if (userRole) {
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userName", userName);
        console.log("Logged in as:", userRole, "Name:", userName);

        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else if (userRole === "superadmin") {
          navigate("/superadmin-dashboard");
        } else {
          console.error("Unknown role");
        }
      } else {
        console.error("User role not found in Firestore");
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
  <div className="container">
<form className="form" onSubmit={handleLogin}  >
        <h2 className="title" >Login</h2>
        <input className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
      
        />
        <input className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
         
        />
        <button className="button" type="submit" >Login</button>
      </form>
    

  </div>
      
  );
};


export default Login;
