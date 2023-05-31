import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFThumbnail = ({ pdfUrl, numThumbnails = 3 }) => {
  const [numPages, setNumPages] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const generateThumbnails = async () => {
      const pageIndices = Array.from({ length: numPages }, (_, index) => index + 1);
    
      const thumbnailPromises = pageIndices
        .slice(0, numThumbnails)
        .map((pageIndex) =>
          pdfjs.getDocument(pdfUrl).promise.then((pdf) =>
            pdf.getPage(pageIndex).then((page) => {
              const canvas = document.createElement('canvas');
              const viewport = page.getViewport({ scale: 0.5 });
              const renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport,
              };

              canvas.height = viewport.height;
              canvas.width = viewport.width;
              console.log(thumbnailPromises);
              console.log("pageIndices");
        
              return page.render(renderContext).promise.then(() => canvas.toDataURL());
            })
          )
        );

      const thumbnailDataUrls = await Promise.all(thumbnailPromises);
      setThumbnails(thumbnailDataUrls);
    };

    if (pdfUrl) {
      generateThumbnails();
    }
  }, [pdfUrl, numPages, numThumbnails]);

  return (
    <div>
      {thumbnails.map((thumbnailDataUrl, index) => (
        <img key={index} src={thumbnailDataUrl} alt={`Thumbnail ${index + 1}`} />
      ))}
      {numPages !== null && numThumbnails < numPages && (
        <p>{`+ ${numPages - numThumbnails} more page(s)`}</p>
      )}
    </div>
  );
};

export default PDFThumbnail;
