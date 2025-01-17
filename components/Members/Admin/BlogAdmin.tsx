import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ChevronDown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';
import axios, { AxiosInstance } from 'axios';
import ProtectedRoute from './ProtectedRoute';
import SideNav from '../sidenav';
import { ToastContainer } from 'react-toastify';

interface BlogData {
  blogID: number;
  blogName: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  featured?: boolean;
  parentId?: number;
}

interface LoadingState {
  [key: number]: boolean;
}

interface SubblogsState {
  [key: number]: BlogData[];
}

const BlogAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [expandedBlogIds, setExpandedBlogIds] = useState<Set<number>>(new Set());
  const [subblogs, setSubblogs] = useState<SubblogsState>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const router = useRouter();

  const api: AxiosInstance = axios.create({
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

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (): Promise<void> => {
    try {
      const response = await api.get('/blog', {
        params: { id: -1 }
      });
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchSubblogs = async (parentId: number): Promise<void> => {
    if (loading[parentId]) return;

    try {
      setLoading(prev => ({ ...prev, [parentId]: true }));
      const response = await api.get('/blog', {
        params: { id: parentId }
      });

      setSubblogs(prev => ({
        ...prev,
        [parentId]: response.data.blogs.map((blog: BlogData) => ({
          ...blog,
          parentId
        }))
      }));
    } catch (error) {
      console.error('Error fetching subblogs:', error);
    } finally {
      setLoading(prev => ({ ...prev, [parentId]: false }));
    }
  };

  const toggleExpand = async (blog: BlogData): Promise<void> => {
    const parentId = blog.blogID;
    setExpandedBlogIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
        fetchSubblogs(parentId);
      }
      return newSet;
    });
  };

  const handleEdit = (blog: BlogData): void => {
    router.push({
      pathname: '/admin/updateblog',
      query: {
        edit: true,
        blogId: blog.blogID,
        parentId: blog.parentId
      }
    });
  };

  const handleCreate = (): void => {
    router.push('/admin/createblogs');
  };

  const handleCreateSubblog = (parentId: number): void => {
    router.push({
      pathname: '/admin/createblogs',
      query: { parentId }
    });
  };

  const handleView = (blog: BlogData): void => {
    router.push({
      pathname: `/blogs/${blog.blogID}`,
      query: blog.parentId ? { parentId: blog.parentId } : {}
    });
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete('/blog', { data: { blogIds: [id] } });
        await fetchBlogs();
        setSubblogs({});
        setExpandedBlogIds(new Set());
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog');
      }
    }
  };

  const formatDate = (createdAt: { seconds: number; nanoseconds: number } | undefined): string => {
    if (!createdAt) return 'N/A';
    const date = new Date(createdAt.seconds * 1000);
    return date.toLocaleDateString();
  };

  interface BlogRowProps {
    blog: BlogData;
    level?: number;
  }

  const BlogRow: React.FC<BlogRowProps> = ({ blog, level = 0 }) => {
    const isExpanded = expandedBlogIds.has(blog.blogID);
    const hasSubblogs = subblogs[blog.blogID]?.length > 0;

    return (
      <>
        <tr className={`border-b border-gray-100 hover:bg-gray-50 ${level > 0 ? 'bg-gray-50' : ''}`}>
          <td className="py-3 px-4">
            <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
              <button
                onClick={() => toggleExpand(blog)}
                className="mr-2 focus:outline-none"
                disabled={loading[blog.blogID]}
              >
                {loading[blog.blogID] ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                ) : isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <span className="font-medium text-gray-900">{blog.blogName || 'Untitled Blog'}</span>
            </div>
          </td>
          <td className="py-3 px-4 text-gray-600">{formatDate(blog.createdAt)}</td>
          <td className="py-3 px-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </td>
          <td className="py-3 px-4 text-center">
            {blog.featured ? (
              <span className="text-blue-600">✓</span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </td>
          <td className="py-3 px-4">
            <div className="flex justify-end gap-2">
              <button
                className="p-1 text-gray-600 hover:text-green-600"
                onClick={() => handleCreateSubblog(blog.blogID)}
                title="Add Subblog"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-gray-600 hover:text-blue-600"
                onClick={() => handleView(blog)}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-gray-600 hover:text-yellow-600"
                onClick={() => handleEdit(blog)}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-gray-600 hover:text-red-600"
                onClick={() => handleDelete(blog.blogID)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
        {isExpanded && hasSubblogs && subblogs[blog.blogID]?.map(subblog => (
          <BlogRow key={subblog.blogID} blog={subblog} level={level + 1} />
        ))}
      </>
    );
  };

  const filteredBlogs = blogs.filter(blog => {
    const blogName = blog?.blogName || '';
    return blogName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <ProtectedRoute>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="grid grid-cols-12 h-screen" style={{ background: "#EFEFEF" }}>
        <SideNav />
        <div className="col-span-12 px-6 md:px-12 flex flex-col overflow-y-scroll md:col-span-9">
          <div className="p-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={handleCreate}
                  >
                    <Plus className="w-4 h-4" />
                    New Blog
                  </button>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Title</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900">Featured</th>
                        <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlogs.map(blog => (
                        <BlogRow key={blog.blogID} blog={blog} />
                      ))}
                    </tbody>
                  </table>

                  {filteredBlogs.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No blogs found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BlogAdmin;