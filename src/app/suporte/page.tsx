import { Metadata } from 'next';
import SuporteClient from './SuporteClient';

export const metadata: Metadata = {
  title: 'Suporte - Sorelly Revendedoras',
  description: 'Central de ajuda e suporte para revendedoras Sorelly Joias',
};

export default function SuportePage() {
  return <SuporteClient />;
}

