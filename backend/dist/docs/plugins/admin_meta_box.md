### Adding an admin page meta box to posts/pages

In the admin index.js file we can add:

```js
adminPageComponents: {
    add_page: [
        {
            name: 'Plugin Name MetaBox',
            location: '/src/Plugins/pluginName/Components/PluginNameMetaBox',
        },
    ],
},
```

To the default export, so it looks like:

```js
export default {
  version: '0.0.1',
  name: 'Plugin Name',
  slug: 'pluginName',
  description: 'A plugin for...',
  author: 'Your Name',
  authorUrl: 'http://yoururl.com',
  resolvers,
  typeDefs,
  init: init,
  disable: disable,
  adminPageComponents: {
    add_page: [
      {
        name: 'Plugin Name MetaBox',
        location: '/src/Plugins/pluginName/Components/PluginNameMetaBox',
      },
    ],
  },
};
```

This will allow us to add to the add new page a meta box underneath the rest of the content in the admin area.

There are other admin pages you could add metaboxes to, to find them (until i write the readme fully) search in the frontend the Admin folder for:

```jsx
<PluginComponents page="" />
```

Whatever the page is is what you would put them under, so an edit page would be

```js
adminPageComponents: {
    add_page: [
        {
            name: 'Plugin Name MetaBox',
            location: '/src/Plugins/pluginName/Components/PluginNameMetaBox',
        },
    ],
    edit_page: [
        {
            name: 'Plugin Name Edit Metabox',
            location: '/src/Plugins/pluginName/Components/EditPagePluginMetaBox',
        }
    ]
}
```

An example of one of these Components is:

```jsx
import React from 'react';

const PluginNameMetaBox = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold">Plugin Name MetaBox</h1>
      <p>In here we could have loads of stuff as its a really simple component!</p>
      <p>It gets loaded in a really interesting and insane way of course.</p>
    </div>
  );
};

export default PluginNameMetaBox;
```
