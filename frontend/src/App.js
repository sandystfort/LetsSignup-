import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./components/pages/landingPage";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import { createContext, useState, useEffect } from "react";
import getUserInfo from "./utilities/decodeJwt";
import CreateTimeSlot from "./components/pages/createTimeslotPage";
import ListTimeSlotsPage from "./components/pages/listTimeSlotsPage";
import DetailPage from "./components/pages/detailPage"; // Ensure DetailPage is imported
import EditTimeSlotPage from "./components/pages/editTimeSlotPage";

export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <>
      <Navbar />
      <UserContext.Provider value={user}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/home" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route path="/CreateTimeSlot" element={<CreateTimeSlot />} />
          <Route path="/ListTimeSlots" element={<ListTimeSlotsPage />} />
          {/* Add the DetailPage route with dynamic :id */}
          <Route path="/details/:id" element={<DetailPage />} />
          <Route path="/edit/:id" element={<EditTimeSlotPage />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
};

export default App;
