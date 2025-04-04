import { useEffect, useState } from "react";
import { db ,auth} from "../assets/firebase";
import { collection, getDoc,getDocs, updateDoc, doc,orderBy } from "firebase/firestore";
import "./superadmin.css";
import { query, where } from "firebase/firestore"; // Import query functions
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {

  const [students, setStudents] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {
        setAdminId(user.uid);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const adminData = userDocSnap.data();
          setAdminName(adminData.name || "Admin");
        }
  
        await fetchAssignedStudents(user.uid);
      } else {
        navigate("/login") ;
      }
  
      setLoading(false); // 🔥 Only after Firebase has responded
    });
  
    return () => unsubscribe();
  }, []);
  
  
  const fetchAssignedStudents = async (adminId) => {
    try {
        console.log("Fetching students for admin ID:", adminId); 
        const studentsRef = collection(db, "students");
        const q= query(studentsRef, where("assignedTo", "==", adminId),orderBy("registeredTime","desc")); 
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn("No students found for this admin.");
        }

        const studentList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("Fetched students:", studentList);
        setStudents(studentList);
    } catch (error) {
        console.error("Error fetching students:", error);
    }
};
const formatTimestamp = (timestamp) => {
  if (!timestamp || !timestamp.seconds) return "N/A";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
};


  // Toggle Student Details Dropdown
  const toggleStudentDetails = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  
  useEffect(() => {
    console.log("Updated students state:", students);
}, [students]); // Log changes

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  // Print Student Details
  const printStudentDetails = (student) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
      <head>
        <title>Student Details</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; }
          .student-details { border: 1px solid #000; padding: 10px; margin-top: 10px; }
          .student-details p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <h2>Student Details</h2>
        <div class="student-details">
          <p><strong>Name:</strong> ${student.name}</p>
          <p><strong>Age:</strong> ${student.age || "Not Available"}</p>
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Parent_contact:</strong> ${student.parent_contact || "Not Available"}</p>
          <p><strong>Grade:</strong> ${student.grade}</p>
          <p><strong>workshop:</strong> ${student.workshop}</p>
          <p><strong>Registered Time:</strong> ${formatTimestamp(student.registeredTime)}</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
    <h2 style={{marginTop:"40px"}}>Admin Dashboard</h2>
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
  </div>
  <h2>Welcome, {adminName || "Admin"}!</h2>


      {/* Table Structure for Student Data */}
      <div className="attendance-table">
        <div className="table-header">
          <span className="column select-box"></span>
          <span className="column name">Student Name</span>
          <span className="column workshop">workshop</span>
          <span className="column email">Email ID</span>
          <span className="column time">Registered Time</span>
          <span className="column actions" style={{textAlign:"center"}}>Actions</span>
        </div>

        <div className="table-body">
          {students.map((student) => (
            <div key={student.id}>
              <div className="table-row">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className={`student-checkbox ${student.assignedTo ? "assigned" : ""}`}
                  checked={student.isSelected}
                  disabled
                />
                <span
                  className="student-name clickable"
                  onClick={() => toggleStudentDetails(student.id)}
                >
                  {student.name}
                </span>

                <span className="student-workshop">{student.workshop}</span>

                <span className="student-email">{student.email}</span>

                <span className="student-time">
                  {formatTimestamp(student.registeredTime)}
                </span>

                <button className="print-btn" onClick={() => printStudentDetails(student)}>
                  Print
                </button>
              </div>

              {/* Expanded Student Details */}
              {expandedStudent === student.id && (
                <div className="student-details active">
                  <p>
                    <strong>Age:</strong> {student.age || "Not Available"}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p>
                    <strong>Parent_contact:</strong> {student.parent_contact || "Not Available"}
                  </p>
                  <p>
                    <strong>workshop:</strong> {student.workshop}
                  </p>
                  <p>
                    <strong>grade:</strong> {student.grade}
                  </p>
        
                  
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

   
    </div>
  );
};

export default AdminDashboard;
