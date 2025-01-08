import PollsList from '@/components/pollsUi/PollsList'
import React from 'react'

const page = () => {
  return (
    <div>
      <PollsList filterByCreator={true} />
    </div>
  )
}

export default page