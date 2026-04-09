import Link from 'next/link';
import React from 'react';

const ContactPage = () => {

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
    return (
        <div>
            {
                blogs.map(blog => 
                    <div key={blog.id}> 
                        <h1>{blog.title}</h1>
                        <Link href={`/contact/${blog.id}`}>Show Details</Link>
                    </div>
                
                
                
                )
            }
        </div>
    );
};

export default ContactPage;