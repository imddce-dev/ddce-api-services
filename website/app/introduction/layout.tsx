
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'DDCE API Request'
};

export default function IntroductionLayout({children}: Readonly<{ children: React.ReactNode }>){
    return(
    <>
    {children}
    </>
    )
}