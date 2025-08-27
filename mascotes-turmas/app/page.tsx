import dynamic from 'next/dynamic'
const MascoteTurmas = dynamic(() => import('@/components/MascoteTurmas'), { ssr: false })

export default function Page() {
  return <MascoteTurmas />
}