import React from "react";
import Hero from "../components/Hero.jsx";
import Departments from "../components/Departments.jsx";
import Biography from "../components/Biography.jsx";
import MessageForm from "../components/MessageForm.jsx";
const Home = () => {
  return (
    <>
      <Hero title={"Welcome to MediPulse"} imageUrl={"/hero.png"} />
      <Biography imageUrl={"/about.png"} />
      <Departments />
      <MessageForm />
    </>
  );
};

export default Home;
