'use client';

import { 
  Smartphone, 
  Package, 
  Globe, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Heart,
  Share2,
  CheckCircle2,
  Sparkles,
  Award,
  Download
} from 'lucide-react';
import Image from 'next/image';

export default function AppInfoClient() {
  const features = [
    {
      icon: Package,
      title: 'Controle total do seu kit',
      description: 'Acompanhe em tempo real todas as joias do seu kit. Visualize, filtre, organize e gerencie suas peças com praticidade. Cada produto está identificado e detalhado, facilitando o controle e a reposição das joias mais vendidas.'
    },
    {
      icon: Globe,
      title: 'Seu catálogo digital personalizado',
      description: 'Com apenas alguns toques, você cria seu catálogo digital exclusivo — um espaço online que funciona como o seu próprio e-commerce da Sorelly. Compartilhe o link com suas clientes e permita que elas explorem todas as suas joias, escolham suas favoritas e enviem pedidos diretamente para o seu aplicativo.'
    },
    {
      icon: Users,
      title: 'Gestão fácil das suas clientes',
      description: 'Organize sua carteira de clientes diretamente no app. Cadastre, edite e acompanhe cada cliente com histórico de pedidos e preferências. Com poucos cliques, envie seu catálogo personalizado para cada uma delas.'
    },
    {
      icon: ShoppingBag,
      title: 'Pedidos simplificados',
      description: 'Receba pedidos vindos do seu catálogo digital ou crie pedidos manualmente. O aplicativo soma automaticamente os valores, organiza o histórico de vendas e facilita o controle das peças vendidas — tudo de forma prática e profissional.'
    }
  ];

  const benefits = [
    { icon: Package, text: 'Controle de produtos do kit' },
    { icon: Users, text: 'Gestão de clientes' },
    { icon: TrendingUp, text: 'Histórico de vendas' },
    { icon: Heart, text: 'Favoritos e relatórios' },
    { icon: ShoppingBag, text: 'Criação de pedidos manuais' },
    { icon: Share2, text: 'Compartilhamento rápido de produtos' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <Image src="/logo.svg" alt="Sorelly Joias" width={0} height={0} sizes='100vw' className='w-72 h-auto' />
            </div>
            <div className="max-w-3xl mx-auto pt-4">
              <p className="text-xl text-gray-400 font-light leading-relaxed">
                Transforme sua revenda em uma experiência profissional
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            O aplicativo da Sorelly Joias foi desenvolvido exclusivamente para nossas revendedoras, com o objetivo de facilitar a gestão do seu kit, impulsionar suas vendas e fortalecer o relacionamento com suas clientes.
          </p>
          <p className="text-lg text-gray-600 font-light leading-relaxed mt-4">
            Tudo em um só lugar, de forma simples, rápida e intuitiva.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white border border-[#d5d5d5] rounded-lg p-8 hover:border-[#B28A24]/50 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FFF3D3] mb-6">
                <feature.icon className="w-7 h-7 text-[#B28A24]" />
              </div>
              <h3 className="text-xl font-normal text-black mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="bg-[#fdfdfd] py-16 sm:py-20 border-y border-[#d5d5d5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-black mb-4 tracking-wide">
              Mais produtividade, menos burocracia
            </h2>
            <p className="text-gray-600 font-light max-w-3xl mx-auto">
              O app da Sorelly foi pensado para economizar o seu tempo e centralizar tudo o que importa
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white border border-[#d5d5d5] rounded-lg p-6 flex items-start gap-4 hover:border-[#B28A24]/50 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#FFF3D3] flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-[#B28A24]" />
                  </div>
                </div>
                <div>
                  <p className="text-black font-light">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-500 font-light italic">
              Tudo com uma navegação leve e intuitiva.
            </p>
          </div>
        </div>
      </section>

      {/* Confidence Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="bg-black text-white rounded-lg p-10 sm:p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B28A24]/20 mb-6">
            <Award className="w-8 h-8 text-[#B28A24]" />
          </div>
          <h2 className="text-3xl font-light mb-6 tracking-wide">
            Venda com confiança e destaque
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-gray-400 font-light leading-relaxed">
              Cada produto compartilhado leva o seu nome como revendedora Sorelly, fortalecendo sua marca pessoal e garantindo reconhecimento junto às suas clientes.
            </p>
            <p className="text-gray-400 font-light leading-relaxed">
              Com o catálogo digital, você oferece uma experiência de compra moderna e elegante, alinhada com a sofisticação das joias Sorelly.
            </p>
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section className="bg-[#FFF3D3] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6">
            <Sparkles className="w-8 h-8 text-[#B28A24]" />
          </div>
          <h2 className="text-3xl font-light text-black mb-6 tracking-wide">
            Sorelly Joias – Mais que revenda, um estilo de vida
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-[#694A00] font-light leading-relaxed text-lg">
              Com o aplicativo Sorelly, você tem o poder de transformar sua rotina de vendas.
            </p>
            <p className="text-[#694A00] font-light leading-relaxed text-lg">
              Mais organização, mais agilidade e mais oportunidades para crescer no mundo das joias.
            </p>
          </div>
          <div className="mt-10 space-y-2">
            <p className="text-black font-normal text-xl tracking-wide">
              Seja uma revendedora conectada.
            </p>
            <p className="text-black font-normal text-xl tracking-wide">
              Seja uma revendedora Sorelly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="bg-white border border-[#d5d5d5] rounded-lg p-10 sm:p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFF3D3] mb-6">
            <Download className="w-8 h-8 text-[#B28A24]" />
          </div>
          <h2 className="text-3xl font-light text-black mb-4 tracking-wide">
            Baixe o app e comece agora
          </h2>
          <p className="text-gray-600 font-light mb-8 max-w-2xl mx-auto">
            Disponível para Android e iOS. Acesse o app, confirme seu e-mail e descubra uma nova forma de vender com elegância e praticidade.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-900 transition-colors font-light tracking-wide"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              App Store
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-900 transition-colors font-light tracking-wide"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-8 border-t border-[#B28A24]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-light">
            © {new Date().getFullYear()} Sorelly Joias. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

