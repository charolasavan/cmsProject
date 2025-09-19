// // import React, { useState } from "react";
// // import { IoMail } from "react-icons/io5";
// // import { MdVisibility, MdVisibilityOff } from "react-icons/md";
// // import { FaLock } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";
// // import api from "../api";
// // import Swal from "sweetalert2";

// // function LoginPage({ onLogin }) {
// //     const navigate = useNavigate()
// //     const [isPasswordShown, setIsPasswordShown] = useState(false);
// //     const [userLogin, setUserLogin] = useState({
// //         email_id: '',
// //         user_password: '',
// //     });

// //     const fetchLogin = async () => {
// //         try {
// //             const userInfo = new FormData();
// //             userInfo.append('email_id', userLogin.email_id);
// //             userInfo.append('user_password', userLogin.user_password);

// //             const response = await api.post("/users/login/", userInfo);
// //             // console.log(response.data)
// //             localStorage.setItem("auth", "true");
// //             // localStorage.setItem("user", JSON.stringify(response.data));
// //             localStorage.setItem("user", JSON.stringify(response.data));

// //             // console.log("Login successful:", response.data);
// //             onLogin();
// //             const Toast = Swal.mixin({
// //                 toast: true,
// //                 position: "top-end",
// //                 showConfirmButton: false,
// //                 timer: 1000,
// //                 timerProgressBar: true,
// //                 didOpen: (toast) => {
// //                     toast.onmouseenter = Swal.stopTimer;
// //                     toast.onmouseleave = Swal.resumeTimer;
// //                 }
// //             });
// //             Toast.fire({
// //                 icon: "success",
// //                 title: "User Login Successfully"
// //             });
// //             navigate('/dashboard')
// //         } catch (error) {
// //             Swal.fire({
// //                 icon: "error",
// //                 title: "Invalid Detail",
// //                 text: error?.response?.data?.detail || error.message || "Unknown error"
// //             });
// //         }
// //     };

// //     const handleChange = (e) => {
// //         e.preventDefault();
// //         setUserLogin((prev) => ({
// //             ...prev,
// //             [e.target.name]: e.target.value,
// //         }));
// //     }

// //     const handleSubmit = (e) => {
// //         e.preventDefault();
// //         fetchLogin();
// //     }



// //     return (
// //         <div className="h-100  d-flex justify-content-center align-items-center">
// //             <div className=" login-container container" style={{ maxWidth: "400px" }}>
// //                 <h2 className="form-title text-center mb-4">Log in with</h2>

// //                 <div className="social-login d-flex gap-2 mb-4">
// //                     <button className="social-button btn btn-light border w-100 d-flex align-items-center justify-content-center">
// //                         <img src="/google.svg" alt="Google" className="me-2" width={20} />
// //                         Google
// //                     </button>
// //                     <button className="social-button btn btn-light border w-100 d-flex align-items-center justify-content-center">
// //                         <img src="/apple.svg" alt="Apple" className="me-2" width={20} />
// //                         Apple
// //                     </button>
// //                 </div>

// //                 <p className="separator text-center my-3"><span>or</span></p>

// //                 <form className="login-form" onSubmit={handleSubmit} >
// //                     <div className="position-relative mb-3">
// //                         <input
// //                             type="email"
// //                             name="email_id"
// //                             onChange={handleChange}
// //                             placeholder="Email address"
// //                             className="form-control ps-5"
// //                             required
// //                             value={userLogin.email_id}

// //                         />
// //                         <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
// //                             <IoMail />
// //                         </span>
// //                     </div>

// //                     <div className="position-relative mb-3">
// //                         <input
// //                             type={isPasswordShown ? 'text' : 'password'}
// //                             placeholder="Password"
// //                             className="form-control ps-5 pe-5"
// //                             required
// //                             name="user_password"
// //                             onChange={handleChange}
// //                             value={userLogin.user_password}
// //                         />
// //                         <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
// //                             <FaLock />
// //                         </span>
// //                         <span
// //                             className="position-absolute top-50 end-0 translate-middle-y pe-3 text-secondary"
// //                             style={{ cursor: 'pointer' }}
// //                             onClick={() => setIsPasswordShown(prev => !prev)}
// //                         >
// //                             {isPasswordShown ? <MdVisibility /> : <MdVisibilityOff />}
// //                         </span>
// //                     </div>

// //                     <button type="submit" className="btn btn-primary w-100 mt-3">Log In</button>
// //                 </form>

// //                 {/* <p className="text-center mt-4">
// //                     Don&apos;t have an account? <a href="#" className="text-decoration-none">Sign up</a>
// //                 </p> */}
// //             </div>
// //         </div>

// //     );
// // }

// // export default LoginPage;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import api from "../api";

// function LoginPage({ onLogin }) {
//     const navigate = useNavigate();
//     const [isPasswordShown, setIsPasswordShown] = useState(false);
//     const [userLogin, setUserLogin] = useState({
//         email_id: '',
//         user_password: '',
//     });

//     const fetchLogin = async () => {
//         try {
//             const userInfo = new FormData();
//             userInfo.append('email_id', userLogin.email_id);
//             userInfo.append('user_password', userLogin.user_password);

//             const response = await api.post("/users/login/", userInfo);
//             // console.log(response.data)
//             localStorage.setItem("token", response.data.access_token);
//             localStorage.setItem("user", JSON.stringify(response.data.user));
//             localStorage.setItem("auth", "true");

