let fontSize = 18;
const content = document.getElementById('bookContent');
const body = document.body;

// Font size controls
document.getElementById('increaseFont').addEventListener('click', () => {
    fontSize += 2;
    content.style.fontSize = `${fontSize}px`;
});

document.getElementById('decreaseFont').addEventListener('click', () => {
    fontSize = Math.max(12, fontSize - 2);
    content.style.fontSize = `${fontSize}px`;
});

// Theme toggle
document.getElementById('toggleTheme').addEventListener('click', () => {
    body.classList.toggle('dark-theme');
});

// Configuração do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let currentPDF = null;
let currentPage = 1;
let totalPages = 0;

// Função para carregar o PDF
async function loadPDF(file) {
    const reader = new FileReader();
    
    reader.onload = async function(event) {
        const typedarray = new Uint8Array(event.target.result);
        
        try {
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            currentPDF = pdf;
            totalPages = pdf.numPages;
            renderPage(currentPage);
            updatePageNumber();
        } catch (error) {
            console.error('Erro ao carregar PDF:', error);
            alert('Erro ao carregar o PDF');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

// Função para renderizar a página
async function renderPage(pageNumber) {
    try {
        const page = await currentPDF.getPage(pageNumber);
        const canvas = document.getElementById('pdfCanvas');
        const context = canvas.getContext('2d');
        
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
    } catch (error) {
        console.error('Erro ao renderizar página:', error);
    }
}

// Função para atualizar o número da página
function updatePageNumber() {
    document.getElementById('pageNumber').textContent = `Página ${currentPage} de ${totalPages}`;
}

// Event Listeners
document.getElementById('pdfInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        loadPDF(file);
    }
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPDF && currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        updatePageNumber();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPDF && currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
        updatePageNumber();
    }
}); 