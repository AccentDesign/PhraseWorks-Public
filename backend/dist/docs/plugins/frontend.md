### FrontEnd Plugin Folder

Once your folder is created you will need to create an index.js file in there

```
/*
Plugin Name - Frontend
*/
```

The plugin can have Admin based Components and Pages
Pages are specifically that, so if we add:
/Plugins/pluginName/Pages/pluginNamePage.jsx

We can populate it with:

```jsx
import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import PageContent from '../../../Admin/Components/PageContent.jsx';
import PluginPageContent from './Components/PluginPageContent.jsx';

const PluginNamePage = ({ siteTitle }) => {
  document.title = `Dashboard - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PluginPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default PluginNamePage;
```

Then in a Components folder inside the Pages folder we can add PluginPageContent.jsx

```jsx
import React from 'react';

const PluginPageContent = () => {
  return <div>PluginPageContent</div>;
};

export default PluginPageContent;
```

This will output the content seperated out from the parent page so you know it will appear in there without worrying about the headers, they are addded on the parent page.
