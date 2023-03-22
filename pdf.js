const pdfForm = document.getElementById('pdf-form');
const pdfFile = document.getElementById('pdf-file');
const submitBtn = document.getElementById('submit-btn');
const textContainer = document.getElementById('text-container');

pdfForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const reader = new FileReader();
	reader.readAsArrayBuffer(pdfFile.files[0]);

	reader.onload = async () => {
		const typedArray = new Uint8Array(reader.result);
		const pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
		const page = await pdfDoc.getPage(1);
		const content = await page.getTextContent();
		const text = content.items.map(item => item.str).join(' ');
		textContainer.innerText = text;
		textContainer.style.display = 'block';
	};
});


//added summary api from chatGPT

const openaiApiKey = "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";

async function generateSummary(text) {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${'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'}`
        },
        body: JSON.stringify({
            prompt: `Summarize the following text:\n${text}`,
            max_tokens: 60,
            n: 1,
            stop: ['\n']
        })
    });

    const json = await response.json();
    const summary = json.choices[0].text.trim();
    return summary;
}

pdfForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const reader = new FileReader();
    reader.readAsArrayBuffer(pdfFile.files[0]);

    reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const page = await pdfDoc.getPage(1);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');

        const summary = await generateSummary(text);
		console.log(textContainer);
        textContainer.innerText = summary;
        textContainer.style.display = 'block';
    };
});
