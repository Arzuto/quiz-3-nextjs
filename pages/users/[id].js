import Layout from "@/layout";
import { useRouter } from "next/router";

export default function UsersByName() {
  const router = useRouter()
  const { id } = router?.query

  return(
  <Layout>
    <p>Users By Name {id}</p>
  </Layout>
  )
}