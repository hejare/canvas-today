import { useRouter } from "next/router";

const ArtPage = () => {
  const router = useRouter();
  const { pid } = router.query;

  return <p>Post: {pid}</p>;
};

export default ArtPage;
