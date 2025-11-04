export type UserClientProps = {
  params: Promise<{
    user: string;
    client: string;
  }>;
};

// Devmaster request types
export interface DevmasterRequest {
  user_id: string;
}

// Product types
export type ProductVariation = {
  produto: string;
  descricao: string;
  tamanho?: string;
  mais_vendido: string;
  quantidade_vendas: number;
  referencia: string;
  estoque: number;
  valor: number;
  disponivel: boolean;
  imagem: string[];
};

export type Product = {
  produto: string;
  descricao: string;
  categoria: string;
  quantidade_vendas: number;
  material: string;
  variacoes: ProductVariation[];
  estoque: number;
  disponivel: boolean;
};

// User types
export type User = {
  id: string;
  tipo_pessoa: string;
  cpfcnpj: string;
  nome: string;
  nome_fantasia: string;
  endereco: string;
  numero_end: string;
  complemento: string;
  bairro: string;
  cod_municipio: string;
  municipio: string;
  celular: string;
  email: string;
  id_vendedor: string;
  vendedor: string;
  uf: string;
};