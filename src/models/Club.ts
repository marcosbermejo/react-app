import Delegation from "./Delegation"

export default interface Club {
  id: string
  name: string,
  image: string,
  delegation?: Delegation,
  phone?: string,
  email?: string,
  address?: string,
  postalCode?: string,
  city?: string,
  province?: string,
  president?: string,
}