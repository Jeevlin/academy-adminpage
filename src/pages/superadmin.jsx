import { useEffect, useState } from "react";
import { db } from "../assets/firebase";
import { collection, getDocs, updateDoc, doc,orderBy,query } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../assets/firebase"; 
import { deleteDoc } from "firebase/firestore"; // already imported firestore functions
import "./superadmin.css";

const SuperAdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [expandedStudent, setExpandedStudent] = useState({});
  const [superAdminEmail, setSuperAdminEmail] = useState("");
  const [superAdminName, setSuperAdminName] = useState("");


useEffect(() => {
  const fetchSuperAdmin = async () => {
    try {
      const userSnapshot = await getDocs(collection(db, "users"));
      const superAdmin = userSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .find((user) => user.role === "superadmin");

      if (superAdmin) {
        setSuperAdminEmail(superAdmin.email);
        setSuperAdminName(superAdmin.name)
      }
    } catch (error) {
      console.error("Error fetching superadmin:", error);
    }
  };

  fetchSuperAdmin();
}, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentQuery = query(collection(db, "students"),orderBy("registeredTime", "desc"));
        const studentSnapshot = await getDocs(studentQuery);
        const adminSnapshot = await getDocs(collection(db, "users"));
        setStudents(
          studentSnapshot.docs.map((doc) => ({
            id: doc.id,
            isSelected: false, // Add selection state
            ...doc.data(),
          }))
        );

        // Ensure all admins with role "admin" are included
        setAdmins(
          adminSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((users) => users.role === "admin")
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // Convert Firestore Timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  };

  

  const deleteStudent = async (studentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;
  
    try {
      await deleteDoc(doc(db, "students", studentId));
      alert("Student deleted successfully!");
  
      // Remove student from the local state
      setStudents((prevStudents) => prevStudents.filter((s) => s.id !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student!");
    }
  };
  
  // Toggle Student Details Dropdown
  const toggleStudentDetails = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  // Toggle Student Selection
  const toggleStudentSelection = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, isSelected: !student.isSelected }
          : student
      )
    );
  };

  // Assign Selected Students to Admin
  const assignStudents = async () => {
    if (!selectedAdmin) {
      alert("Please select an admin first!");
      return;
    }

    const selectedStudents = students.filter((student) => student.isSelected);
    if (selectedStudents.length === 0) {
      alert("Please select at least one student!");
      return;
    }

    try {
      await Promise.all(
        selectedStudents.map((student) =>
          updateDoc(doc(db, "students", student.id), { assignedTo: selectedAdmin })
        )
      );

      alert("Students assigned successfully!");
      setStudents((prev) =>
        prev.map((student) =>
          student.isSelected
            ? { ...student, assignedTo: selectedAdmin, isSelected: false, isAssigned:true }
            : student
        )
      );
      
      setSelectedAdmin(""); // Reset dropdown after assigning
    } catch (error) {
      console.error("Error assigning students:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  
  const assignedCounts = students.reduce((acc, student) => {
    if (student.assignedTo) {
      acc[student.assignedTo] = (acc[student.assignedTo] || 0) + 1;
    }
    return acc;
  }, {});
  
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
            <p><strong>Age:</strong> ${student.age}</p>
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>parent_contact:</strong> ${student.parent_contact || "Not Available"}</p>
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
      <div className="dashboard">
          <div className="dashboard-header">
          <h2 style={{marginTop:"40px"}}>Super Admin Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>

  {/* Greeting Message */}
  <p className="greeting">Welcome   {superAdminName || "Super Admin"} - {superAdminEmail}</p>
  <div style={{ textAlign: "center", marginTop: "10px" }}>
  <p>Total Registrations: {students.length}</p>

  {Object.entries(assignedCounts).map(([adminId, count]) => {
  const adminName = admins.find((admin) => admin.id === adminId)?.name || "Unknown Admin";
  return (
    <p style={{display:"inline",marginRight:"10px",fontSize:"22px"}} key={adminId}>
    {adminName} - {count},
    </p>
  );
   })}
</div>



  {/* Admin Selection Dropdown */}
  <div className="assign-dropdown">
    <label>Assign to:</label>
    <select
      className="admin-select"
      value={selectedAdmin}
      onChange={(e) => setSelectedAdmin(e.target.value)}
    >
      <option value="">Select Admin</option>
      {admins.map((admin) => (
        <option key={admin.id} value={admin.id}>
          {admin.name}
        </option>
      ))}
    </select>
  </div>
</div>
        
      {/* Table Structure for Student Data */}
      <div className="attendance-table">
        <div className="table-header">
          <span className="column select-box"></span>
          <span className="column name">Student Name</span>
          <span className="column workshop">workshop</span>
          <span className="column email">Email ID</span>
          <span className="column time">Registered Time</span>
          <span className="column assign"style={{textAlign:"left"}}>AssignedTo</span>
          <span className="column actions"style={{textAlign:"center"}}>Actions</span>

        </div>

        <div className="table-body">
          {students.map((student) => (
            <div key={student.id}>
              <div className="table-row">
                {/* Checkbox */}
                <input
                type="checkbox"
                className={`student-checkbox ${student.assignedTo ? "assigned-checkbox" : ""}`}
                checked={student.isSelected}
                onChange={() => toggleStudentSelection(student.id)}
                disabled={!!student.assignedTo}
                />
            <span className="student-name clickable"
                  onClick={() => toggleStudentDetails(student.id)}>{student.name}</span>
            <span className="student-workshop">{student.workshop}</span>
            <span className="student-email">{student.email}</span>
            <span className="student-time">
                  {formatTimestamp(student.registeredTime)}</span>
            <span className="assigned-admin">
                  {admins.find((admin) => admin.id === student.assignedTo)?.name || "Not Assigned"}</span>
            <button className="print-btn" onClick={() => printStudentDetails(student)}>Print</button>
            <button className="delete-btn" onClick={() => deleteStudent(student.id)}>Delete</button>

              </div>

              {/* Expanded Student Details */}
              {expandedStudent === student.id && (
                <div className={'student-details active'}>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p>
                    <strong>Age:</strong> {student.age || "Not Available"}
                  </p>
                  <p>
                    <strong>parent_contact:</strong> {student.parent_contact || "Not Available"}
                  </p>
                  <p>
                    <strong>workshop:</strong> {student.workshop}
                  </p>
        
                  <p>
  <strong>Assigned To:</strong>{" "}
  {admins.find((admin) => admin.id === student.assignedTo)?.name || "Not Assigned"}
</p>

                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Assign Button */}
      <button onClick={assignStudents} className="assign-btn">
        Assign
      </button>
    </div>
  );
};

export default SuperAdminDashboard;
