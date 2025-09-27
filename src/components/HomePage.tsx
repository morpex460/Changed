import React from 'react';
import Header from './Header';
import Hero from './Hero';
import GroupContent from './GroupContent';
import CourseStructure from './CourseStructure';
import CourseDetails from './CourseDetails';
import PayoutProof from './PayoutProof';
import MembershipPlans from './MembershipPlans';
import FAQ from './FAQ';
import Contactw from './Contactw';
import Footer from './Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <div id="group-content">
        <GroupContent />
      </div>
      <CourseDetails />
      <CourseStructure />
      <PayoutProof />
      <MembershipPlans />
      <FAQ />
      <Contactw />
      <Footer />
    </>
  );
};

export default HomePage;
