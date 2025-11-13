'use client';

import { useState } from 'react';
import { Shield, Lock, Eye, UserCheck, Database, FileText, Mail, AlertCircle } from 'lucide-react';

type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function PrivacidadeClient() {
  const [openSection, setOpenSection] = useState<string | null>('coleta');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const principles = [
    {
      icon: Shield,
      title: 'Proteção de dados',
      description: 'Seus dados pessoais são protegidos com tecnologia de segurança avançada e criptografia.'
    },
    {
      icon: Lock,
      title: 'Privacidade garantida',
      description: 'Não compartilhamos suas informações com terceiros sem seu consentimento explícito.'
    },
    {
      icon: Eye,
      title: 'Transparência',
      description: 'Você tem total visibilidade sobre quais dados coletamos e como os utilizamos.'
    },
    {
      icon: UserCheck,
      title: 'Controle total',
      description: 'Você pode acessar, corrigir ou solicitar a exclusão de seus dados a qualquer momento.'
    }
  ];

  const sections: AccordionItem[] = [
    {
      id: 'coleta',
      title: 'Quais dados coletamos',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">Para oferecer o melhor serviço possível, coletamos os seguintes tipos de informação:</p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-normal text-black mb-2">Dados de cadastro:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-500 ml-4 font-light">
                <li>Nome completo</li>
                <li>E-mail</li>
                <li>Informações de revendedora (vínculo com Sorelly Joias)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-normal text-black mb-2">Dados de uso do aplicativo:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-500 ml-4 font-light">
                <li>Produtos do kit consultados e favoritos</li>
                <li>Clientes cadastradas</li>
                <li>Histórico de pedidos e vendas</li>
                <li>Interações com o catálogo digital</li>
              </ul>
            </div>

            <div>
              <h4 className="font-normal text-black mb-2">Dados técnicos:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-500 ml-4 font-light">
                <li>Endereço IP</li>
                <li>Tipo de dispositivo e sistema operacional</li>
                <li>Informações de navegação e uso do app</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'uso',
      title: 'Como usamos seus dados',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">As informações coletadas são utilizadas exclusivamente para:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 font-light">
            <li>Autenticar e dar acesso à sua conta de revendedora</li>
            <li>Gerenciar seu kit de produtos e controle de estoque</li>
            <li>Processar e organizar pedidos realizados por suas clientes</li>
            <li>Enviar notificações importantes sobre vendas, produtos e atualizações do app</li>
            <li>Melhorar continuamente a experiência de uso do aplicativo</li>
            <li>Gerar relatórios de vendas e desempenho para você</li>
            <li>Oferecer suporte técnico quando necessário</li>
          </ul>

          <div className="bg-[#FFF3D3] border-l-4 border-[#B28A24] p-4 mt-4">
            <p className="text-black font-light">
              <strong>Importante:</strong> Não vendemos, alugamos ou compartilhamos seus dados pessoais com empresas terceiras para fins de marketing.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'compartilhamento',
      title: 'Compartilhamento de dados',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">Seus dados podem ser compartilhados apenas nas seguintes situações:</p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-normal text-black mb-2">Com a Sorelly Joias:</h4>
              <p className="text-gray-500 ml-4 font-light">
                Como revendedora, suas informações de vendas e kit são compartilhadas com a Sorelly para controle de estoque e gestão comercial.
              </p>
            </div>

            <div>
              <h4 className="font-normal text-black mb-2">Prestadores de serviço:</h4>
              <p className="text-gray-500 ml-4 font-light">
                Utilizamos serviços terceiros confiáveis para hospedagem, análise de dados e envio de e-mails, sempre sob contratos de confidencialidade.
              </p>
            </div>

            <div>
              <h4 className="font-normal text-black mb-2">Exigências legais:</h4>
              <p className="text-gray-500 ml-4 font-light">
                Podemos divulgar informações quando exigido por lei ou para proteger nossos direitos e segurança.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'seguranca',
      title: 'Segurança dos dados',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">Levamos a segurança dos seus dados muito a sério. Implementamos medidas técnicas e organizacionais para proteger suas informações:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 font-light">
            <li>Criptografia de dados em trânsito e em repouso</li>
            <li>Acesso restrito às informações apenas para pessoas autorizadas</li>
            <li>Monitoramento contínuo de segurança</li>
            <li>Backups regulares para prevenir perda de dados</li>
            <li>Protocolos de autenticação seguros (verificação por e-mail)</li>
          </ul>

          <div className="bg-[#FFF3D3] border-l-4 border-[#B28A24] p-4 mt-4">
            <p className="text-black font-light">
              Embora façamos o máximo para proteger seus dados, nenhum sistema é 100% seguro. Recomendamos que você também tome precauções, como não compartilhar suas credenciais de acesso.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'direitos',
      title: 'Seus direitos',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 font-light">
            <li><strong>Acesso:</strong> Solicitar uma cópia dos dados que temos sobre você</li>
            <li><strong>Correção:</strong> Pedir a atualização ou correção de informações incorretas</li>
            <li><strong>Exclusão:</strong> Solicitar a remoção dos seus dados pessoais</li>
            <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
            <li><strong>Oposição:</strong> Se opor ao processamento de seus dados em determinadas situações</li>
            <li><strong>Revogação de consentimento:</strong> Retirar seu consentimento a qualquer momento</li>
          </ul>

          <div className="bg-white border border-[#d5d5d5] rounded-lg p-4 mt-4">
            <p className="text-gray-600 font-light">
              Para exercer qualquer um desses direitos, entre em contato conosco pelo e-mail: <a href="mailto:adm@hnoapps.com" className="underline hover:text-[#B28A24] text-black font-normal">adm@hnoapps.com</a>
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'cookies',
      title: 'Cookies e tecnologias similares',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">O aplicativo pode utilizar cookies e tecnologias similares para:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 font-light">
            <li>Manter você conectado à sua conta</li>
            <li>Lembrar suas preferências e configurações</li>
            <li>Analisar o uso do aplicativo e melhorar a experiência</li>
            <li>Garantir a segurança das suas sessões</li>
          </ul>
          <p className="text-gray-500 font-light mt-4">
            Você pode gerenciar ou desativar cookies nas configurações do seu dispositivo, mas isso pode afetar algumas funcionalidades do app.
          </p>
        </div>
      ),
    },
    {
      id: 'retencao',
      title: 'Retenção de dados',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">Mantemos seus dados pelo tempo necessário para:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 font-light">
            <li>Fornecer os serviços do aplicativo</li>
            <li>Cumprir obrigações legais e contratuais</li>
            <li>Resolver disputas e fazer valer nossos acordos</li>
          </ul>
          <p className="text-gray-500 font-light mt-4">
            Quando você solicitar a exclusão da sua conta, removeremos seus dados pessoais, exceto aqueles que devemos manter por obrigação legal.
          </p>
        </div>
      ),
    },
    {
      id: 'menores',
      title: 'Menores de idade',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">
            O aplicativo Sorelly Revendedoras é destinado exclusivamente a pessoas maiores de 18 anos. Não coletamos intencionalmente informações de menores de idade.
          </p>
          <p className="text-gray-500 font-light">
            Se tomarmos conhecimento de que coletamos dados de um menor sem permissão dos pais ou responsáveis, tomaremos medidas para remover essas informações.
          </p>
        </div>
      ),
    },
    {
      id: 'alteracoes',
      title: 'Alterações nesta política',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">
            Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou na legislação.
          </p>
          <p className="text-gray-500 font-light">
            Quando fizermos alterações significativas, notificaremos você por e-mail ou através de um aviso no aplicativo. Recomendamos que você revise esta política regularmente.
          </p>
          <div className="bg-[#FFF3D3] border-l-4 border-[#B28A24] p-4 mt-4">
            <p className="text-black font-light">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white border-b border-[#B28A24]/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B28A24]/20 mb-4">
              <Shield className="w-8 h-8 text-[#B28A24]" />
            </div>
            <h1 className="text-3xl font-light tracking-wider mb-2">Política de Privacidade</h1>
            <p className="text-base text-gray-400 font-light">Sorelly Revendedoras</p>
          </div>
        </div>
      </header>

      {/* Intro */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg p-8 border border-[#d5d5d5]">
          <h2 className="text-xl font-normal text-black mb-4">
            Seu direito à privacidade
          </h2>
          <p className="text-gray-600 leading-relaxed font-light mb-4">
            A Sorelly Joias valoriza e respeita a privacidade de todas as suas revendedoras. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais ao utilizar o aplicativo Sorelly Revendedoras.
          </p>
          <p className="text-gray-600 leading-relaxed font-light">
            Ao usar nosso aplicativo, você concorda com as práticas descritas nesta política. Leia atentamente para entender como seus dados são tratados.
          </p>
        </div>
      </section>

      {/* Principles Grid */}
      <section className="bg-[#fdfdfd] py-12 border-y border-[#d5d5d5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-light text-black mb-3 tracking-wide">
              Nossos princípios de privacidade
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <div 
                key={index}
                className="bg-white border border-[#d5d5d5] rounded-lg p-6 flex items-start gap-4 hover:border-[#B28A24]/50 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#FFF3D3] flex items-center justify-center">
                    <principle.icon className="w-6 h-6 text-[#B28A24]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-normal text-black mb-2">{principle.title}</h3>
                  <p className="text-gray-500 font-light text-sm">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Accordion Sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg border border-[#d5d5d5] overflow-hidden transition-all duration-300 hover:border-[#B28A24]/50"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-base font-normal text-black">
                  {section.title}
                </h3>
                <svg
                  className={`w-5 h-5 text-[#B28A24] transform transition-transform duration-300 ${
                    openSection === section.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openSection === section.id
                    ? 'max-h-[2000px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
                style={{ overflow: 'hidden' }}
              >
                <div className="px-6 pb-4 border-t border-[#d5d5d5]">
                  <div className="pt-4">{section.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-black rounded-lg p-8 text-white border border-[#B28A24]/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#B28A24]/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#B28A24]" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-normal mb-2">Dúvidas sobre privacidade?</h2>
              <p className="text-gray-400 font-light">
                Se você tiver alguma dúvida sobre esta Política de Privacidade ou sobre como tratamos seus dados, entre em contato conosco.
              </p>
            </div>
          </div>
          
          <div className="space-y-4 ml-16">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-normal">E-mail para questões de privacidade:</p>
                <a href="mailto:adm@hnoapps.com" className="hover:underline text-gray-400 font-light">
                  adm@hnoapps.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-8 border-t border-[#B28A24]/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-light">
            © {new Date().getFullYear()} Sorelly Joias. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

