import { Navbar } from '@/app/components/landing/Navbar'
import { HeroSection } from '@/app/components/landing/HeroSection'
import { HowItWorks } from '@/app/components/landing/HowItWorks'
import { FeaturesSection } from '@/app/components/landing/FeaturesSection'
import { Testimonials } from '@/app/components/landing/Testimonials'
import { EarningsTicker } from '@/app/components/landing/EarningsTicker'
import { CTASection } from '@/app/components/landing/CTASection'
import { Footer } from '@/app/components/landing/Footer'
import { FeaturedVideo } from '@/app/components/landing/FeaturedVideo'
import { Tokenomics } from '@/app/components/landing/Tokenomics'

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-primary">
      <Navbar />
      <HeroSection />
      <FeaturedVideo />
      <EarningsTicker />
      <HowItWorks />
      <FeaturesSection />
      <Tokenomics />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  )
}
