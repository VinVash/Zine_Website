import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader } from 'lucide-react';
import axios from 'axios';
import { BlogCard } from './Blogcard';

// Define the Blog interface
interface Blog {
  blogID: number;
  blogName: string | null;
  blogDescription: string | null;
  content: string;
  dpURL: string | null;
  imagePath: string | null;
  createdAt: {
    seconds: number;
    nanos: number;
  };
}

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://zine-test-backend.ip-ddns.com',
  headers: {
    'Content-Type': 'application/json',
    'stage': 'test'
  }
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const BlogsDisplay = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchParentBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/blog', {
          params: {
            id: -1
          }
        });

        setBlogs(response.data.blogs || []);
        console.log(response.data.blogs);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle Axios specific errors
          const errorMessage = error.response?.data?.message || error.message;
          setError(errorMessage);
        } else {
          // Handle other types of errors
          setError('Failed to fetch blogs');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchParentBlogs();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.blogID}
            blog={blog}
            // onClick={() => router.push(`/admin/adminblogs/${blog.blogID}`)
            onClick={() => router.push(`/blogs/${blog.blogID}`)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default BlogsDisplay;