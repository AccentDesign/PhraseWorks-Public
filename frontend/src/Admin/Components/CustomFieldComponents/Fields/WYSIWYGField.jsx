import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const WYSIWYGField = ({ type, value, setValue, label, name, defaultValue, args }) => {
  return (
    <div className="w-full mb-4">
      <label>{label}</label>
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        license_key="gpl"
        value={value}
        init={{
          height: 500,
          menubar: true,
          plugins: 'advlist link image lists',
          toolbar:
            'undo redo | styles | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | help',
          branding: false,
          script_url: '/tinymce/tinymce.min.js',
        }}
        onEditorChange={(content, editor) => setValue({ target: { value: content } })}
      />
    </div>
  );
};

export default WYSIWYGField;
