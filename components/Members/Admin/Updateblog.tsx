import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Plus, Image as ImageIcon, GripVertical, Type, Heading, X, Eye, Edit2, Code, Quote, List, ListOrdered } from 'lucide-react';
import { toast } from "react-toastify";
import axios from 'axios'; // Missing import
import ProtectedRoute from './ProtectedRoute';
import SideNav from '../sidenav';
import { uploadFile, deleteFile } from '../../../apis/room';
import { ToastContainer } from 'react-toastify';
// Types
export type BlockType = 'text' | 'image' | 'header' | 'code' | 'quote' | 'list';
export type ListType = 'bullet' | 'number';

interface FileState {
  file?: File;
  description?: string;
  publicId?: string;
  content?: string;
  url?: string;
  status?: 'idle' | 'uploading' | 'uploaded' | 'failed';
}
interface BlockOptions {
  language?: string;
  listType?: ListType;
}

interface Block {
  id: string;
  type: BlockType;
  content: string;
  order: number;
  language?: string;
  listType?: ListType;
}

interface BlogFormData {
  blogID: number | null;
  blogName: string;
  blogDescription: string;
  content: string;
  dpURL: string;
  imagePath?: string;
  parentBlog: number | null;
}

// API Configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://zine-backend.ip-ddns.com',
  headers: {
    'Content-Type': 'application/json',
    'stage': process.env.NEXT_PUBLIC_API_STAGE || 'prod'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Utility Functions
const generateId = () => crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Components
const LanguageSelector: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  const languages = ['javascript', 'python', 'typescript', 'html', 'css', 'java', 'c++', 'ruby', 'php'];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute top-2 right-2 px-2 py-1 text-sm bg-gray-100 rounded border border-gray-300"
    >
      {languages.map(lang => (
        <option key={lang} value={lang}>{lang}</option>
      ))}
    </select>
  );
};

