import { Navbar } from '@/app/components/landing/Navbar'
import { HeroSection } from '@/app/components/landing/HeroSection'
import { HowItWorks } from '@/app/components/landing/HowItWorks'
import { FeaturedVideo } from '@/app/components/landing/FeaturedVideo'
import { FeaturesSection } from '@/app/components/landing/FeaturesSection'
import { MoneyFlowSection } from '@/app/components/landing/MoneyFlowSection'
import { Testimonials } from '@/app/components/landing/Testimonials'
import { FAQ } from '@/app/components/landing/FAQ'
import { SeeItInAction } from '@/app/components/landing/SeeItInAction'
import { CTASection } from '@/app/components/landing/CTASection'
import { Partners } from '@/app/components/landing/Partners'
import { Footer } from '@/app/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-primary">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturedVideo />
      <FeaturesSection />
      <MoneyFlowSection />
      <Testimonials />
      <FAQ />
      <SeeItInAction />
      <CTASection />
      <Partners />
      <Footer />
    </div>
  )
}
