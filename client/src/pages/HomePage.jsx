import React from "react";
import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";
import Banner from "../components/Banner";
import Testimonial from "../components/Testimonial";
import NewLetter from "../components/NewLetter";

const HomePage = () => {
  return (
    <>
      <Hero />
      <FeatureSection />
      <Banner />
      <Testimonial />
      <NewLetter />
    </>
  );
};

export default HomePage;
