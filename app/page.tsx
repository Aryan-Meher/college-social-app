import { Button } from "@/components/ui/button"
import { GraduationCap, Building2, Users, Award, Briefcase, Share2 } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex h-14 sm:h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg sm:text-xl text-foreground">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden xs:inline sm:inline">Campus Connect</span>
            <span className="xs:hidden sm:hidden">CC</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <Link
              href="/college"
              className="text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              <span className="hidden sm:inline">Colleges</span>
              <span className="sm:hidden">Browse</span>
            </Link>
            <Link
              href="/feed"
              className="hidden sm:inline text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="rounded-full text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
                Join
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col items-center gap-8 sm:gap-12 md:gap-16 py-12 sm:py-20 md:py-32 lg:py-40">
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 max-w-4xl text-center animate-fade-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance leading-tight">
            Discover, Unfiltered.
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground text-balance leading-relaxed px-4 sm:px-0">
            Real student stories. Real college life. No filters.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center mt-2 sm:mt-4 px-4 sm:px-0">
            <Link href="/college" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="rounded-full px-6 sm:px-8 text-sm sm:text-base h-11 sm:h-12 w-full sm:w-auto"
              >
                Explore Colleges
              </Button>
            </Link>
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-6 sm:px-8 text-sm sm:text-base h-11 sm:h-12 bg-transparent w-full sm:w-auto"
              >
                Join & Upload
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-5xl animate-fade-up animation-delay-200 px-4 sm:px-0">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-6 sm:p-8 md:p-12 lg:p-20 animate-gradient-shift">
            <img
              src="/modern-flat-illustration-of-university-campus-with.jpg"
              alt="Campus illustration"
              className="w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto">
          <div className="flex flex-col gap-12 sm:gap-14 md:gap-16">
            <div className="flex flex-col gap-3 sm:gap-4 text-center max-w-3xl mx-auto animate-fade-up px-4 sm:px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Everything you need to discover college life
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                Connect with students, explore campuses, and share your authentic experiences
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
              <div className="group flex flex-col gap-4 rounded-2xl border border-border/50 bg-white p-8 transition-all duration-400 hover:shadow-lg hover:-translate-y-1 animate-fade-up animation-delay-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Explore Colleges</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Browse through hundreds of colleges and discover what makes each campus unique through student
                  perspectives.
                </p>
              </div>

              <div className="group flex flex-col gap-4 rounded-2xl border border-border/50 bg-white p-8 transition-all duration-400 hover:shadow-lg hover:-translate-y-1 animate-fade-up animation-delay-200">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Real Student Stories</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Read authentic experiences from students about campus life, academics, and everything in between.
                </p>
              </div>

              <div className="group flex flex-col gap-4 rounded-2xl border border-border/50 bg-white p-8 transition-all duration-400 hover:shadow-lg hover:-translate-y-1 animate-fade-up animation-delay-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Campus Life</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get an inside look at dorms, dining halls, events, and the daily experiences that shape college life.
                </p>
              </div>

              <div className="group flex flex-col gap-4 rounded-2xl border border-border/50 bg-white p-8 transition-all duration-400 hover:shadow-lg hover:-translate-y-1 animate-fade-up animation-delay-400">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-chart-4/20 to-chart-4/10 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-7 w-7 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold">Clubs & Activities</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discover student organizations, sports teams, cultural groups, and activities at every campus.
                </p>
              </div>

              <div className="group flex flex-col gap-4 rounded-2xl border border-border/50 bg-white p-8 transition-all duration-400 hover:shadow-lg hover:-translate-y-1 animate-fade-up animation-delay-500">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-chart-5/20 to-chart-5/10 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="h-7 w-7 text-chart-5" />
                </div>
                <h3 className="text-xl font-semibold">Placements & Careers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Learn about internship opportunities, career services, and post-graduation outcomes from students.
                </p>
              </div>

              <div className="group flex flex-col gap-4 rounded-2xl border border-border/50 bg-white p-8 transition-all duration-400 hover:shadow-lg hover:-translate-y-1 animate-fade-up">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 group-hover:scale-110 transition-transform duration-300">
                  <Share2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Share Your Story</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload photos, videos, and write articles to share your college experience with future students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-secondary/5 to-accent/5 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 animate-slide-in-left px-2 sm:px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Connect with students from your dream college
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                Get real insights from current students. See photos and videos of campus events, dorm life, study
                spaces, and more. Make informed decisions about your college journey.
              </p>
              <div className="flex gap-4 mt-2 sm:mt-4">
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-in-right px-2 sm:px-0">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-6 md:p-8 animate-float">
                <img
                  src="/minimal-flat-illustration-of-students-studying-tog.jpg"
                  alt="Students collaborating"
                  className="w-full h-auto rounded-lg sm:rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div className="relative order-2 md:order-1 animate-scale-in px-2 sm:px-0">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-accent/10 to-primary/10 p-4 sm:p-6 md:p-8">
                <img
                  src="/minimal-flat-illustration-of-campus-events-festiv.jpg"
                  alt="Campus events and activities"
                  className="w-full h-auto rounded-lg sm:rounded-xl shadow-lg"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 order-1 md:order-2 animate-slide-in-right px-2 sm:px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Join thousands of students sharing their journey
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                From first-year experiences to senior year memories, students are sharing authentic moments that matter.
                Your story could help the next generation find their perfect fit.
              </p>
              <div className="flex flex-col gap-3 sm:gap-4 mt-2 sm:mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">10,000+ Active Students</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                    <Building2 className="h-5 w-5 text-secondary" />
                  </div>
                  <span className="text-foreground font-medium">500+ Colleges</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Share2 className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-foreground font-medium">50,000+ Stories Shared</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient-shift px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto flex flex-col items-center gap-6 sm:gap-8 text-center">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 max-w-2xl animate-fade-up px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              Join thousands of students sharing their stories
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Sign up today and start exploring authentic college experiences or share your own journey.
            </p>
          </div>
          <Link href="/auth/signup" className="w-full sm:w-auto px-4 sm:px-0">
            <Button
              size="lg"
              className="rounded-full px-6 sm:px-8 text-sm sm:text-base h-11 sm:h-12 mt-2 sm:mt-4 animate-scale-in animation-delay-200 w-full sm:w-auto"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 sm:py-10 md:py-12 mt-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto flex flex-col gap-4 sm:gap-5 md:gap-6 text-center">
          <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Campus Connect</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground px-4 sm:px-0">
            Discover college life through the eyes of real students. Transparent, authentic, unfiltered.
          </p>
          <p className="text-xs text-muted-foreground">© 2025 Campus Connect. Made for students aged 16–24.</p>
          <p className="text-xs sm:text-sm font-medium text-foreground/70 tracking-wide">
            MADE BY PEOPLE OF TEAM LOGIC LOOM
          </p>
        </div>
      </footer>
    </div>
  )
}
