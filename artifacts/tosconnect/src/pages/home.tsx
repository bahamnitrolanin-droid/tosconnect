import * as React from "react"
import { Link } from "wouter"
import { ArrowRight, CheckCircle2, Play, Users, Clock, ShieldCheck, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import heroBg from "@assets/generated_images/hero-studio.jpg"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
          <img 
            src={heroBg} 
            alt="Cinematic Recording Studio" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content */}
        <div className="container relative z-20 px-4 md:px-6">
          <div className="max-w-3xl animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-both">
            <Badge className="mb-6" variant="outline">Premium Audio Services</Badge>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Where Music <br/>
              <span className="text-primary italic">Meets Soul.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl font-light">
              Serious music production for the Cambodian creator economy. We bridge the gap between raw talent and radio-ready sound with industry-standard mixing, mastering, and expert consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services/mixing-mastering">
                <Button size="lg" className="w-full sm:w-auto font-serif text-lg h-14 px-8 gap-2 group">
                  Book a Session
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-serif text-lg h-14 px-8 text-white border-white/20 hover:bg-white/10">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision / About */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-1000 fill-mode-both">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
              Elevating Cambodia's <br className="hidden md:block"/>Digital Hub
            </h2>
            <p className="text-xl text-white/60 font-light leading-relaxed">
              "To be Cambodia's premier digital hub where modern music production meets soulful artistry." 
            </p>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
            <p className="text-lg text-white/50">
              Run by an established artist and producer, TosConnect isn't just about technical precision—it's about understanding the heart of your track. Whether you're an independent singer-songwriter or a growing content creator in Phnom Penh, we bring out the best in your sound.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-card/30 border-y border-white/5">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Our Services</h2>
            <p className="text-white/60 text-lg">Professional solutions for serious creators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mixing & Mastering Card */}
            <Card className="bg-card/50 border-white/10 overflow-hidden flex flex-col group hover:border-primary/50 transition-colors">
              <div className="h-48 bg-black relative flex items-center justify-center border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-black to-black opacity-50 group-hover:opacity-100 transition-opacity" />
                <Play className="w-16 h-16 text-primary relative z-10" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">Most Popular</Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-white">$80 <span className="text-sm text-white/50 font-sans">USD</span></div>
                    <div className="text-sm text-white/50">328,000 ៛ KHR</div>
                  </div>
                </div>
                <CardTitle className="text-2xl">Audio Mixing & Mastering</CardTitle>
                <CardDescription className="text-base text-white/60">
                  Upload your raw vocal stems. Get a radio-ready, professionally mixed and mastered track in 3-5 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Industry-standard loudness and clarity</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Vocal tuning and precise EQ</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>3–5 day turnaround</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/services/mixing-mastering" className="w-full">
                  <Button className="w-full font-serif text-lg h-12">Book Mixing & Mastering</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Consultation Card */}
            <Card className="bg-card/50 border-white/10 overflow-hidden flex flex-col group hover:border-primary/50 transition-colors">
              <div className="h-48 bg-black relative flex items-center justify-center border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-black to-black opacity-50 group-hover:opacity-100 transition-opacity" />
                <Users className="w-16 h-16 text-blue-500 relative z-10" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="border-white/20">1-on-1 Session</Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-white">$40 <span className="text-sm text-white/50 font-sans">USD</span></div>
                    <div className="text-sm text-white/50">164,000 ៛ KHR</div>
                  </div>
                </div>
                <CardTitle className="text-2xl">Virtual Music Consultation</CardTitle>
                <CardDescription className="text-base text-white/60">
                  A focused 1-hour Zoom session to tackle your production hurdles, distribution strategy, or songwriting blocks.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Direct feedback on your projects</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Release and distribution strategy</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>60 minutes via Zoom/Meet</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/services/consultation" className="w-full">
                  <Button variant="secondary" className="w-full font-serif text-lg h-12">Book Consultation</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="grid gap-6">
            <div className="p-6 rounded-lg border border-white/5 bg-card/20">
              <h3 className="text-xl font-medium text-white mb-2">How long does mixing and mastering take?</h3>
              <p className="text-white/60">Our standard turnaround time is 3–5 business days from the moment we receive all your correctly formatted stems.</p>
            </div>
            
            <div className="p-6 rounded-lg border border-white/5 bg-card/20">
              <h3 className="text-xl font-medium text-white mb-2">Do I get my project files back?</h3>
              <p className="text-white/60">You receive a high-resolution 24-bit WAV file and an MP3 of the final master. We do not release the DAW session files (Logic/Pro Tools/Ableton), as our specific plugin chains and processing techniques are proprietary.</p>
            </div>

            <div className="p-6 rounded-lg border border-white/5 bg-card/20">
              <h3 className="text-xl font-medium text-white mb-2">How do I pay?</h3>
              <p className="text-white/60">We use ABA PayWay KHQR for all secure payments. After submitting your order, you'll receive an email with instructions and the KHQR code to scan with your banking app.</p>
            </div>

            <div className="p-6 rounded-lg border border-white/5 bg-card/20">
              <h3 className="text-xl font-medium text-white mb-2">Are revisions included?</h3>
              <p className="text-white/60">Yes, mixing and mastering services include one free round of minor revisions to ensure the final track meets your vision.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
