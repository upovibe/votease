import PollsList from '@/components/pollsUi/PollsList'

const page = () => {
  return (
    <div>
      <PollsList filterByCreator/>
    </div>
  )
}

export default page