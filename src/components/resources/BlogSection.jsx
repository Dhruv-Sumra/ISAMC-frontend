import React from 'react';
import { useNavigate } from 'react-router-dom';
import blogs from '../../data/blogs';

const BlogSection = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full py-12 bg-gray-50 mt-20 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">Blogs & Articles</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{blog.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>By {blog.author}</span>
                  <span>{new Date(blog.date).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                  className="mt-auto inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium text-center"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 