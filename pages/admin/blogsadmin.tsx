import type { NextPage } from "next";
import Head from "next/head";
import CreateNewBlog from "../../components/Members/Admin/createblog";
import { AuthContextProvider } from "../../context/authContext";
import { SecFooter } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import BlogAdmin from "../../components/Members/Admin/BlogAdmin";


const Home: NextPage = () => {
    return (
        <AuthContextProvider>
            <Head>
                <title>Zine | Admin</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
             
            <BlogAdmin />
            
        </AuthContextProvider>
       
    );
};

export default Home;
