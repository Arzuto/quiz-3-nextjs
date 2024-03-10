import dynamic from "next/dynamic"

const LayoutComponent = dynamic(() => import("@/layout"))

export default function Posts({posts}) {

  console.log("Data Posts =>",posts)

 return (
  <>
    <LayoutComponent metaTitle="Posts" metaDescription="Ini adalah halaman Posts">{
      posts.map((item) => (
        <div>
          <p>{item.id}.<b>{item.title}</b></p>
          <p>{item.body}</p>
        </div>
      ))
    }</LayoutComponent> 
  </>
 );
}

export async function getServerSideProps() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts = await res.json()
  return { props: { posts } }
}