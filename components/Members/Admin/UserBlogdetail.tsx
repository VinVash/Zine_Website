import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Clock, Loader } from 'lucide-react';
import DOMPurify from 'dompurify';
import apiimg from '../../../api/axios';
import axios from 'axios';

interface Blog {
  blogID: number;
  blogName: string | null;
  blogDescription: string | null;
  content: string;
  dpURL: string | null;
  createdAt: {
    seconds: number;
    nanos: number;
  };
}

// Create axios instance
const api = axios.create({
  baseURL: 'https://zine-test-backend.ip-ddns.com',
  headers: {
    'Content-Type': 'application/json',
    'stage': 'test'
  }
});

const renderBlock = (block: any) => {
  try {
    switch (block.type) {
      case 'text':
        return (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(block.content)
            }}
          />
        );

      case 'header':
        return (
          <h2
            className="text-2xl font-bold mt-6 mb-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(block.content)
            }}
          />
        );

      case 'quote':
        return (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 italic my-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(block.content)
            }}
          />
        );

      case 'code':
        return (
          <div className="relative">
            {block.language && (
              <div className="absolute top-2 right-2 px-2 py-1 text-sm bg-gray-800 text-gray-300 rounded">
                {block.language}
              </div>
            )}
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <code className="font-mono text-sm whitespace-pre-wrap break-words">
                {block.content}
              </code>
            </pre>
          </div>
        );

      case 'list':
        const listItems = block.content.split('\n').filter((item: string) => item.trim());
        const ListComponent = block.listType === 'bullet' ? 'ul' : 'ol';
        return (
          <ListComponent
            className={`ml-6 space-y-2 ${block.listType === 'bullet' ? 'list-disc' : 'list-decimal'
              }`}
          >
            {listItems.map((item: string, index: number) => (
              <li
                key={index}
                className="text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(item)
                }}
              />
            ))}
          </ListComponent>
        );

      case 'image':
        return (
          <div className="relative w-full h-96 my-8">
            <Image
              src={block.content}
              alt="Blog content"
              width={800}
              height={600}
              className="object-contain rounded-lg"
              priority
              unoptimized
            />
          </div>
        );

      default:
        return null;
    }
  } catch (error) {
    console.error(`Error rendering block:`, error);
    return null;
  }
};

const SubBlogCard = ({ blog, onClick }: { blog: Blog; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
  >
    <div className="flex items-start space-x-4">
      {blog.dpURL && (
        <div className="relative h-20 w-20 flex-shrink-0">
          <Image
            src={blog.dpURL}
            alt={blog.blogName || 'Blog thumbnail'}
            width={80}
            height={80}
            className="object-cover rounded-lg"
            unoptimized
          />
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">
          {blog.blogName || 'Untitled Blog'}
        </h3>
        {blog.blogDescription && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {blog.blogDescription}
          </p>
        )}
        <div className="flex items-center text-gray-500 text-xs mt-2">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}
        </div>
      </div>
    </div>
  </div>
);

const ContentRenderer = ({ content }: { content: string }) => {
  try {
    const blocks = JSON.parse(content);
    return (
      <div className="space-y-6">
        {blocks.map((block: any, index: number) => (
          <div key={index}>{renderBlock(block)}</div>
        ))}
      </div>
    );
  } catch (error) {
    return <div className="prose max-w-none">{content}</div>;
  }
};

export const UserBlogDetail = () => {
  const router = useRouter();
  const { id: blogId, parentId } = router.query;
  const [mainBlog, setMainBlog] = useState<Blog | null>(null);
  const [subBlogs, setSubBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!blogId) return;

      try {
        setIsLoading(true);
        setError(null);

        // If we have a parentId, fetch subblogs from the parent first
        if (parentId) {
          const parentSubBlogsResponse = await api.get<{ blogs: Blog[] }>('/blog', {
            params: { id: parentId }
          });

          // Find our current blog in the parent's subblogs
          const currentBlog = parentSubBlogsResponse.data.blogs.find(
            blog => blog.blogID.toString() === blogId.toString()
          );

          if (currentBlog) {
            setMainBlog(currentBlog);
            // Fetch subblogs of the current blog
            const subBlogsResponse = await api.get<{ blogs: Blog[] }>('/blog', {
              params: { id: blogId }
            });
            setSubBlogs(subBlogsResponse.data.blogs);
          } else {
            throw new Error('Blog not found in parent\'s subblogs');
          }
        } else {
          // If no parentId, follow original logic
          const subBlogsResponse = await api.get<{ blogs: Blog[] }>('/blog', {
            params: { id: blogId }
          });

          if (subBlogsResponse.data.blogs) {
            const allBlogsResponse = await api.get<{ blogs: Blog[] }>('/blog', {
              params: { id: -1 }
            });

            let currentBlog = allBlogsResponse.data.blogs.find(
              blog => blog.blogID.toString() === blogId.toString()
            );

            if (!currentBlog) {
              for (const parentBlog of allBlogsResponse.data.blogs) {
                const parentSubBlogsResponse = await api.get<{ blogs: Blog[] }>('/blog', {
                  params: { id: parentBlog.blogID }
                });

                currentBlog = parentSubBlogsResponse.data.blogs.find(
                  blog => blog.blogID.toString() === blogId.toString()
                );

                if (currentBlog) break;
              }
            }

            if (currentBlog) {
              setMainBlog(currentBlog);
              setSubBlogs(subBlogsResponse.data.blogs);
            } else {
              throw new Error('Blog not found');
            }
          } else {
            throw new Error('Blog not found');
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || 'Failed to fetch blog data');
        } else {
          setError('Failed to fetch blog data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [blogId, parentId]);

  const handleSubBlogClick = (subBlog: Blog) => {
    router.push({
      // pathname: `/admin/adminblogs/${subBlog.blogID}`,
      pathname: `/blogs/${subBlog.blogID}`,
      query: {
        parentId: blogId,
      }
    });
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!mainBlog) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
          Blog not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="mb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {mainBlog.dpURL && (
            <div className="relative w-full min-h-[400px] overflow-hidden">
              <img
                src={mainBlog.dpURL}
                alt={mainBlog.blogName || 'Blog image'}
                className="w-full h-auto object-contain max-h-[600px]"
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            <header className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {mainBlog.blogName || 'Untitled Blog'}
              </h1>
              {mainBlog.blogDescription && (
                <p className="text-xl text-gray-600">{mainBlog.blogDescription}</p>
              )}
              <div className="flex items-center justify-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                {new Date(mainBlog.createdAt.seconds * 1000).toLocaleDateString()}
              </div>
            </header>

            <ContentRenderer content={mainBlog.content} />
          </div>
        </div>
      </article>

      {subBlogs.length > 0 && (
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="space-y-4">
            {subBlogs.map((subBlog) => (
              <SubBlogCard
                key={subBlog.blogID}
                blog={subBlog}
                onClick={() => handleSubBlogClick(subBlog)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default UserBlogDetail;