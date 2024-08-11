// src/app/page.tsx
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Briefcase, TrendingUp, Users, Building, Code, Stethoscope, GraduationCap } from 'lucide-react'
import heroImage from '@images/hero.png';

const features = [
  { 
    title: 'Potrivire AI',
    description: 'Algoritmul nostru avansat de AI analizează profilul tău și te conectează cu joburile potrivite.',
    icon: <CheckCircle className="h-6 w-6" />
  },
  { 
    title: 'Optimizare CV',
    description: 'Primește sugestii personalizate pentru a-ți îmbunătăți CV-ul și a-ți crește șansele de angajare.',
    icon: <TrendingUp className="h-6 w-6" />
  },
  { 
    title: 'Recomandări de joburi',
    description: 'Descoperă oportunități de carieră adaptate perfect profilului și aspirațiilor tale.',
    icon: <Briefcase className="h-6 w-6" />
  },
  { 
    title: 'Recrutare de talente',
    description: 'Angajatorii pot găsi rapid candidații ideali folosind tehnologia noastră de potrivire.',
    icon: <Users className="h-6 w-6" />
  }
]

const jobCategories = [
  { name: 'IT & Dezvoltare', icon: <Code className="h-6 w-6" /> },
  { name: 'Finanțe & Contabilitate', icon: <Building className="h-6 w-6" /> },
  { name: 'Sănătate & Medicină', icon: <Stethoscope className="h-6 w-6" /> },
  { name: 'Educație & Training', icon: <GraduationCap className="h-6 w-6" /> },
]

const testimonials = [
  {
    name: 'Ana Popescu',
    position: 'Developer Full Stack',
    company: 'TechRO',
    quote: 'Datorită JobMatch, mi-am găsit jobul de vis în doar două săptămâni!',
    image: '/ana-popescu.jpg'
  },
  {
    name: 'Mihai Ionescu',
    position: 'Manager HR',
    company: 'FinanceExpert',
    quote: 'JobMatch ne-a ajutat să găsim candidați excelenți pentru pozițiile dificil de ocupat.',
    image: '/mihai-ionescu.jpg'
  }
]

const recentJobs = [
  { title: 'Senior Java Developer', company: 'SoftVision', location: 'Cluj-Napoca' },
  { title: 'Marketing Manager', company: 'AdRo', location: 'București' },
  { title: 'Data Analyst', company: 'DataInsights', location: 'Timișoara' }
]

const blogPosts = [
  { title: '5 Sfaturi pentru un CV de succes', image: '/cv-tips.jpg' },
  { title: 'Cum să te pregătești pentru un interviu online', image: '/online-interview.jpg' },
  { title: 'Tendințe în piața muncii pentru 2024', image: '/job-market-trends.jpg' }
]

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Găsește jobul perfect cu inteligența artificială</h1>
        <p className="text-xl mb-8">JobMatch conectează candidații și angajatorii folosind tehnologie AI avansată</p>
        <div className="flex justify-center gap-4">
          <Button size="lg">Caută joburi</Button>
          <Button size="lg" variant="outline">Pentru angajatori</Button>
        </div>
        <div className="mt-12">
          <Image src={heroImage} alt="JobMatch AI" width={600} height={400} />
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-muted w-full">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Caracteristici cheie</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {feature.icon}
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Cum funcționează</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="font-bold mb-2">Creează-ți profilul</h3>
              <p>Completează-ți CV-ul și preferințele de carieră</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="font-bold mb-2">Primește potriviri</h3>
              <p>AI-ul nostru îți găsește cele mai bune oportunități</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="font-bold mb-2">Aplică și conectează-te</h3>
              <p>Aplică la joburile potrivite și începe o nouă carieră</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-muted w-full">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Povești de succes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="flex items-center p-6">
                  <Image src={testimonial.image} alt={testimonial.name} width={80} height={80} className="rounded-full mr-4" />
                  <div>
                    <p className="italic mb-2">"{testimonial.quote}"</p>
                    <p className="font-bold">{testimonial.name}</p>
                    <p>{testimonial.position} la {testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Categorii de joburi populare</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {jobCategories.map((category, index) => (
              <Card key={index} className="text-center hover:bg-muted cursor-pointer transition-colors">
                <CardContent className="p-6">
                  {category.icon}
                  <h3 className="font-bold mt-2">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-4xl font-bold">10,000+</h3>
              <p>Joburi potrivite</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">95%</h3>
              <p>Rată de satisfacție</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">1000+</h3>
              <p>Companii partenere</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pentru angajatori</h2>
          <p className="mb-8">Descoperiți cum JobMatch poate îmbunătăți procesul dvs. de recrutare și vă poate ajuta să găsiți candidații ideali.</p>
          <Button size="lg">Programează o demonstrație</Button>
        </div>
      </section>

      {/* Latest Job Openings Section */}
      <section className="py-20 bg-muted w-full">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Cele mai recente joburi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentJobs.map((job, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{job.location}</p>
                  <Button className="mt-4" variant="outline">Vezi detalii</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline">Vezi toate joburile</Button>
          </div>
        </div>
      </section>

      {/* Blog or Resources Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Resurse pentru carieră</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Card key={index}>
                <Image src={post.image} alt={post.title} width={400} height={200} className="w-full h-48 object-cover" />
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">{post.title}</h3>
                  <Button variant="link">Citește articolul</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline">Explorează toate resursele</Button>
          </div>
        </div>
      </section>
    </div>
  )
}