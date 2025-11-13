import { Metadata } from 'next';
import PrivacidadeClient from './PrivacidadeClient';

export const metadata: Metadata = {
  title: 'Política de Privacidade - Sorelly Revendedoras',
  description: 'Política de privacidade e proteção de dados do aplicativo Sorelly Joias',
};

export default function PrivacidadePage() {
  return <PrivacidadeClient />;
}

