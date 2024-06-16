document.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await fetch('/.netlify/functions/listFiles');
    const data = await response.json();

    const fileGrid = document.getElementById('fileGrid');

    if (data.files && data.files.length > 0) {
      data.files.forEach(file => {
        const button = document.createElement('button');
        button.classList.add('file-button');
        button.textContent = file.name;
        button.addEventListener('click', () => downloadFile(file.name));
        fileGrid.appendChild(button);
      });
    } else {
      const message = document.createElement('p');
      message.textContent = 'No files uploaded yet.';
      fileGrid.appendChild(message);
    }
  } catch (error) {
    console.error('Error fetching files:', error);
  }
});

async function downloadFile(filename) {
  try {
    const response = await fetch(`/.netlify/functions/download?filename=${filename}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}
