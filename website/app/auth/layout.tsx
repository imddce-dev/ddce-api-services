import EKGs from "@/components/Ekg/Ekg";
export default function AuthLayout({children,}: Readonly<{children: React.ReactNode;}>) 
{
  return (
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] w-screen"> 
            <EKGs className="h-auto" /> 
          </div>
          <div className='container mx-auto'>
            <div className='min-h-screen overflow-hidden'>
                <div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 rounded-lg shadow-lg'>
                    {children}
                </div>
            </div>
          </div>
        </div>
  );
}