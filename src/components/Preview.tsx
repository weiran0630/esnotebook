import { useRef, useEffect } from "react";
import "./styles/Preview.scss";

interface PreviewProps {
  code: string;
  status: string;
}

/**
 * @param html: hard-coded iframe srcDoc props
 * receive transpiled code (message) passed by parent and execute it inside iframe
 */
const html = `
  <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (error) => {
          const root = document.querySelector("#root");
          root.innerHTML =
            '<div style="color: red;">' + error + "</div>";
          console.error(error);
        };
        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error)
        })
        window.addEventListener('message', (event) => { 
          try {
            eval(event.data);
          } catch (error) {
            handleError(error)
          }
        }, false);
      </script>
    </body>
  </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, status }) => {
  const iframeRef = useRef<any>();
  useEffect(() => {
    iframeRef.current.srcdoc = html; // reset iframe.srcdoc with every re-render
    /**
     * delay postMessage to prevent postMessage apply to previous copy of srcdoc instead current one
     * post a message contains transpiled code to iframe
     */
    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(code, "*");
    }, 100);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {status && <div className="preview-bundle-error">{status}</div>}
    </div>
  );
};

export default Preview;
