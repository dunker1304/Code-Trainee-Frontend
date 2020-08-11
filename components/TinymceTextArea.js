import { Editor } from '@tinymce/tinymce-react';

const TinymceTextArea = ({ value = '', onChange = () => {} }) => {
  return (
    <div
      className='ant-input'
      style={{
        margin: 0,
        padding: 0,
      }}>
      <Editor
        init={{
          height: 250,
          menubar: false,
          plugins: [
            'advlist autolink lists link preview',
            'searchreplace visualblocks fullscreen codesample',
            'table paste code',
          ],
          toolbar:
            'undo redo | fontselect fontsizeselect formatselect | bold italic underline strikethrough | \
forecolor backcolor | alignleft aligncenter alignright alignjustify | \
 bullist numlist outdent indent | table link  codesample | code | fullscreen preview',
          content_css: '//www.tiny.cloud/css/codepen.min.css',
          importcss_append: true,
          content_css_cors: true,
          quickbars_selection_toolbar:
            'bold italic | quicklink h2 h3 blockquote quicktable',
          toolbar_mode: 'sliding',
          contextmenu: 'link table configurepermanentpen',
        }}
        onEditorChange={onChange}
        value={value}
      />
    </div>
  );
};

export default TinymceTextArea;
