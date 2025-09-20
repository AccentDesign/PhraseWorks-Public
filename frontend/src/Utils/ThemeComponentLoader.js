import React from 'react';

const pages = import.meta.glob('../Content/*/Pages/Page.jsx');
const posts = import.meta.glob('../Content/*/Pages/Post.jsx');
const authors = import.meta.glob('../Content/*/Pages/Author.jsx');
const categories = import.meta.glob('../Content/*/Pages/Category.jsx');
const homepages = import.meta.glob('../Content/*/Pages/HomePage.jsx');
const logins = import.meta.glob('../Content/*/Pages/Login.jsx');
const signups = import.meta.glob('../Content/*/Pages/SignUp.jsx');
const notFound = import.meta.glob('../Content/*/Pages/NotFound.jsx');

const styles = import.meta.glob('../Content/*/styles.css');
let currentThemeId = null;

export async function loadThemeCSS(theme) {
  const match = Object.keys(styles).find((path) => path.includes(`/Content/${theme}/styles.css`));
  if (!match) return console.warn('No CSS found for theme:', theme);

  if (currentThemeId) {
    const oldStyle = document.querySelector(`style[data-vite-dev-id="${currentThemeId}"]`);
    if (oldStyle) oldStyle.remove();
  }

  await styles[match]();

  currentThemeId = match;
}

function findMatch(globs, theme, file) {
  const match = Object.keys(globs).find((path) => path.includes(`/Content/${theme}/Pages/${file}`));
  return globs[match];
}

export function ThemeComponentLoader(theme) {
  loadThemeCSS(theme);

  const Page = findMatch(pages, theme, 'Page.jsx');
  const Post = findMatch(posts, theme, 'Post.jsx');
  const Category = findMatch(categories, theme, 'Category.jsx');
  const Author = findMatch(authors, theme, 'Author.jsx');
  const HomePage = findMatch(homepages, theme, 'HomePage.jsx');
  const Login = findMatch(logins, theme, 'Login.jsx');
  const SignUp = findMatch(signups, theme, 'SignUp.jsx');
  const NotFound = findMatch(notFound, theme, 'NotFound.jsx');

  if (!Page || !Post || !HomePage || !Login || !SignUp || !NotFound) {
    console.error('Missing component(s):', { Page, Post, HomePage, Login, SignUp, NotFound });
    throw new Error(`One or more components not found for theme: ${theme}`);
  }

  return {
    Page: React.lazy(Page),
    Post: React.lazy(Post),
    Author: React.lazy(Author),
    Category: React.lazy(Category),
    HomePage: React.lazy(HomePage),
    Login: React.lazy(Login),
    SignUp: React.lazy(SignUp),
    NotFound: React.lazy(NotFound),
  };
}
