document.addEventListener("DOMContentLoaded", () => {
    const fileList = document.getElementById('file-list');
    const previewModal = document.getElementById('preview-modal');
    const previewFrame = document.getElementById('preview-frame');
    const closeModal = document.querySelector('.close');

    // Fetch and display the file list
    fetch('/.netlify/functions/listFiles')
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <span>${file.name}</span>
                    <div>
                        <button onclick="previewFile('${file.url}')">Preview</button>
                        <button onclick="downloadFile('${file.name}')">Download</button>
                    </div>
                `;
                fileList.appendChild(fileItem);
            });
        });

    // Preview file
    window.previewFile = (url) => {
        previewFrame.src = url;
        previewModal.style.display = "block";
    };

    // Download file
    window.downloadFile = (fileName) => {
        window.location.href = `/.netlify/functions/download?fileName=${fileName}`;
    };

    // Close modal
    closeModal.onclick = () => {
        previewModal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target == previewModal) {
            previewModal.style.display = "none";
        }
    };
});
