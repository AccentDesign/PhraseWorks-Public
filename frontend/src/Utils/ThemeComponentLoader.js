import React from 'react';

const pages = import.meta.glob('../Content/*/Pages/Page.jsx');
const posts = import.meta.glob('../Content/*/Pages/Post.jsx');
const authors = import.meta.glob('../Content/*/Pages/Author.jsx');
const categories = import.meta.glob('../Content/*/Pages/Category.jsx');
const homepages = import.meta.glob('../Content/*/Pages/HomePage.jsx');
const logins = import.meta.glob('../Content/*/Pages/Login.jsx');
const page404s = import.meta.glob('../Content/*/Pages/Page404.jsx');

function findMatch(globs, theme, file) {
  const match = Object.keys(globs).find(
    (path) => path.includes(`/Content/${theme}/Pages/${file}`), // note leading slash
  );
  return globs[match];
}

export function ThemeComponentLoader(theme) {
  const Page = findMatch(pages, theme, 'Page.jsx');
  const Post = findMatch(posts, theme, 'Post.jsx');
  const Category = findMatch(categories, theme, 'Category.jsx');
  const Author = findMatch(authors, theme, 'Author.jsx');
  const HomePage = findMatch(homepages, theme, 'HomePage.jsx');
  const Login = findMatch(logins, theme, 'Login.jsx');
  const Page404 = findMatch(page404s, theme, 'Page404.jsx');

  if (!Page || !Post || !HomePage || !Login || !Page404) {
    console.error('Missing component(s):', { Page, Post, HomePage, Login, Page404 });
    throw new Error(`One or more components not found for theme: ${theme}`);
  }

  return {
    Page: React.lazy(Page),
    Post: React.lazy(Post),
    Author: React.lazy(Author),
    Category: React.lazy(Category),
    HomePage: React.lazy(HomePage),
    Login: React.lazy(Login),
    Page404: React.lazy(Page404),
  };
}
