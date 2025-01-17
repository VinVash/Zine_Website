import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

export const BlogCard = ({ blog, onClick }: { blog: Blog; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="col-span-1 shadow-xl p-4 flex flex-col rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
  >
    {/* Image Section */}
    {blog.dpURL ? (
      <div className="relative h-48 w-full mb-4">
        <Image
          src={blog.dpURL}
          alt={blog.blogName || 'Blog cover'}
          layout="responsive"
          width={800}  // Adjust the width to control the image size
          height={400}  // Adjust the height to control the image size
          objectFit="cover"  // Ensures the image covers the area without getting distorted
          unoptimized
          className="rounded-lg transition-transform duration-300 hover:scale-105"
        />
      </div>
    ) : (
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 mb-4 rounded-lg" />
    )}

    {/* Blog Title */}
    <h1 className="text-xl font-bold text-gray-900 mb-2 px-2">{blog.blogName || 'Untitled Blog'}</h1>

    {/* Blog Description */}
    {blog.blogDescription && (
      <p className="flex-1 text-gray-600 text-sm mb-4 px-2 line-clamp-3">
        {blog.blogDescription}
      </p>
    )}

    {/* Go to Blog Link */}
    <div className="text-right text-red-600 underline">
      <Link href={`/blogs/${blog.blogID}`}>Go to Blog</Link>
    </div>
  </div>
);