//             // console.log("Login successful:", response.data);
//             onLogin();
//             const Toast = Swal.mixin({
//                 toast: true,
//                 position: "top-end",
//                 showConfirmButton: false,
//                 timer: 1000,
//                 timerProgressBar: true,
//                 didOpen: (toast) => {
//                     toast.onmouseenter = Swal.stopTimer;
//                     toast.onmouseleave = Swal.resumeTimer;
//                 }
//             });
//             Toast.fire({
//                 icon: "success",
//                 title: "User Login Successfully"
//             });
//             navigate('/dashboard')
//         } catch (error) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Invalid Detail",
//                 text: error?.response?.data?.detail || error.message || "Unknown error"
//             });
//         }
//     };

// }

// const handleChange = (e) => {
//     e.preventDefault();
//     setUserLogin((prev) => ({
//         ...prev,
//         [e.target.name]: e.target.value,
//     }));
// }

// const handleSubmit = (e) => {
//     e.preventDefault();
//     fetchLogin();
// }

// return (
//     <div className="h-100  d-flex justify-content-center align-items-center">
//         <div className=" login-container container" style={{ maxWidth: "400px" }}>
//             <h2 className="form-title text-center mb-4">Log in with</h2>
//             <div className="social-login d-flex gap-2 mb-4">
//                 <button className="social-button btn btn-light border w-100 d-flex align-items-center justify-content-center">
//                     <img src="/google.svg" alt="Google" className="me-2" width={20} />
//                     Google
//                 </button>
//                 <button className="social-button btn btn-light border w-100 d-flex align-items-center justify-content-center">
//                     <img src="/apple.svg" alt="Apple" className="me-2" width={20} />
//                     Apple
//                 </button>
//             </div>
//             <p className="separator text-center my-3"><span>or</span></p>
//             <form className="login-form" onSubmit={handleSubmit} >
//                 <div className="position-relative mb-3">
//                     <input
//                         type="email"
//                         name="email_id"
//                         onChange={handleChange}
//                         placeholder="Email address"
//                         className="form-control ps-5"
//                         required
//                         value={userLogin.email_id}
//                     />

//                     <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
//                         <IoMail />
//                     </span>
//                 </div>

//                 <div className="position-relative mb-3">
//                     <input
//                         type={isPasswordShown ? 'text' : 'password'}
//                         placeholder="Password"
//                         className="form-control ps-5 pe-5"
//                         required
//                         name="user_password"
//                         onChange={handleChange}
//                         value={userLogin.user_password}
//                     />
//                     <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
//                         <FaLock />
//                     </span>
//                     <span
//                         className="position-absolute top-50 end-0 translate-middle-y pe-3 text-secondary"
//                         style={{ cursor: 'pointer' }}
//                         onClick={() => setIsPasswordShown(prev => !prev)}
//                     >
//                         {isPasswordShown ? <MdVisibility /> : <MdVisibilityOff />}
//                     </span>
//                 </div>

//                 <button type="submit" className="btn btn-primary w-100 mt-3">Log In</button>
//             </form>

//             {/* <p className="text-center mt-4">
//                     Don&apos;t have an account? <a href="#" className="text-decoration-none">Sign up</a>
//                 </p> */}
//         </div>
//     </div>
// );


// export default LoginPage;




import React, { useState } from "react";
import { IoMail } from "react-icons/io5";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [userLogin, setUserLogin] = useState({
    email_id: '',
    user_password: '',
  });

  const fetchLogin = async () => {
    try {
      const userInfo = new FormData();
      userInfo.append('email_id', userLogin.email_id);
      userInfo.append('user_password', userLogin.user_password);

      const response = await api.post("/users/login/", userInfo);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("auth", "true");

      onLogin();

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "User Login Successfully"
      });

      navigate('/dashboard');
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Invalid Detail",
        text: error?.response?.data?.detail || error.message || "Unknown error"
      });
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setUserLogin((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchLogin();
  };

  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div className="login-container container" style={{ maxWidth: "400px" }}>
        <h2 className="form-title text-center mb-4">Log in with</h2>

        <div className="social-login d-flex gap-2 mb-4">
          <button className="social-button btn btn-light border w-100 d-flex align-items-center justify-content-center">
            <img src="/google.svg" alt="Google" className="me-2" width={20} />
            Google
          </button>
          <button className="social-button btn btn-light border w-100 d-flex align-items-center justify-content-center">
            <img src="/apple.svg" alt="Apple" className="me-2" width={20} />
            Apple
          </button>
        </div>

        <p className="separator text-center my-3"><span>or</span></p>

        <form className="login-form" onSubmit={handleSubmit} >
          <div className="position-relative mb-3">
            <input
              type="email"
              name="email_id"
              onChange={handleChange}
              placeholder="Email address"
              className="form-control ps-5"
              required
              value={userLogin.email_id}
            />
            <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
              <IoMail />
            </span>
          </div>

          <div className="position-relative mb-3">
            <input
              type={isPasswordShown ? 'text' : 'password'}
              placeholder="Password"
              className="form-control ps-5 pe-5"
              required
              name="user_password"
              onChange={handleChange}
              value={userLogin.user_password}
            />
            <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
              <FaLock />
            </span>
            <span
              className="position-absolute top-50 end-0 translate-middle-y pe-3 text-secondary"
              style={{ cursor: 'pointer' }}
              onClick={() => setIsPasswordShown(prev => !prev)}
            >
              {isPasswordShown ? <MdVisibility /> : <MdVisibilityOff />}
            </span>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
