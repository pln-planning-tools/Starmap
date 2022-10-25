import RoadmapHeader from '../roadmap/RoadmapHeader';

export default function Header({ issueData }) {
  return (
    // <Text mb='8px' fontSize={40} fontWeight={600}>
    // {
    //   /* <NextLink href={issueData.html_url} passHref>
    //     <Link color='blue.500'>{issueData?.title}</Link>
    //   </NextLink> */
    // }
    // {issueData.title}
    // </Text>
    <RoadmapHeader issueData={issueData} />
  );
}
