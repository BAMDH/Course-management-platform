import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { 
  Award, 
  BookOpenCheck, 
  PiggyBank, 
  Star, 
  Zap, 
  HeartHandshake, 
  TrendingUp, 
  Medal, 
  Lightbulb, 
  ShieldCheck, 
  Smartphone
} from "lucide-react"

export default function AboutPage() {
  const values = [
    { icon: Award, text: "5 años de experiencia" },
    { icon: BookOpenCheck, text: "Cursos prácticos" },
    { icon: PiggyBank, text: "Enseñanza accesible" },
    { icon: Star, text: "Alta calidad educativa" },
    { icon: Zap, text: "Clases dinámicas" },
    { icon: HeartHandshake, text: "Acompañamiento cercano" },
    { icon: TrendingUp, text: "Desarrollo personal" },
    { icon: Medal, text: "Excelencia educativa" },
    { icon: Lightbulb, text: "Innovación" },
    { icon: ShieldCheck, text: "Confianza y profesionalismo" },
    { icon: Smartphone, text: "Comunicación por Instagram y Facebook" }
  ]

  return (
    <main className="min-h-screen bg-[#FBF9F8] font-['Inter',sans-serif]">
      {/* 1. Título e 2. Introducción */}
      <section className="relative overflow-hidden bg-white px-8 py-24 border-b border-zinc-100">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-red-600 mb-4 block">
            Descubre nuestra historia
          </span>
          <h1 className="text-5xl font-extrabold leading-tight text-zinc-900 md:text-6xl font-['Manrope',sans-serif]">
            Sobre Nosotros
          </h1>
          <p className="mt-8 text-lg leading-8 text-zinc-600 md:text-xl">
            En el Centro de Capacitación G&G creemos firmemente que cada persona tiene habilidades, talentos y capacidades que pueden desarrollarse con la guía adecuada. Ofrecemos cursos prácticos, accesibles y de alta calidad, diseñados específicamente para que nuestros estudiantes aprendan de forma dinámica, cercana y enfocada en resultados reales.
          </p>
        </div>
      </section>

      {/* 3. Experiencia */}
      <section className="bg-red-700 px-8 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-extrabold mb-4 font-['Manrope',sans-serif]">
            Nuestra Trayectoria
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">
            Contamos con <strong className="text-white">5 años de experiencia</strong> brindando formación práctica a estudiantes que desean adquirir nuevos conocimientos, fortalecer sus capacidades y crecer tanto a nivel personal como profesional.
          </p>
        </div>
      </section>

      {/* 4. Misión, 5. Visión, 6. Propósito */}
      <section className="px-8 py-24 mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          <div className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
              <Star className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 mb-4 font-['Manrope',sans-serif]">
              Nuestra Misión
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              "Ofrecer cursos prácticos, accesibles y de alta calidad, brindando herramientas y conocimientos que permitan a los estudiantes desarrollar sus capacidades."
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
              <Lightbulb className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 mb-4 font-['Manrope',sans-serif]">
              Nuestra Visión
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              "Ser la principal institución de capacitación en cursos prácticos y dinámicos, impulsando el desarrollo personal a través de la excelencia educativa y la innovación."
            </p>
          </div>

          <div className="rounded-3xl bg-zinc-900 p-10 shadow-xl md:col-span-2 lg:col-span-1 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
               <HeartHandshake className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <HeartHandshake className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-4 font-['Manrope',sans-serif]">
                Nuestro Propósito
              </h3>
              <p className="text-white/90 leading-relaxed font-medium text-lg">
                "Que cada estudiante descubra y desarrolle las habilidades que Dios le ha dado."
              </p>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-white/70 italic leading-relaxed text-sm">
                  “Lo he llenado del espíritu de Dios y le he dado gran sabiduría, capacidad y destreza en toda clase de artes manuales y oficios.”
                </p>
                <p className="text-white/90 font-bold mt-3 text-sm">— Éxodo 31:2-6</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Valores / Características */}
      <section className="bg-white px-8 py-24 border-y border-zinc-100">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-zinc-900 font-['Manrope',sans-serif]">
              Lo que nos caracteriza
            </h2>
            <p className="mt-4 text-zinc-600 max-w-2xl mx-auto">
              Nuestros valores y principios son la base de la experiencia educativa que ofrecemos a cada uno de nuestros estudiantes.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-colors group">
                <val.icon className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-zinc-800 text-sm md:text-base">{val.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Compromiso y 9. Redes Sociales */}
      <section className="px-8 py-24 mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-zinc-900 mb-4 font-['Manrope',sans-serif]">
                Nuestro Compromiso
              </h2>
              <p className="text-zinc-600 leading-relaxed text-lg">
                El Centro busca brindar una experiencia de aprendizaje clara, práctica y significativa. Sabemos que la confianza es fundamental; por eso, nos esforzamos en que nuestra presencia digital refleje con total transparencia la realidad de nuestras clases, instalaciones, métodos y valores. Queremos ayudarte a reducir cualquier desconfianza inicial para que des el paso seguro hacia tu formación.
              </p>
            </div>

            <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
              <h3 className="text-xl font-bold text-red-900 mb-3 font-['Manrope',sans-serif]">
                Comunidad en Línea
              </h3>
              <p className="text-red-800/80 leading-relaxed">
                El Centro también comparte información, novedades, imágenes y contenido de valor en <strong><a href="https://www.instagram.com/centrodecapacitaciongyg/" target="_blank" rel="noopener noreferrer" className="hover:text-red-900 underline">Instagram</a></strong> y <strong><a href="https://www.facebook.com/centrodecapacitaciongyg" target="_blank" rel="noopener noreferrer" className="hover:text-red-900 underline">Facebook</a></strong>. Nuestro objetivo es acercarnos a nuevos estudiantes y mostrar de forma transparente el ambiente real, cálido y profesional que se vive en nuestras aulas.
              </p>
            </div>
          </div>

          <div className="relative rounded-[40px] overflow-hidden shadow-2xl h-[500px]">
             <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop" 
              alt="Estudiantes en clase" 
              className="absolute inset-0 w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
             <div className="absolute bottom-0 left-0 p-10">
               <p className="text-white font-bold text-2xl font-['Manrope',sans-serif]">
                 "Formando talento, construyendo futuros."
               </p>
             </div>
          </div>

        </div>
      </section>

      {/* 10. Llamado a la acción */}
      <section className="bg-zinc-900 px-8 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold leading-tight text-white font-['Manrope',sans-serif] mb-6">
            ¿Listo para descubrir tus habilidades?
          </h2>
          <p className="text-lg text-white/80 mb-10">
            Únete a nuestra comunidad de estudiantes y comienza tu camino hacia la excelencia personal y profesional.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              className="bg-red-600 px-8 py-6 text-lg hover:bg-red-700 rounded-xl font-bold"
            >
              <Link to="/courses">Conoce nuestras capacitaciones</Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-white/10 px-8 py-6 text-lg text-white hover:bg-white/20 hover:text-white rounded-xl font-bold"
            >
              <a href="https://www.instagram.com/centrodecapacitaciongyg/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-white/10 px-8 py-6 text-lg text-white hover:bg-white/20 hover:text-white rounded-xl font-bold"
            >
              <a href="https://www.facebook.com/centrodecapacitaciongyg" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </Button>
          </div>
        </div>
      </section>

    </main>
  )
}