const BlockMenu: React.FC<{
  onSelect: (type: BlockType, options?: BlockOptions) => void;
  onClose: () => void;
}> = ({ onSelect, onClose }) => {
  const menuItems = [
    { type: 'text', icon: Type, label: 'Text Block' },
    { type: 'header', icon: Heading, label: 'Header' },
    { type: 'code', icon: Code, label: 'Code Block' },
    { type: 'quote', icon: Quote, label: 'Quote' },
    { type: 'list', icon: List, label: 'Bullet List', options: { listType: 'bullet' } },
    { type: 'list', icon: ListOrdered, label: 'Numbered List', options: { listType: 'number' } },
    { type: 'image', icon: ImageIcon, label: 'Image URL' }
  ];

  return (
    <div className="absolute z-50 left-6 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu">
        {menuItems.map(({ type, icon: Icon, label, options }) => (
          <button
            key={`${type}-${label}`}
            onClick={() => {
              onSelect(type as BlockType, options);
              onClose();
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

const PreviewBlock: React.FC<{ block: Block }> = ({ block }) => {
  switch (block.type) {
    case 'header':
      return <h2 className="text-2xl font-bold mb-4">{block.content}</h2>;
    case 'text':
      return <p className="mb-4">{block.content}</p>;
    case 'code':
      return (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
          <code>{block.content}</code>
        </pre>
      );
    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">
          {block.content}
        </blockquote>
      );
    case 'list':
      const items = block.content.split('\n').filter(item => item.trim());
      return block.listType === 'bullet' ? (
        <ul className="list-disc pl-4 mb-4">
          {items.map((item, i) => (
            <li key={i} className="mb-2">{item}</li>
          ))}
        </ul>
      ) : (
        <ol className="list-decimal pl-4 mb-4">
          {items.map((item, i) => (
            <li key={i} className="mb-2">{item}</li>
          ))}
        </ol>
      );
    case 'image':
      return block.content ? (
        <div className="relative w-full h-64 mb-4">
          <Image
            src={block.content}
            alt="Block image"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      ) : null;
    default:
      return null;
  }
};

const EditBlock: React.FC<{
  block: Block;
  onChange: (content: string, language?: string) => void;
  onDelete: () => void;
  blogName: string;
  imageCount: number;
}> = ({ block, onChange, blogName, imageCount }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(block.imageUrl || '');
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const imageDescription = `contentimg:${blogName}_${imageCount}`;
      const response = await uploadFile(file, imageDescription);

      if (response.url) {
        setPreviewUrl(response.url);
        onChange(response.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  switch (block.type) {
    case 'text':
      return (
        <textarea
          value={block.content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your content here..."
          className="w-full min-h-[100px] p-2 border-none outline-none resize-none focus:ring-2 focus:ring-blue-500"
        />
      );
    case 'header':
      return (
        <input
          type="text"
          value={block.content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter heading..."
          className="w-full text-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    case 'code':
      return (
        <div className="relative w-full">
          <LanguageSelector
            value={block.language || 'javascript'}
            onChange={(language) => onChange(block.content, language)}
          />
          <textarea
            value={block.content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter your ${block.language || 'javascript'} code here...`}
            className="w-full min-h-[200px] p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    case 'quote':
      return (
        <div className="relative w-full border-l-4 border-gray-300 pl-4">
          <textarea
            value={block.content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter a quote..."
            className="w-full min-h-[100px] p-2 italic text-gray-600 border-none outline-none resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    case 'list':
      return (
        <textarea
          value={block.content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={block.listType === 'bullet' ? '• Enter list items (one per line)' : '1. Enter list items (one per line)'}
          className="w-full min-h-[100px] p-2 border-none outline-none resize-none focus:ring-2 focus:ring-blue-500"
        />
      );
    case 'image':
      return (
        <div className="relative w-full space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isUploading && <span>Uploading...</span>}
          </div>

          {previewUrl && (
            <div className="relative w-full h-64">
              <Image
                src={previewUrl}
                alt="Content image"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          )}
        </div>
      );


    default:
      return null;
  }
};

// Main BlogEditor Component
export default function BlogEditor() {
  const router = useRouter();
  const { parentId, blogId } = router.query;
  const [formData, setFormData] = useState<BlogFormData>({
    blogID: null,
    blogName: '',
    blogDescription: '',
    content: '',
    dpURL: '',
    parentBlog: null,
    imagePath: ''
  });
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<number | null>(null);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [addBlockIndex, setAddBlockIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileState, setFileState] = useState<FileState | null>(null);
  const [imageCounter, setImageCounter] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  // Add missing functions

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileState({
        file: file,
        description: formData.blogName,
        status: 'idle',
      });
    }
  };
  const removeFile = async () => {
    if (fileState && fileState.publicId) {
      setIsUploading(true);
      try {
        await deleteFile(fileState.publicId);
        setFileState(null);
      } catch (error) {
        alert('Failed to delete file.');
      } finally {
        setIsUploading(false);
      }
    } else {
      alert('No file to delete.');
    }
  };
  const handledelete = async (e) => {
    e.prevent.default();
    if (fileState?.url) {
      console.log(fileState.url)
      try {
        console.log(fileState.url)
        await removeFile();
        setFileState(null);
        setFormData(prev => ({ ...prev, dpURL: '' }));
        // console.log(formData)
      } catch (error) {
        alert('Failed to delete file.');
      } finally {
        setIsUploading(false);
        console.log(formData);
      }
    }
  }
  const handleUpload = async () => {
    if (fileState && fileState.status === 'idle') {
      setIsUploading(true);
      try {
        // console.log(fileState.file, fileState.description);
        let res = null
        if (fileState.file)
          res = await uploadFile(fileState.file, ((fileState.description) ? fileState.description : ''));
        setFormData(prev => ({ ...prev, dpURL: res.url }));
        // console.log(formData)

        // console.log(res);
        setFileState({
          ...fileState,
          publicId: res.publicId,
          url: res.url,
          status: 'uploaded',
        });
      } catch (error) {
        setFileState({ ...fileState, status: 'failed' });
        alert('Failed to upload file.');
      } finally {
        setIsUploading(false);
      }
    }

    else if (fileState && fileState.status === 'uploaded') {
      alert('No file to upload or already uploaded.');
    }
  };
  const handleBlockChange = (index: number, content: string, language?: string) => {
    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks];
      newBlocks[index] = {
        ...newBlocks[index],
        content,
        ...(language && { language })
      };
      return newBlocks;
    });
  };
  const reorderBlocks = (fromIndex: number, toIndex: number) => {
    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      return newBlocks.map((block, index) => ({ ...block, order: index }));
    });
  };

  const removeBlock = (index: number) => {
    setBlocks(prevBlocks => {
      const newBlocks = prevBlocks.filter((_, i) => i !== index);
      return newBlocks.map((block, index) => ({ ...block, order: index }));
    });
  };

  const addBlock = (type: BlockType, afterIndex: number, options?: BlockOptions) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: '',
      order: afterIndex + 1,
      ...options
    };

    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks];
      newBlocks.splice(afterIndex + 1, 0, newBlock);
      return newBlocks.map((block, index) => ({ ...block, order: index }));
    });

    // Reset the adding block state after adding
    setIsAddingBlock(false);
    setAddBlockIndex(null);
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!blogId) return;

      try {
        const queryId = parentId ? Number(parentId) : -1;
        const response = await api.get('/blog', { params: { id: queryId } });

        const targetBlog = response.data.blogs.find(
          (blog: any) => blog.blogID === Number(blogId)
        );

        if (targetBlog) {
          let parsedContent: Block[] = [];
          try {
            // Try to parse the content and strip HTML tags if needed
            parsedContent = JSON.parse(targetBlog.content);
            // If the content is a string (old format), create a single text block
            if (typeof parsedContent === 'string') {
              parsedContent = [{
                id: generateId(),
                type: 'text',
                content: parsedContent,
                order: 0
              }];
            }
          } catch {
            parsedContent = [{
              id: generateId(),
              type: 'text',
              content: targetBlog.content || '',
              order: 0
            }];
          }

          const formattedBlocks = parsedContent.map((block, index) => ({
            id: block.id || generateId(),
            type: block.type || 'text',
            content: block.content || '',
            order: index,
            language: block.language,
            listType: block.listType
          }));

          setBlocks(formattedBlocks);
          setFormData({
            blogID: Number(blogId),
            blogName: targetBlog.blogName,
            blogDescription: targetBlog.blogDescription,
            content: JSON.stringify(formattedBlocks),
            dpURL: targetBlog.dpURL,
            parentBlog: parentId ? Number(parentId) : null,
            imagePath: targetBlog.imagePath || ""
          });
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to fetch blog data');
      }
    };

    fetchBlogData();
  }, [blogId, parentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updatePayload = {
        ...formData,
        content: JSON.stringify(blocks)
      };
      console.log(updatePayload);
      const response = await api.put(`/blog/${blogId}`, updatePayload);
      if (response.status === 200) {
        toast.success('Blog updated successfully');
        router.push('/admin/blogsadmin');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      setError(error.response?.data?.message || 'Failed to update blog');
      toast.error(error.response?.data?.message || 'Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="max-w-4xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="mb-8">
                <input
                  type="text"
                  value={formData.blogName}
                  onChange={(e) => setFormData(prev => ({ ...prev, blogName: e.target.value }))}
                  placeholder="Enter blog title..."
                  className="w-full text-4xl font-bold border-none outline-none mb-4 placeholder-gray-300 bg-transparent"
                  required
                />

                <div className="relative w-full mb-8">
                  <label className="block text-sm font-medium text-gray-700">
                    Featured Image
                  </label>

                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={handleUpload}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Upload Image
                    </button>
                    <button
                      type="button"
                      onClick={handledelete}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Delete Image

                    </button>
                  </div>

                  {formData.dpURL && (
                    <div className="relative w-full h-96"> {/* Added fixed height to parent */}
                      <Image
                        src={formData.dpURL}
                        alt="Featured image preview"
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <textarea
                  value={formData.blogDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, blogDescription: e.target.value }))}
                  placeholder="Enter blog description..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg"
                >
                  {previewMode ? (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Edit Mode
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Preview Mode
                    </>
                  )}
                </button>
              </div>
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    draggable={!previewMode}
                    onDragStart={(e) => {
                      if (previewMode) return;
                      setDraggedBlock(index);
                      setIsDragging(true);
                    }}
                    onDragEnd={() => {
                      setIsDragging(false);
                      setDraggedBlock(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (previewMode) return;
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (previewMode) return;
                      if (draggedBlock !== null && draggedBlock !== index) {
                        reorderBlocks(draggedBlock, index);
                      }
                    }}
                    className={`group relative p-4 rounded-lg bg-white ${isDragging ? 'border-2 border-dashed border-gray-300' : ''
                      }`}
                  >
                    {previewMode ? (
                      <PreviewBlock block={block} />
                    ) : (
                      <div className="flex items-start gap-2">
                        <div className="opacity-0 group-hover:opacity-100 cursor-move">
                          <GripVertical className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-grow">
                          <EditBlock
                            block={block}
                            onChange={(content, language) => handleBlockChange(index, content, language)}
                          />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingBlock(true);
                              setAddBlockIndex(index);
                            }}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(index)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    )}
                    {isAddingBlock && addBlockIndex === index && (
                      <BlockMenu
                        onSelect={(type, options) => addBlock(type, index, options)}
                        onClose={() => {
                          setIsAddingBlock(false);
                          setAddBlockIndex(null);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>


              {!previewMode && blocks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No blocks added yet. Click the "Add New Block" button below to start creating your blog.
                </div>
              )}

              {!previewMode && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingBlock(true);
                      setAddBlockIndex(blocks.length - 1);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Block
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Updating...' : 'Update Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}