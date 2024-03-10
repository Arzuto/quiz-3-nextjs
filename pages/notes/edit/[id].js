import dynamic from "next/dynamic"
import {
  Grid,
  GridItem,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Textarea
} from '@chakra-ui/react'
import { useState, useEffect } from "react"
import { useRouter } from "next/router"

const LayoutComponent = dynamic(() => import("@/layout"))

export default function EditNotes() {
  const router = useRouter();
  const { id } = router?.query
  const [notes,setNotes] = useState()  

  useEffect(() => {
    async function fetchingData(){
      const res = await fetch(`https:paace-f178cafcae7b.nevacloud.io/api/notes/${id}`)
      const listNotes = await res.json()
      setNotes(listNotes?.data)
      console.log("list notes => ", listNotes?.data)

    }
    fetchingData()
  },[id])

  const HandleSubmit = async () => {
    try {
     const response = await fetch(
      `https://paace-f178cafcae7b.nevacloud.io/api/notes/update/${id}`,
      {
       method: "PATCH",
       headers: {
        "Content-Type": "application/json",
       },
       body: JSON.stringify({
        title: notes?.title,
        description: notes?.description,
       }),
      }
     )
     const result = await response.json()
     if(result?.success){
      router.push('/notes')
     }
    } catch (error) {

    }
   }

 return (
  <>
    <LayoutComponent metaTitle="Notes" metaDescription="Ini adalah halaman Tambah Notes">
      <Card margin="5" padding="5">
        <Grid gap="5">
          <Heading>Add Notes</Heading>
          <GridItem>
            <Text>Title</Text>
            <Input 
            value={notes?.title || ''}
            onChange={(event) => setNotes({...notes,title: event.target.value})} 
            type="text"
            />
          </GridItem>
          <GridItem>
            <Text>Description</Text>
            <Textarea 
            onChange={(event) => setNotes({...notes,description: event.target.value})} 
            value={notes?.description}
            />
          </GridItem>
          <GridItem>
            <Button colorScheme="blue" onClick={() => HandleSubmit()}>Submit</Button>
          </GridItem>
        </Grid>
      </Card>
    </LayoutComponent> 
  </>
 )
}

// export async function getStaticProps() {
//   const res = await fetch("https://paace-f178cafcae7b.nevacloud.io/api/notes")
//   const notes = await res.json()
//   return { props: { notes }, revalidate:10 }
// }