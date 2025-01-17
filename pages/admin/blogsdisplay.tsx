import type { NextPage } from "next";
import Head from "next/head";
import { AuthContextProvider } from "../../context/authContext";
import BlogDisplay from "../../components/Members/Admin/Blogsdisplay";


const Home: NextPage = () => {
  return (
    <AuthContextProvider>
      <Head>
        <title>Zine | Admin</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* <BlogList /> */}
      <BlogDisplay />
    </AuthContextProvider>
  );
};

export default Home;
