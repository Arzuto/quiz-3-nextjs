import dynamic from "next/dynamic"

const LayoutComponent = dynamic(() => import("@/layout"))

export default function DetailNotes({notes}){

  console.log("data detail notes => ",notes)
  return(
    <LayoutComponent metaTitle="Detail Notes" metaDescription="Ini halaman detail notes">
      <div>
        <p>Title : {notes.data.title}</p>
        <p>Description : {notes.data.description}</p>
        <p>Update At : {notes.data.updated_at}</p>
      </div>
    </LayoutComponent>
  )
}

export async function getStaticPaths() {
  const res = await fetch("https://paace-f178cafcae7b.nevacloud.io/api/notes")
  const notes = await res.json()

  const paths = notes.data.map((item) => ({
    params: {
      id: item.id
    }
  }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { id } = context.params
  const res = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/notes/${id}`)
  const notes = await res.json()
  return { props: { notes }, revalidate:10 }
}