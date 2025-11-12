'use client';

import { useState } from 'react';

type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function SuporteClient() {
  const [openSection, setOpenSection] = useState<string | null>('acesso');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections: AccordionItem[] = [
    {
      id: 'acesso',
      title: 'Acesso ao Aplicativo',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">Para acessar o aplicativo:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 font-light">
            <li>Use o e-mail cadastrado junto à Sorelly Joias</li>
            <li>Você receberá um link ou código de verificação por e-mail</li>
            <li>Após confirmar o e-mail, sua conta será liberada apenas se você for uma revendedora ativa</li>
          </ul>
          
          <div className="bg-[#FFF3D3] border-l-4 border-[#B28A24] p-4 mt-4">
            <h4 className="font-normal text-black mb-2">Caso não consiga acessar:</h4>
            <ul className="list-disc list-inside space-y-1 text-[#694A00] text-sm ml-2 font-light">
              <li>Verifique se o e-mail utilizado é o mesmo cadastrado com a Sorelly</li>
              <li>Confirme se sua conta está ativa</li>
              <li>Reenvie o código de verificação</li>
              <li>Se o problema persistir, entre em contato com o suporte pelo e-mail <a href="mailto:adm@hnoapps.com" className="underline hover:text-[#B28A24]">adm@hnoapps.com</a></li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'produtos',
      title: 'Produtos do Kit',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">Ao acessar o aplicativo, você verá todos os produtos que compõem o seu kit de revenda.</p>
          <p className="text-gray-600 font-normal">Você pode:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 font-light">
            <li>Visualizar e filtrar os produtos por categoria, tipo ou disponibilidade</li>
            <li>Favoritar joias para fácil acesso posterior</li>
            <li>Acessar a tela de detalhes do produto para ver informações completas sobre cada peça</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'compartilhamento',
      title: 'Compartilhamento de Produtos',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">Você pode compartilhar qualquer produto diretamente com suas clientes através de links ou redes sociais.</p>
          <div className="bg-[#FFF3D3] border-l-4 border-[#B28A24] p-4">
            <p className="text-black font-light">
              Cada produto compartilhado leva suas informações como revendedora, garantindo que a cliente saiba que está comprando de você.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'catalogo',
      title: 'Catálogo Digital',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">O catálogo digital é o seu e-commerce personalizado, onde suas clientes podem:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 font-light">
            <li>Acessar as joias disponíveis</li>
            <li>Selecionar os produtos que desejam</li>
            <li>Finalizar o pedido e enviar para o seu aplicativo</li>
          </ul>
          
          <div className="bg-[#FFF3D3] border-l-4 border-[#B28A24] p-4 mt-4">
            <h4 className="font-normal text-black mb-2">Importante:</h4>
            <ul className="list-disc list-inside space-y-1 text-[#694A00] text-sm ml-2 font-light">
              <li>O catálogo digital não possui pagamento online</li>
              <li>Os pedidos feitos por suas clientes aparecem no seu aplicativo apenas para controle e acompanhamento das vendas</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'clientes',
      title: 'Gestão de Clientes',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">Dentro do app, você pode cadastrar e gerenciar sua lista de clientes.</p>
          <p className="text-gray-600 font-normal">Funcionalidades:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 font-light">
            <li>Adicionar novas clientes</li>
            <li>Editar ou excluir informações</li>
            <li>Compartilhar o catálogo digital diretamente com uma cliente específica</li>
            <li>Acompanhar o histórico de pedidos de cada cliente</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'pedidos',
      title: 'Pedidos e Vendas',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">No aplicativo, você pode:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 font-light">
            <li>Receber pedidos feitos pelas suas clientes pelo catálogo digital</li>
            <li>Criar pedidos manuais, adicionando produtos e associando a uma cliente</li>
            <li>Visualizar o histórico de vendas, com todos os pedidos realizados</li>
            <li>Cancelar vendas, se necessário</li>
            <li>Acompanhar o valor total vendido e o desempenho das suas revendas</li>
          </ul>
          
          <p className="text-gray-500 italic text-sm mt-4 font-light">
            Essas informações servem apenas para controle interno, facilitando seu acompanhamento de estoque e resultados.
          </p>
        </div>
      ),
    },
    {
      id: 'favoritos',
      title: 'Favoritos e Controle do Kit',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">Você pode favoritar produtos do seu kit para marcar aqueles que deseja destacar ou controlar de perto.</p>
          <p className="text-gray-500 font-light">
            Essa função ajuda a organizar o estoque e priorizar as peças mais procuradas.
          </p>
        </div>
      ),
    },
    {
      id: 'historico',
      title: 'Histórico e Relatórios',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 font-light">
            O aplicativo mostra o histórico completo das vendas e o saldo total das suas revendas, ajudando você a entender seu desempenho e planejar novas estratégias de venda.
          </p>
        </div>
      ),
    },
  ];

  const faqItems = [
    {
      question: 'Não consigo acessar minha conta.',
      answer: 'Verifique se o e-mail está correto e se você é uma revendedora ativa. Caso continue com problemas, entre em contato com o suporte.',
    },
    {
      question: 'Meus produtos não aparecem no app.',
      answer: 'Certifique-se de que seu kit foi ativado pela equipe Sorelly. Após a confirmação, os produtos serão exibidos automaticamente.',
    },
    {
      question: 'O pedido da cliente não apareceu.',
      answer: 'Peça para a cliente confirmar se finalizou o pedido no catálogo digital. Os pedidos só aparecem após a finalização.',
    },
    {
      question: 'Posso vender produtos fora do app?',
      answer: 'Sim. O aplicativo serve para controle e apoio nas vendas, mas você pode vender diretamente também.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white border-b border-[#B28A24]/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-light tracking-wider mb-2">Central de Suporte</h1>
            <p className="text-base text-gray-400 font-light">Sorelly Revendedoras</p>
          </div>
        </div>
      </header>

      {/* Intro */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg p-8 border border-[#d5d5d5]">
          <h2 className="text-xl font-normal text-black mb-4">
            Bem-vinda ao Suporte da Sorelly Joias
          </h2>
          <p className="text-gray-600 leading-relaxed font-light">
            Aqui você encontra todas as informações necessárias para usar o aplicativo da Sorelly de forma simples e prática.
            Nosso objetivo é facilitar o seu trabalho como revendedora e garantir que você tenha total controle sobre seu kit, suas vendas e suas clientes.
          </p>
        </div>
      </section>

      {/* Main Content - Accordion Sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg p-8 border border-[#d5d5d5]">
          <h2 className="text-xl font-normal text-black mb-6">
            Dúvidas Frequentes
          </h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-[#d5d5d5] last:border-0 pb-6 last:pb-0">
                <h4 className="font-normal text-black mb-2 flex items-start">
                  <span className="text-[#B28A24] mr-2">{index + 1}.</span>
                  {item.question}
                </h4>
                <p className="text-gray-500 ml-6 font-light">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-black rounded-lg p-8 text-white border border-[#B28A24]/20">
          <h2 className="text-xl font-normal mb-6">Contato com o Suporte</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-normal">E-mail:</p>
                <a href="mailto:adm@hnoapps.com" className="hover:underline text-gray-400 font-light">
                  adm@hnoapps.com
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-normal">Horário de atendimento:</p>
                <p className="text-gray-400 font-light">Segunda a sexta, das 9h às 18h (horário de Brasília)</p>
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

