import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Clock, Loader, Plus, Edit, Trash2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { useParams } from 'react-router-dom'
// import { useSearchParams } from 'next/navigation';


// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://zine-backend.ip-ddns.com',
  headers: {
    'Content-Type': 'application/json',
    'stage': 'prod'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

const parseJsonToText = (jsonString: string) => {
  try {
    const blocks = JSON.parse(jsonString);
    return blocks.map((block: any) => {
      switch (block.type) {
        case 'text':
          return block.content;
        case 'header':
          return block.content;
        case 'quote':
          return block.content;
        case 'code':
          return block.content;
        case 'list':
          return block.content;
        default:
          return block.content || '';
      }
    }).join('\n\n');
  } catch (error) {
    console.error('Error parsing content:', error);
    return '';
  }
};

const convertTextToJson = (text: string) => {
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  const blocks = paragraphs.map(paragraph => ({
    type: 'text',
    content: paragraph.trim()
  }));
  return JSON.stringify(blocks);
};

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
          <div className="relative group">
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
              width={300}
              height={300}
              src={block.content}
              alt="Blog content"

              className="object-contain rounded-lg"
              priority
              unoptimized
            />
          </div>
        );

      default:
        console.warn(`Unhandled block type: ${block.type}`);
        return null;
    }
  } catch (error) {
    console.error(`Error rendering block:`, error, block);
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Failed to render content block
      </div>
    );
  }
};

const SubBlogCard = ({ blog, onClick }: { blog: Blog; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 transition-colors cursor-pointer"
  >
    <div className="flex items-start space-x-4">
      {blog.dpURL && (
        <div className="relative h-16 w-16 flex-shrink-0">
          <Image
            src={blog.dpURL}
            alt={blog.blogName || 'Sub-blog cover'}

            width={300}
            height={300}
            className="object-cover rounded-lg"
            unoptimized
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {blog.blogName || 'Untitled Sub-blog'}
        </h3>
        {blog.blogDescription && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
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

export const BlogDetail = () => {
  const router = useRouter();
  const [mainBlog, setMainBlog] = useState<Blog | null>(null);
  const [subBlogs, setSubBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogHierarchy, setBlogHierarchy] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [parsedContent, setParsedContent] = useState('');
  const [editForm, setEditForm] = useState({
    blogName: '',
    blogDescription: '',
    content: '',
    dpURL: '',
    parentBlog: '',
    imagePath: ''
  });

  // console.log(useParams())

  const { id: blogId, parentId } = router.query;
  console.log(blogId, parentId);
  const handleCreateSubBlog = () => {
    router.push({
      pathname: '/admin/createblogs',
      query: {
        parentId: blogId
      }
    });
  };
  const api = axios.create({
    baseURL: 'https://zine-backend.ip-ddns.com',
    headers: {
      'Content-Type': 'application/json',
      'stage': 'prod'
    }
  });

  // Request interceptor for adding auth token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

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
      pathname: `/admin/adminblogs/${subBlog.blogID}`,
      // pathname: `/blogs/${subBlog.blogID}`,
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
  const handleEdit = () => {
    if (mainBlog) {
      setEditForm({
        blogName: mainBlog.blogName || '',
        blogDescription: mainBlog.blogDescription || '',
        content: mainBlog.content,
        dpURL: mainBlog.dpURL || '',
        parentBlog: parentId?.toString() || '',
        imagePath: mainBlog.imagePath || ''
      });
      setIsEditing(true);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/blog/${blogId}`, editForm);
      // Refresh the blog data
      const response = await api.get<{ blogs: Blog[] }>('/blog', {
        params: { id: blogId }
      });
      const updatedBlog = response.data.blogs[0];
      setMainBlog(updatedBlog);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating blog:', error);
      setError('Failed to update blog');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await api.delete('/blog', {
        data: { blogIds: [blogId] }
      });
      router.push('/admin/adminblogs'); // Redirect to blogs list
      // router.push(`/blogs`);
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog');
    }
  };

  const handleDeleteSubBlog = async (subBlogId: number) => {
    if (!window.confirm('Are you sure you want to delete this sub-blog?')) {
      return;
    }

    try {
      await api.delete('/blog', {
        data: { blogIds: [subBlogId] }
      });
      // Refresh sub-blogs list
      const response = await api.get<{ blogs: Blog[] }>('/blog', {
        params: { id: blogId }
      });
      setSubBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error deleting sub-blog:', error);
      setError('Failed to delete sub-blog');
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setParsedContent(newText);
    // Convert back to JSON format when updating form state
    const jsonContent = convertTextToJson(newText);
    setEditForm(prev => ({ ...prev, content: jsonContent }));
  };

  const ContentRenderer = ({ content }: { content: string }) => {
    try {
      const blocks = JSON.parse(content);
      return (
        <div className="space-y-6">
          {blocks.map((block: any, index: number) => (
            <div key={index}>
              {renderBlock(block)}
            </div>
          ))}
        </div>
      );
    } catch (error) {
      console.error('Error parsing content:', error);
      return (
        <div className="prose max-w-none">
          {content}
        </div>
      );
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="mb-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex justify-end p-4 space-x-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Blog Name</label>
                <input
                  type="text"
                  value={editForm.blogName}
                  onChange={(e) => setEditForm({ ...editForm, blogName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editForm.blogDescription}

                  onChange={(e) => setEditForm({ ...editForm, blogDescription: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={parsedContent}
                  onChange={handleContentChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={10}
                  placeholder="Enter your content here..."
                />
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <ContentRenderer content={editForm.content} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  value={editForm.dpURL}
                  onChange={(e) => setEditForm({ ...editForm, dpURL: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              {mainBlog.dpURL && (
                <div className="relative w-full min-h-[400px] overflow-hidden">
                  <img
                    src={mainBlog.dpURL}
                    alt={mainBlog.blogName || 'Blog image'}
                    className="w-full h-auto object-contain max-h-[600px]"
                  />
                </div>
              )}
              <div className="p-6 space-y-6 text-center">
                <header className="space-y-4">
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
            </>
          )}
        </div>
      </article>

      {/* Sub-blogs section with delete functionality */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Related Blogs</h2>
          <button
            onClick={handleCreateSubBlog}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Sub-blog
          </button>
        </div>

        <div className="space-y-4">
          {subBlogs.length > 0 ? (
            subBlogs.map((subBlog) => (
              <div key={subBlog.blogID} className="relative group">
                <SubBlogCard
                  blog={subBlog}
                  onClick={() => handleSubBlogClick(subBlog)}
                />
                <button
                  onClick={() => handleDeleteSubBlog(subBlog.blogID)}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No sub-blogs yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};



export default BlogDetail;