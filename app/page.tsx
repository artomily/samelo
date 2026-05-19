import { Navbar } from '@/app/components/landing/Navbar'
import { HeroSection } from '@/app/components/landing/HeroSection'
import { BentoFeatures } from '@/app/components/landing/BentoFeatures'
import { HowItWorks } from '@/app/components/landing/HowItWorks'
import { EarningsTicker } from '@/app/components/landing/EarningsTicker'
import { CTASection } from '@/app/components/landing/CTASection'

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-primary">
      <Navbar />
      <HeroSection />
      <BentoFeatures />
      <HowItWorks />
      <EarningsTicker />
      <CTASection />
    </div>
  )
}
