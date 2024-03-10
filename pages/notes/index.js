import dynamic from "next/dynamic"
import Link from "next/link"
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Heading,
  Text,
  Button,
  Spinner,
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton,
  Input,
  Textarea
} from '@chakra-ui/react'
import { useEffect,useState } from "react"
import { useRouter } from "next/router"
import { useQueries } from "@/hooks/useQueries"
import fetcher from "@/utils/fetcher"
import useSWR from "swr"
import { useMutation } from "@/hooks/useMutation"

const LayoutComponent = dynamic(() => import("@/layout"))

export default function Notes() {
  const router = useRouter();
  const { mutate } =  useMutation()


  //fetching list notes//

  // const { data, isLoading } = useQueries({ prefixUrl: 'https://paace-f178cafcae7b.nevacloud.io/api/notes' });  
  const {data, error, isLoading} = useSWR("/api/listNotes",fetcher, {refreshInterval: 5})

  //fetching list notes//

  //add notes//
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notes, setNotes] = useState({
    title: '',
    description: ''
  });

  const HandleOpenModal = () => {
    setIsAddModalOpen(true);
  };

  const HandleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const HandleInputChange = (event) => {
    const { name, value } = event.target;
    setNotes(prevNotes => ({
      ...prevNotes,
      [name]: value
    }));
  };

  const HandleSubmit = async () => {
    const response = await mutate({
      url: "/api/addNotes",
      method: "POST",
      payload: notes,
    });

    if (response?.success) {
      // router.push('/notes');
      setIsAddModalOpen(false)
    }
  };

  //add notes//


  //delete notes//

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  const HandleDelete = async (id) => {
    try {
      const response = await fetch(`/api/deleteNotes?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result?.success) {
        // router.reload();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

   const HandleDeleteConfirmation = (id) => {
    HandleDelete(id);
    setIsDeleteModalOpen(false);
  };

  //delete notes//

  //edit notes//

  const { id } = router?.query;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemtoEditId, setItemToEditId] = useState(null);
  const [editedNotes, setEditedNotes] = useState({ title: '', description: '' });
  const { data: noteData, error: noteError } = useSWR(itemtoEditId ? `https://paace-f178cafcae7b.nevacloud.io/api/notes/${itemtoEditId}` : null, fetcher);

useEffect(() => {
  if (noteData) {
    console.log("Note Data:", noteData);
    setEditedNotes({
      title: noteData.title || '',
      description: noteData.description || ''
    });
  }
}, [noteData]);

  const HandleEditSubmit = async () => {
    try {
      const response = await fetch(
        `/api/editNotes?id=${itemtoEditId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editedNotes.title,
            description: editedNotes.description,
          }),
        }
      );
      const result = await response.json();
      if (result?.success) {
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error occurred during edit submission: ", error);
    }
  };

  //edit notes//
  

  


 return (
  <>
    <LayoutComponent metaTitle="Notes" metaDescription="Ini adalah halaman Notes">
      <Box padding="5">
        <Flex justifyContent="end">
          {/* <Button colorScheme="blue" onClick={() => router.push('/notes/add')}>Add Button</Button> */}
          <Button colorScheme="blue" onClick={HandleOpenModal}>Add Notes</Button>
        </Flex>
        {
          isLoading ? (
            <Flex align="center" justify="center">
            <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
            />
          </Flex>
          ) : (
            <Flex>
            <Grid templateColumns='repeat(3,1fr)' gap={5}>
              {
                data?.data?.map((item) => (
                  <GridItem>
                    <Card>
                      <CardHeader>
                        <Heading>{item?.title}</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text>{item?.description}</Text>
                      </CardBody>
                      <CardFooter justify="space-between" flexWrap="wrap">
                         {/* <Button onClick={() => router.push(`/notes/edit/${item?.id}`)} flex="1" variant="ghost">
                          Edit
                         </Button> */}
                          <Button onClick={() => {
                            console.log("Item ID:", item?.id);
                            setItemToEditId(item?.id);
                            setIsEditModalOpen(true);
                          }} flex="1" variant="ghost">Edit</Button>
                         <Button onClick={() => {
                            setItemToDeleteId(item?.id); 
                            setIsDeleteModalOpen(true);
                          }} flex="1" colorScheme="red">
                            Delete
                          </Button>
                        </CardFooter>
                    </Card>
                  </GridItem>
                ))
              }
            </Grid>
            {/* modal add */}
            <Modal isOpen={isAddModalOpen} onClose={HandleCloseModal}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add Notes</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Grid gap="5">
                    <GridItem>
                      <Text>Title</Text>
                      <Input name="title" value={notes.title} onChange={HandleInputChange} type="text"/>
                    </GridItem>
                    <GridItem>
                      <Text>Description</Text>
                      <Textarea name="description" value={notes.description} onChange={HandleInputChange} />
                    </GridItem>
                  </Grid>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={HandleSubmit}>Submit</Button>
                  <Button onClick={HandleCloseModal}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            {/* modal delete */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Confirm Deletion</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  Apakah yakin ingin menghapus note ini ?
                </ModalBody>
                <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={() => HandleDeleteConfirmation(itemToDeleteId)}>
                    Delete
                  </Button>
                  <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Notes</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>Title</Text>
                  <Input 
                    value={editedNotes.title} 
                    onChange={(event) => setEditedNotes({...editedNotes, title: event.target.value})}
                    type="text"
                  />
                  <Text mt={2}>Description</Text>
                  <Textarea 
                    value={editedNotes.description} 
                    onChange={(event) => setEditedNotes({...editedNotes, description: event.target.value})}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={HandleEditSubmit}>Submit</Button>
                  <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
          )
        }
    </Box>
    </LayoutComponent> 
  </>
 )
}

export async function getStaticProps() {
  const res = await fetch("https://paace-f178cafcae7b.nevacloud.io/api/notes")
  const notes = await res.json()
  return { props: { notes }, revalidate:10 }
}