import React from 'react';

   const blogs = [
  {
    id: 1,
    title: "Getting Started with React",
    author: "Rashed Mercy",
    date: "2026-04-01",
    category: "Web Development",
    description: "Learn the basics of React including components, props, and state.",
    tags: ["React", "JavaScript", "Frontend"]
  },
  {
    id: 2,
    title: "Understanding ASP.NET Core MVC",
    author: "Rashed Mercy",
    date: "2026-03-28",
    category: "Backend Development",
    description: "A beginner-friendly guide to ASP.NET Core MVC architecture and features.",
    tags: ["ASP.NET", "C#", "MVC"]
  },
  {
    id: 3,
    title: "Mastering JavaScript ES6 Features",
    author: "Rashed Mercy",
    date: "2026-03-20",
    category: "Programming",
    description: "Explore modern JavaScript features like arrow functions, destructuring, and modules.",
    tags: ["JavaScript", "ES6", "Coding"]
  },
  {
    id: 4,
    title: "Introduction to Git and GitHub",
    author: "Rashed Mercy",
    date: "2026-03-15",
    category: "Tools",
    description: "Understand version control using Git and how to collaborate using GitHub.",
    tags: ["Git", "GitHub", "Version Control"]
  }
];

const BlogDetailsPage = async({params}) => {
    console.log("params",params)

    const {blogid} = await params;
    const blog = blogs.find(blog => blog.id === parseInt(blogid))
    console.log('Show me params',blog);

    return (
        <div>
            <h2>Blog Details Coming soon</h2>

            {
                blog && 
                <div>
                    <h1 className='text-4xl font-bold mb-2'>{blog.title}</h1>
                    <p>{blog.description}</p>
                    
                </div>
            }
            
        </div>
    );
};

export default  BlogDetailsPage ;