import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const chefs = [
  {
    name: "Chef Mario González",
    specialty: "Especialista en chocolatería",
    image:
      "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=1200&auto=format&fit=crop",
    description:
      "Especialista en chocolatería con más de 20 años de experiencia internacional y reconocimiento en repostería fina.",
  },
  {
    name: "Chef Elena Quesada",
    specialty: "Maestra de decoración",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop",
    description:
      "Especialista en diseño de pasteles y técnicas modernas de decoración con enfoque en tendencias actuales.",
  },
  {
    name: "Chef Roberto Mora",
    specialty: "Panadería artesanal",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop",
    description:
      "Experto en panadería artesanal, con dominio en fermentación natural y técnicas tradicionales europeas.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FBF9F8]">
      <section className="relative h-[620px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?q=80&w=1600&auto=format&fit=crop"
          alt="Pastelería profesional"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight text-white md:text-7xl">
            Formación profesional
            <br />
            en pastelería y panadería
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-white/90 md:text-2xl">
            Centro de Capacitación G&G: Programas técnicos diseñados para
            desarrollar habilidades reales en la industria gastronómica.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-8 py-24 lg:grid-cols-2">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-red-700">
            Nuestra trayectoria
          </span>

          <h2 className="mt-4 text-5xl font-extrabold leading-tight text-zinc-900">
            Más de una década formando talento en el arte de la pastelería.
          </h2>

          <div className="mt-8 space-y-6 text-lg leading-8 text-zinc-600">
            <p>
              Fundada en el corazón de Cartago, Costa Rica, el Centro de
              Capacitación G&G nace con el objetivo de elevar la formación
              técnica del país.
            </p>

            <p>
              Nuestra metodología combina técnica, práctica y enfoque académico,
              asegurando que cada estudiante desarrolle habilidades aplicables
              al entorno real.
            </p>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop"
            alt="Panadería artesanal"
            className="rounded-3xl shadow-2xl"
          />

          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-red-700 p-8 text-white shadow-2xl">
            <div className="text-5xl font-black">10+</div>

            <div className="mt-2 text-sm font-medium uppercase tracking-widest">
              años de excelencia
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F0EF] px-8 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-red-100 bg-white p-12">
            <h3 className="text-3xl font-extrabold text-zinc-900">
              Nuestra Misión
            </h3>

            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Brindar formación técnica en pastelería y panadería mediante
              programas estructurados, que permitan a los estudiantes adquirir
              competencias prácticas y teóricas.
            </p>
          </div>

          <div className="rounded-3xl bg-red-700 p-12 text-white">
            <h3 className="text-3xl font-extrabold text-white">
              Nuestra Visión
            </h3>

            <p className="mt-6 text-lg leading-8 text-white/90">
              Ser una institución referente en la formación técnica en
              pastelería en Costa Rica, destacando por la calidad académica y el
              impacto profesional de nuestros egresados.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-24">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-red-700">
            Cuerpo docente
          </span>

          <h2 className="mt-4 text-5xl font-extrabold text-zinc-900">
            Chefs que Inspiran
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {chefs.map((chef) => (
            <div
              key={chef.name}
              className="overflow-hidden rounded-3xl bg-zinc-900 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <img
                src={chef.image}
                alt={chef.name}
                className="h-[420px] w-full object-cover opacity-85"
              />

              <div className="space-y-3 p-8 text-white">
                <h3 className="text-3xl font-bold text-white">{chef.name}</h3>

                <p className="text-xs uppercase tracking-[0.3em] text-white">
                  {chef.specialty}
                </p>

                <p className="text-sm leading-7 text-white/80">
                  {chef.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[40px] bg-zinc-900 px-8 py-24 text-center text-white">
          <h2 className="text-5xl font-extrabold leading-tight text-white">
            ¿Quieres elevar tu pasión al siguiente nivel?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Inscripciones abiertas para el ciclo 2026. Cupos limitados para
            garantizar una enseñanza personalizada.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="bg-red-600 px-10 py-7 text-lg hover:bg-red-700"
            >
              <Link to="/register">Inscribirse Ahora</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-white/10 px-10 py-7 text-lg text-white hover:bg-white/20"
            >
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}