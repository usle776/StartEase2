import jobs from '../lib/jobs.json'
import JobBoard from '../components/JobBoard'

export default function Home() {
  const allTypes = [...new Set(jobs.map(j => j.type).filter(Boolean))].sort()
  return <JobBoard jobs={jobs} allTypes={allTypes} />
}
