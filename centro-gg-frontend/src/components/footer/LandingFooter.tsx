import { MapPin } from "lucide-react"

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/SpeUC9WfjuCUsVg2A"

export function LandingFooter() {
  return (
    <>
      <footer id="contacto" className="bg-stone-100 px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-10 text-sm text-zinc-600 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900">Contacto:</h3>
            <p className="mt-4">Correo: centrodecapacitaciongyg@gmail.com</p>
            <p className="mt-2">Teléfono: 2278 - 4657 / 8509-3777</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-zinc-900">
              Nuestra ubicación:
            </h3>

            <p className="mt-4">
              Estamos ubicados en Tres Ríos, Cartago, Costa Rica.
            </p>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
            >
              <MapPin className="h-4 w-4" />
              Ver ubicación
            </a>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-zinc-900">
              ¡Síguenos en nuestras redes!
            </h3>

            <div className="mt-5 flex items-center gap-4">
              <SocialIcon
                href="https://www.instagram.com/centrodecapacitaciongyg/"
                src="/instagram.svg"
                alt="Instagram"
              />

              <SocialIcon
                href="https://www.facebook.com/centrodecapacitaciongyg"
                src="/facebook.svg"
                alt="Facebook"
              />
            </div>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/50685093777"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-3 shadow-2xl transition hover:scale-110"
      >
        <img
          src="/SVG.svg"
          alt="WhatsApp"
          className="h-7 w-7"
        />
      </a>
    </>
  )
}

function SocialIcon({
  href,
  src,
  alt,
}: {
  href: string
  src: string
  alt: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <img src={src} alt={alt} className="h-5 w-5" />
    </a>
  )
}