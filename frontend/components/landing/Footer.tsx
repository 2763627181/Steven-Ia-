import Link from "next/link";
import { Zap, Mail, MapPin } from "lucide-react";

const footerLinks = {
  Plataforma: [
    { label: "FiscalGuard RD", href: "#" },
    { label: "NóminaGuard", href: "#" },
    { label: "LexGuard RD", href: "#" },
    { label: "Executive Brain", href: "#" },
    { label: "DocVault", href: "#" },
  ],
  Empresa: [
    { label: "Nosotros", href: "#" },
    { label: "Precios", href: "#precios" },
    { label: "Blog", href: "#" },
    { label: "Casos de uso", href: "#" },
  ],
  Legal: [
    { label: "Términos de uso", href: "#" },
    { label: "Política de privacidad", href: "#" },
    { label: "Protección de datos", href: "#" },
    { label: "Ley 172-13", href: "#" },
  ],
  Soporte: [
    { label: "Centro de ayuda", href: "#" },
    { label: "Documentación", href: "#" },
    { label: "Contacto", href: "#" },
    { label: "Estado del sistema", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Steven <span className="text-gradient">IA</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-5">
              Inteligencia ejecutiva para empresas dominicanas. Auditoría fiscal,
              nómina y cumplimiento legal con reglas oficiales de RD.
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin size={12} />
                <span>Santo Domingo, República Dominicana</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} />
                <a
                  href="mailto:hola@steven-ia.do"
                  className="hover:text-brand-400 transition-colors"
                >
                  hola@steven-ia.do
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
                {section}
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Steven IA. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-slate-600 text-center">
            Las recomendaciones de esta plataforma son orientativas y no
            reemplazan asesoría legal, contable o fiscal profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}
