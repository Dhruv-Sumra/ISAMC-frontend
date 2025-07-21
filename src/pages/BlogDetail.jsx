import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import blogs from '../data/blogs';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find(b => String(b.id) === String(id));

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto py-12 mt-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
        <p className="mb-6">Sorry, the blog you are looking for does not exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 mt-20 px-4">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>By {blog.author}</span>
        <span>|</span>
        <span>{new Date(blog.date).toLocaleDateString()}</span>
      </div>
      <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">{blog.summary}</p>
      <div className="prose dark:prose-invert max-w-none text-base text-gray-800 dark:text-gray-100 whitespace-pre-line">
        {blog.content}
      </div>
    </div>
  );
};

export default BlogDetail; 