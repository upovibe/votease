import dynamic from 'next/dynamic'

const PollsList = dynamic(() => import('@/components/pollsUi/PollsList'), {
  ssr: false, // Disable SSR for this component
})

const page = () => {
  return (
    <div>
      <PollsList filterByCreator />
    </div>
  )
}

export default page
