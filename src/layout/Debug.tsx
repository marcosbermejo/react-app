export default function Debug ({data}: { data: Object }) {
  return <div><pre>{JSON.stringify(data, null, 2) }</pre></div>
}