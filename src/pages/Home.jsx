import React from 'react'
import Hero from '../components/Hero'
import TrustBadges from '../components/TrustBadges'
import Reviews from '../components/Reviews'
import ContactForm from '../components/ContactForm'

function Home() {
  return (
    <div>
        <Hero />
        <TrustBadges />
        <Reviews />
        <ContactForm />
    </div>
  )
}

export default Home