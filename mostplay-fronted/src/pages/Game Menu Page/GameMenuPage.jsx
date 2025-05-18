import { useParams } from 'react-router-dom'

export default function GameMenuPage() {
  const { menuId } = useParams()

  return (
    <div>GameMenuPage {menuId}</div>
  )
}

