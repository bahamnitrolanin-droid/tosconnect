import * as React from "react"
import { Link } from "wouter"
import { ArrowRight, CheckCircle2, Play, Users, Clock, HelpCircle, Music2, Headphones, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import heroBg from "@assets/generated_images/hero-studio.jpg"

const stats = [
  { icon: Music2, label: "Services Delivered", value: "500+" },
  { icon: Star, label: "Client Satisfaction", value: "5.0 ★" },
  { icon: Headphones, label: "Turnaround", value: "3–5 Days" },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/65 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent z-10" />
          <img
            src={heroBg}
            alt="Cinematic Recording Studio"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content — centered at all breakpoints */}
        <div className="container relative z-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-both">
            <Badge className="mb-6 px-4 py-1.5 text-xs tracking-widest uppercase" variant="outline">
              Premium Audio Services
            </Badge>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.05] tracking-tight">
              Where Music{" "}
              <span className="text-primary italic block sm:inline">Meets Soul.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/75 mb-10 max-w-xl mx-auto font-light leading-relaxed">
              Serious music production for Cambodia's creator economy — industry-standard mixing, mastering, and expert consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/services/mixing-mastering">
                <Button size="lg" className="w-full sm:w-auto font-serif text-base sm:text-lg h-13 px-8 gap-2 group">
                  Book a Session
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#services">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-serif text-base sm:text-lg h-13 px-8 text-white border-white/20 hover:bg-white/10"
                >
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="bg-card/60 border-y border-white/5">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-3 divide-x divide-white/5">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-5 px-2 sm:px-6 text-center">
                <Icon className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <div className="text-lg sm:text-2xl font-bold font-mono text-white leading-none">{value}</div>
                  <div className="text-[10px] sm:text-xs text-white/40 mt-0.5 tracking-wide uppercase">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Vision / About ── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-1000 fill-mode-both">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-medium tracking-widest uppercase">
              <div className="h-px w-8 bg-primary" />
              Our Mission
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              Elevating Cambodia's Digital Music Hub
            </h2>
            <p className="text-lg sm:text-xl text-white/60 font-light leading-relaxed italic">
              "To be Cambodia's premier digital hub where modern music production meets soulful artistry."
            </p>
            <div className="h-px w-24 bg-primary/40 mx-auto rounded-full" />
            <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
              Run by an established artist and producer, TosConnect isn't just about technical precision — it's about understanding the heart of your track. Whether you're an independent singer-songwriter or a growing content creator in Phnom Penh, we bring out the best in your sound.
            </p>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 md:py-28 bg-card/30 border-y border-white/5">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-medium tracking-widest uppercase mb-4">
              <div className="h-px w-8 bg-primary" />
              What We Offer
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3">Our Services</h2>
            <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto">Professional solutions for serious creators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Mixing & Mastering */}
            <Card className="bg-card/50 border-white/10 overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.3)]">
              <div className="h-44 bg-black relative flex items-center justify-center border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-black to-black opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <Play className="w-14 h-14 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary">Most Popular</Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-white">$3 <span className="text-sm text-white/40 font-sans">USD</span></div>
                    <div className="text-xs text-white/40">12,300 ៛ KHR</div>
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl">Audio Mixing & Mastering</CardTitle>
                <CardDescription className="text-sm sm:text-base text-white/55 leading-relaxed">
                  Upload your raw vocal stems. Get a radio-ready, professionally mixed and mastered track in 3–5 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-0">
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-3 text-sm text-white/75">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    Industry-standard loudness and clarity
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/75">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    Vocal tuning and precise EQ
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/75">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    3–5 day turnaround
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Link href="/services/mixing-mastering" className="w-full">
                  <Button className="w-full font-serif text-base h-12 gap-2 group/btn">
                    Book Mixing & Mastering
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Consultation */}
            <Card className="bg-card/50 border-white/10 overflow-hidden flex flex-col group hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.15)]">
              <div className="h-44 bg-black relative flex items-center justify-center border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-black to-black opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <Users className="w-14 h-14 text-white/50 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="border-white/20 text-white/70">1-on-1 Session</Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-white">$20 <span className="text-sm text-white/40 font-sans">USD</span></div>
                    <div className="text-xs text-white/40">82,000 ៛ KHR</div>
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl">Virtual Music Consultation</CardTitle>
                <CardDescription className="text-sm sm:text-base text-white/55 leading-relaxed">
                  A focused 1-hour Zoom session to tackle your production hurdles, distribution strategy, or songwriting blocks.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-0">
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-3 text-sm text-white/75">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    Direct feedback on your projects
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/75">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    Release and distribution strategy
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/75">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    60 minutes via Zoom / Meet
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Link href="/services/consultation" className="w-full">
                  <Button variant="secondary" className="w-full font-serif text-base h-12 gap-2 group/btn">
                    Book Consultation
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-medium tracking-widest uppercase mb-4">
              <div className="h-px w-8 bg-primary" />
              FAQ
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white flex items-center justify-center gap-3">
              <HelpCircle className="w-8 h-8 text-primary" />
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid gap-4">
            {[
              {
                q: "How long does mixing and mastering take?",
                a: "Our standard turnaround is 3–5 business days from the moment we receive all your correctly formatted stems.",
              },
              {
                q: "Do I get my project files back?",
                a: "You receive a high-resolution 24-bit WAV file and an MP3 of the final master. DAW session files (Logic / Pro Tools / Ableton) are not included, as our plugin chains and processing techniques are proprietary.",
              },
              {
                q: "How do I pay?",
                a: "We use ABA PayWay KHQR for all secure payments. After submitting your order you'll see a KHQR code to scan instantly with your ABA Mobile or any KHQR-compatible banking app.",
              },
              {
                q: "Are revisions included?",
                a: "Yes — mixing and mastering includes one free round of minor revisions (level, EQ, loudness) to ensure the final track meets your vision.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="p-5 sm:p-6 rounded-lg border border-white/5 bg-card/20 hover:border-primary/20 transition-colors">
                <h3 className="text-base sm:text-lg font-medium text-white mb-2">{q}</h3>
                <p className="text-sm sm:text-base text-white/55 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 md:py-28 bg-card/30 border-t border-white/5">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Ready to elevate your sound?
            </h2>
            <p className="text-white/50 text-base sm:text-lg leading-relaxed">
              Submit your stems today — professional results in 3–5 days, paid securely via KHQR.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/services/mixing-mastering">
                <Button size="lg" className="w-full sm:w-auto font-serif text-base px-8 gap-2 group">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/services/consultation">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-serif text-base px-8 text-white border-white/20 hover:bg-white/10">
                  Book a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
