import type { NextPage } from "next";
import Head from "next/head";
import { Footer, SecFooter } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import BlogDetail from "../../components/Members/Admin/Blogdetail";
import UserBlogDetail from "../../components/Members/Admin/UserBlogdetail";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Zine | Blogs</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <UserBlogDetail/>
      <SecFooter />
    </>
  );
};

export default Home;