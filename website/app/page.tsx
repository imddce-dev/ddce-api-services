import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'DDCE API Request'
};
import Introduction from './introduction/page'
export default function Home() {
  return (
    <Introduction />
  );
}
